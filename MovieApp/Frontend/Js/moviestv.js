const API_KEY = "00c39ab56da9cde1508182e6ec0fd2ee";
const BASE_URL = "https://api.themoviedb.org/3";

let currentPage = 1;
let movies = [];

// Check if the page is for movies or TV series
const isMoviesPage = window.location.pathname.includes("movies");
const isTvSeriesPage = window.location.pathname.includes("tvseries");

// Set the correct API endpoint
const endpoint = isMoviesPage ? "/movie/popular" : "/tv/popular";

// Fetch Movies or TV Series
async function fetchContent(page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    const newContent = data.results;

    // Update the movies or TV series array
    movies = [...movies, ...newContent];

    // Once the content is fetched, display it
    displayContent(newContent);
  } catch (error) {
    console.error("Error fetching content:", error);
  }
}

// Function to display Movies or TV Series
function displayContent(newContent) {
  const contentGrid = document.querySelector(".content-row");

  newContent.forEach((content) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${content.poster_path}`;
    img.alt = content.title || content.name;

    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = content.title || content.name;

    card.appendChild(img);
    card.appendChild(title);
    contentGrid.appendChild(card);

    // Add click event to navigate to details page
    card.addEventListener("click", () => {
      const id = content.id;
      const type = isMoviesPage ? "movie" : "tv";
      window.location.href = `../Pages/details.html?type=${type}&id=${id}`;
    });
  });
}

// Event Listener for "Load More" button
document.getElementById("load-more").addEventListener("click", () => {
  currentPage++;
  fetchContent(currentPage);
});

// Initial fetch when the page loads
fetchContent(currentPage);

// Function to search movies or TV series based on the search input
async function searchMovies(query) {
  if (!query) return;

  const endpoint = isMoviesPage ? "/search/movie" : "/search/tv";
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&query=${query}&language=en-US`
    );
    const data = await response.json();
    const searchResults = data.results;

    const contentGrid = document.querySelector(".content-row");
    contentGrid.innerHTML = "";

    displayContent(searchResults);
  } catch (error) {
    console.error("Error searching content:", error);
  }
}
// Add event listener to search button
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  searchMovies(query);
});

// Initial fetch when the page loads

const header = document.querySelector("header");
const headerBackground = document.querySelector(".header-background");

// Add scroll event listener to the window
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    // Add the "scrolled" class when scrolled down
    header.classList.add("scrolled");

    // Hide the header background image
    if (headerBackground) {
      headerBackground.style.opacity = "0"; // Fade out the background
      headerBackground.style.transition = "opacity 0.3s ease"; // Smooth transition
    }
  } else {
    // Remove the "scrolled" class when back at the top
    header.classList.remove("scrolled");

    // Show the header background image
    if (headerBackground) {
      headerBackground.style.opacity = "1"; // Fade in the background
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    const absoluteLinkPath = new URL(linkPath, window.location.origin).pathname;

    const basePath = "/MovieApp/Frontend";
    const currentPathWithoutBase = currentPath.replace(basePath, "");

    // Match paths without base path
    if (currentPathWithoutBase === absoluteLinkPath) {
      console.log("Active link found:", linkPath);
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
