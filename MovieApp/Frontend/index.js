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
