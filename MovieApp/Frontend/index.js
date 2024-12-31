const API_KEY = "00c39ab56da9cde1508182e6ec0fd2ee";
const BASE_URL = "https://api.themoviedb.org/3";

let currentIndex = 0; // Tracks the current movie in the slider
let movies = []; // Holds movie data

// Fetch Upcoming Movies
async function fetchMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    movies = data.results;

    // Once the movies are fetched, initialize the hero slide with the first movie
    updateHeroSlide(currentIndex);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Update Hero Slide with Movie Data
async function updateHeroSlide(index) {
  const movie = movies[index];

  document.querySelector(
    ".hero-section"
  ).style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  // Set Title and Description
  document.getElementById("hero-title").innerText = movie.title;
  document.getElementById("hero-description").innerText = movie.overview;

  // Set Poster Image (directly from movie data)

  document.getElementById(
    "hero-image"
  ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
}

// Navigate Between Movies
function navigateHero(direction) {
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % movies.length; // Wrap around to the start
  } else if (direction === "prev") {
    currentIndex = (currentIndex - 1 + movies.length) % movies.length; // Wrap around to the end
  }
  updateHeroSlide(currentIndex);
}

// Event Listeners for Navigation Buttons
document
  .getElementById("next-btn")
  .addEventListener("click", () => navigateHero("next"));

document
  .getElementById("prev-btn")
  .addEventListener("click", () => navigateHero("prev"));

// Initialize the Hero Slider
fetchMovies();

async function fetchPopularMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const popularMovies = data.results.slice(0, 15);
    updateContentRow("popular-movies", popularMovies);
  } catch (error) {
    console.error("Error fetching :", error);
  }
}

// Fetch top-rated movies
async function fetchTopRatedMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const topRatedMovies = data.results.slice(0, 15);
    updateContentRow("top-rated-movies", topRatedMovies);
  } catch (error) {
    console.error("Error fetching :", error);
  }
}

// Fetch popular TV shows
async function fetchPopularTV() {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const popularTV = data.results.slice(0, 15);
    updateContentRow("popular-tv", popularTV);
  } catch (error) {
    console.error("Error fetching :", error);
  }
}

// Fetch top-rated TV shows
async function fetchTopRatedTV() {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const topRatedTV = data.results.slice(0, 15);
    updateContentRow("top-rated-tv", topRatedTV);
  } catch (error) {
    console.error("Error fetching :", error);
  }
}

function updateContentRow(containerId, items) {
  const contentRow = document.querySelector(`#${containerId} .content-row`);
  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;

    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = item.title || item.name;

    card.appendChild(img);
    card.appendChild(title);
    contentRow.appendChild(card);
  });
}

function initializeSections() {
  fetchPopularMovies();
  fetchTopRatedMovies();
  fetchPopularTV();
  fetchTopRatedTV();
}

initializeSections();

document.querySelectorAll(".content-row").forEach((row) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Mouse down event to start dragging
  row.addEventListener("mousedown", (e) => {
    isDragging = true;
    row.classList.add("dragging");
    startX = e.pageX - row.offsetLeft; // Capture the initial X position
    scrollLeft = row.scrollLeft; // Record the scroll position
    e.preventDefault(); // Prevent default behavior (e.g., text selection)
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

    const x = e.pageX - row.offsetLeft; // Current X position
    const walk = (x - startX) * 1.5; // Adjust the multiplier for speed
    row.scrollLeft = scrollLeft - walk; // Update the scroll position
  });
});
