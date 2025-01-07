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

// Select the buttons
const moviesButton = document.getElementById("mv-btn");
const tvButton = document.getElementById("tv-btn");

// Define the main color and transparent background
const mainColor = "#ff0000";
const transparent = "transparent";

// Set the default styles (Movies button active by default)
moviesButton.style.backgroundColor = mainColor;
moviesButton.style.color = "white";
tvButton.style.backgroundColor = transparent;
tvButton.style.color = "white";

// Add event listeners for toggling
moviesButton.addEventListener("click", () => {
  // Movies button becomes active
  moviesButton.style.backgroundColor = mainColor;
  moviesButton.style.color = "white";

  // TV button becomes inactive
  tvButton.style.backgroundColor = transparent;
  tvButton.style.color = "white";

  // Logic for displaying Movies content can go here
  console.log("Movies button clicked");
});

tvButton.addEventListener("click", () => {
  // TV button becomes active
  tvButton.style.backgroundColor = mainColor;
  tvButton.style.color = "white";

  // Movies button becomes inactive
  moviesButton.style.backgroundColor = transparent;
  moviesButton.style.color = "white";

  // Logic for displaying TV Series content can go here
  console.log("TV Series button clicked");
});

const modal = document.querySelector(".edit-modal");
const categorySelect = document.querySelector("#category-select");
const saveCategoryBtn = document.querySelector("#save-category");
const cancelEditBtn = document.querySelector("#cancel-edit");
let currentCard = null; // Track the card being edited

// Function to add event listeners to a card
function addEventListenersToCard(card) {
  card.querySelector(".edit-btn").addEventListener("click", () => {
    currentCard = card; // Set the current card being edited
    modal.classList.remove("hidden"); // Show the modal
  });

  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove(); // Remove the card
  });
}

// Add event listeners to all existing cards
document.querySelectorAll(".card").forEach(addEventListenersToCard);

// Event Listener for Save Button (to move cards between categories)
saveCategoryBtn.addEventListener("click", () => {
  if (!currentCard) return;

  const selectedCategory = categorySelect.value;
  const targetList = document.querySelector(
    `.${selectedCategory} .list-container`
  );

  if (targetList) {
    targetList.appendChild(currentCard); // Move card to new category
  }

  modal.classList.add("hidden"); // Hide the modal
  currentCard = null; // Reset
});

// Event Listener for Cancel Button (to hide the modal)
cancelEditBtn.addEventListener("click", () => {
  modal.classList.add("hidden"); // Hide the modal
  currentCard = null; // Reset
});
