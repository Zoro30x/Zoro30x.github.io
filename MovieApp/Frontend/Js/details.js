const API_KEY = "00c39ab56da9cde1508182e6ec0fd2ee";
const BASE_URL = "https://api.themoviedb.org/3";
const posterBaseURL = "https://image.tmdb.org/t/p/w500";
const backdropBaseURL = "https://image.tmdb.org/t/p/original";

// Extract type and id from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");
const id = urlParams.get("id");

// DOM Elements
const titleElement = document.getElementById("title");
const genresElement = document.getElementById("genres");
const descriptionElement = document.getElementById("description");
const posterElement = document.getElementById("poster");
const castListElement = document.getElementById("cast-list");
const trailerElement = document.getElementById("trailer");

// Fetch Movie/TV Show Details
async function fetchDetails() {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    );
    const data = await response.json();

    // Update page elements
    titleElement.textContent = data.title || data.name;
    descriptionElement.textContent = data.overview;
    posterElement.src = `${posterBaseURL}${data.poster_path}`;

    // Fix the background image
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
  }
}

fetchDetails();

const header = document.querySelector("header");

// Add scroll event listener to the window
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    // Add the "scrolled" class when scrolled down
    header.classList.add("scrolled");
  } else {
    // Remove the "scrolled" class when back at the top
    header.classList.remove("scrolled");
  }
});

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

document.querySelectorAll(".similar .content-row").forEach((row) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  row.addEventListener("mousedown", (e) => {
    isDragging = true;
    row.classList.add("dragging");
    startX = e.pageX - row.offsetLeft;
    scrollLeft = row.scrollLeft;
    e.preventDefault();
  });

  row.addEventListener("mouseleave", () => {
    isDragging = false;
    row.classList.remove("dragging");
  });

  row.addEventListener("mouseup", () => {
    isDragging = false;
    row.classList.remove("dragging");
  });

  row.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - row.offsetLeft;
    const walk = (x - startX) * 1.5;
    row.scrollLeft = scrollLeft - walk;
  });
});

fetchDetails().then(() => {
  fetchSimilarContent();
});
