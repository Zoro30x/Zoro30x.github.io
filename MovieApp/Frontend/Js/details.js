const API_KEY = "00c39ab56da9cde1508182e6ec0fd2ee";
const BASE_URL = "https://api.themoviedb.org/3";
const posterBaseURL = "https://image.tmdb.org/t/p/w500";
const backdropBaseURL = "https://image.tmdb.org/t/p/original";

// Extract type and id from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type"); // either 'movie' or 'tv'
const id = urlParams.get("id");

// DOM Elements
const titleElement = document.getElementById("title");
const genresElement = document.getElementById("genres");
const descriptionElement = document.getElementById("description");
const posterElement = document.getElementById("poster");
const castListElement = document.getElementById("cast-list");
const trailerElement = document.getElementById("trailer");

// Watch Later and Favorites buttons
const watchLaterButton = document.getElementById("add-watch-later");
const favoritesButton = document.getElementById("add-favorites");

// Function to fetch Movie/TV Show Details
async function fetchDetails() {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    );
    const data = await response.json();

    // Check if data is returned correctly
    if (!data || (!data.title && !data.name)) {
      alert("Movie/TV series details not found!");
      return;
    }

    // Update page elements
    titleElement.textContent = data.title || data.name;
    descriptionElement.textContent = data.overview;
    posterElement.src = `${posterBaseURL}${data.poster_path}`;

    document.querySelector(
      ".details-container"
    ).style.backgroundImage = `url(${backdropBaseURL}${data.backdrop_path})`;

    // Genres
    genresElement.innerHTML = data.genres
      .map((genre) => `<span class="genre">${genre.name}</span>`)
      .join("");

    // Cast list
    const cast = data.credits.cast.slice(0, 5); // Top 5 cast members
    castListElement.innerHTML = cast
      .map(
        (actor) =>
          `<div class="cast-member">
            <img src="${
              actor.profile_path
                ? posterBaseURL + actor.profile_path
                : "./assets/no-image.png"
            }" alt="${actor.name}" />
            <p>${actor.name}</p>
          </div>`
      )
      .join("");

    // Trailer
    const trailer = data.videos.results.find(
      (video) => video.type === "Trailer"
    );
    if (trailer) {
      trailerElement.src = `https://www.youtube.com/embed/${trailer.key}`;
    } else {
      trailerElement.parentElement.style.display = "none"; // Hide section if no trailer
    }
  } catch (error) {
    console.error("Error fetching details:", error);
    alert("An error occurred while fetching movie details.");
  }
}

// Fetch details on page load
fetchDetails();

// Function to handle adding to Watch Later or Favorites
async function handleAddToList(category) {
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

  if (!userId) {
    alert("Please log in to use this feature!");
    return;
  }

  // Movie/TV series details to add
  const movie = {
    id,
    title: titleElement.textContent || "Unknown Title",
    posterPath: posterElement.src || "",
  };

  // Determine if it's a movie or TV show and the appropriate category
  const categoryType =
    category === "watchlater"
      ? type === "movie"
        ? "moviesWatchlater"
        : "tvWatchlater"
      : category === "favorites"
      ? type === "movie"
        ? "moviesFavourites"
        : "tvFavourites"
      : "";

  if (!categoryType) {
    alert("Invalid category.");
    return;
  }

  try {
    const response = await fetch(
      `https://zekos-movie-website.onrender.com/api/user/watchlist/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId, // Pass userId in the headers
        },
        body: JSON.stringify({ userId, category: categoryType, movie }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      alert(`${movie.title} added to ${categoryType}!`);
    } else {
      alert(data.message || `Failed to add to ${categoryType}`);
    }
  } catch (error) {
    console.error(`Error adding to ${categoryType}:`, error);
    alert("An error occurred. Please try again.");
  }
}

watchLaterButton.addEventListener("click", () => handleAddToList("watchlater"));
favoritesButton.addEventListener("click", () => handleAddToList("favorites"));

async function fetchSimilarContent() {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const similarItems = data.results.slice(0, 15); // Limit to 15 items
    updateSimilarContentRow(similarItems);
  } catch (error) {
    console.error("Error fetching similar content:", error);
  }
}

function updateSimilarContentRow(items) {
  const contentRow = document.querySelector(".similar .content-row");
  contentRow.innerHTML = ""; // Clear previous content

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    img.alt = item.title || item.name;

    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = item.title || item.name;

    // Redirect to details page on click
    card.addEventListener("click", () => {
      const newId = item.id;
      const newType = item.title ? "movie" : "tv"; // Determine type
      window.location.href = `./details.html?type=${newType}&id=${newId}`;
    });

    card.appendChild(img);
    card.appendChild(title);
    contentRow.appendChild(card);
  });
}

// Initialize page load
fetchSimilarContent();

// Scroll effect for header
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.querySelectorAll(".content-row").forEach((row) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Mouse down event to start dragging
  row.addEventListener("mousedown", (e) => {
    isDragging = true;
    row.classList.add("dragging");
    startX = e.pageX - row.offsetLeft;
    scrollLeft = row.scrollLeft;
    e.preventDefault();
  });

  // Mouse leave event to stop dragging
  row.addEventListener("mouseleave", () => {
    isDragging = false;
    row.classList.remove("dragging");
  });

  // Mouse up event to stop dragging
  row.addEventListener("mouseup", () => {
    isDragging = false;
    row.classList.remove("dragging");
  });

  // Mouse move event to perform dragging
  row.addEventListener("mousemove", (e) => {
    if (!isDragging) return; // Only drag if the mouse is down
    e.preventDefault(); // Prevent default behavior

    const x = e.pageX - row.offsetLeft;
    const walk = (x - startX) * 1.5;
    row.scrollLeft = scrollLeft - walk;
  });
});
