document.addEventListener("DOMContentLoaded", () => {
  const moviesButton = document.getElementById("mv-btn");
  const tvButton = document.getElementById("tv-btn");

  // Scroll effect for header
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

  let currentSection = "movies"; // Default section: Movies

  // Function to set active button styling
  function setActiveButton(activeButton, inactiveButton) {
    activeButton.style.backgroundColor = "red"; // Active button red
    activeButton.style.color = "white"; // Active button text white
    inactiveButton.style.backgroundColor = "transparent"; // Inactive button transparent
    inactiveButton.style.color = "white"; // Inactive button text black
  }

  // Function to toggle visibility of movies or TV series section
  function toggleSectionVisibility(section) {
    const moviesSection = document.getElementById("movies-section");
    const tvSeriesSection = document.getElementById("tv-series-section");

    if (section === "movies") {
      moviesSection.classList.remove("hidden");
      tvSeriesSection.classList.add("hidden");
    } else {
      moviesSection.classList.add("hidden");
      tvSeriesSection.classList.remove("hidden");
    }
  }

  // Function to fetch data for the given section and category
  async function fetchData(section, category) {
    const typeMap = {
      moviesFavourites: "moviesFavourites",
      moviesWatchlater: "moviesWatchlater",
      tvFavourites: "tvFavourites",
      tvWatchlater: "tvWatchlater",
    };

    // Log category to debug potential mismatches
    console.log("Fetching data for category:", category);

    const type = typeMap[category];
    if (!type) {
      console.error(`Invalid category '${category}' passed to fetchData.`);
      return;
    }

    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
    if (!userId) {
      alert("Please log in to view your watchlist.");
      return;
    }

    try {
      const response = await fetch(
        `https://zekos-movie-website.onrender.com/api/user/watchlist?type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch watchlist data.");
      }

      const data = await response.json();
      populateCategory(category, data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the watchlist.");
    }
  }

  // Function to populate the content for the given category
  function populateCategory(category, items) {
    const container = document.getElementById(
      category.replace(/([A-Z])/g, "-$1").toLowerCase()
    );
    if (!container) {
      console.error(`Container with ID '${category}' not found.`);
      return;
    }

    container.innerHTML = ""; // Clear previous content

    if (items.length === 0) {
      container.innerHTML = "<p>No items available in this category.</p>";
      return;
    }

    items.forEach((item) => {
      const card = createCard(item, category);
      container.appendChild(card);
    });
  }

  // Function to create a card for each item
  // Function to create a card for each item
  function createCard(item, category) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = item.id; // Adding unique ID for each item to remove it later

    const poster = document.createElement("img");
    poster.src = item.posterPath || "default-poster.png"; // Default poster if none
    poster.alt = item.title || item.name;

    const controls = document.createElement("div");
    controls.classList.add("controls");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML = `Edit <i class="fa-solid fa-pen"></i>`;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    // Add event listener for Edit button
    editButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent card click event
      handleEdit(item, category);
    });

    // Add event listener for Delete button
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent card click event
      handleDelete(item, category);
    });

    controls.appendChild(editButton);
    controls.appendChild(deleteButton);

    card.addEventListener("click", () => {
      const type = category.includes("tv") ? "tv" : "movie";
      window.location.href = `details.html?type=${type}&id=${item.id}`;
    });

    card.appendChild(poster);
    card.appendChild(controls);

    return card;
  }

  // Function to handle editing the category of an item
  const categoryMapping = {
    favourites: "moviesFavourites",
    watchlater: "moviesWatchlater",

    tvFavourites: "tvFavourites",
    tvWatchlater: "tvWatchlater",
  };

  function handleEdit(item, category) {
    // Open the modal and let the user select a new category
    const modal = document.querySelector(".edit-modal");
    const categorySelect = document.getElementById("category-select");

    // Show the modal
    modal.classList.remove("hidden");

    // Preselect the current category
    categorySelect.value = category;

    // Add event listener for saving changes
    const saveButton = document.getElementById("save-category");
    saveButton.onclick = async () => {
      const newCategory = categorySelect.value;

      // Ensure the fromCategory and toCategory are correctly mapped
      const fromCategory = categoryMapping[category] || category;
      const toCategory = categoryMapping[newCategory] || newCategory;

      // Log for debugging
      console.log("Mapped From Category:", fromCategory);
      console.log("Mapped To Category:", toCategory);

      const requestBody = {
        movie: item, // Send the movie object
        fromList: fromCategory, // Correctly mapped from category
        toList: toCategory, // Correctly mapped to category
      };

      console.log("Request Body:", requestBody);

      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `https://zekos-movie-website.onrender.com/api/user/watchlist/move`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "user-id": userId,
            },
            body: JSON.stringify(requestBody),
          }
        );

        const responseData = await response.json();
        console.log("Response:", responseData);

        if (!response.ok) {
          throw new Error("Failed to update category");
        }

        // Close the modal and refresh data
        modal.classList.add("hidden");
        fetchData(currentSection, newCategory); // Refresh the data
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the category.");
      }
    };

    // Add event listener for cancel
    const cancelButton = document.getElementById("cancel-edit");
    cancelButton.onclick = () => {
      modal.classList.add("hidden");
    };
  }

  // Function to handle deleting an item
  async function handleDelete(item, category) {
    const confirmed = confirm(
      `Are you sure you want to delete "${item.title || item.name}"?`
    );

    if (confirmed) {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `https://zekos-movie-website.onrender.com/api/user/watchlist/${category}/${item.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "user-id": userId,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete item");
        }

        const containerId = category.replace(/([A-Z])/g, "-$1").toLowerCase();
        const container = document.getElementById(containerId);

        if (!container) {
          console.error(`Container for category '${category}' not found.`);
          return;
        }

        // Remove the item from the DOM
        const itemElement = document.getElementById(item.id);
        if (itemElement) {
          container.removeChild(itemElement);
        } else {
          console.error(`Item element with ID '${item.id}' not found in DOM.`);
        }

        // Optionally refresh the category data
        await fetchData(currentSection, category);

        console.log(`Successfully deleted item: ${item.title || item.name}`);
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the item.");
      }
    }
  }

  // Event listener for Movies button
  moviesButton.addEventListener("click", () => {
    if (currentSection !== "movies") {
      currentSection = "movies";
      toggleSectionVisibility("movies");
      setActiveButton(moviesButton, tvButton);

      // Fetch data for movies categories
      fetchData("movies", "moviesFavourites");
      fetchData("movies", "moviesWatchlater");
    }
  });

  // Event listener for TV Series button
  tvButton.addEventListener("click", () => {
    if (currentSection !== "tv") {
      currentSection = "tv";
      toggleSectionVisibility("tv");
      setActiveButton(tvButton, moviesButton);

      // Fetch data for TV series categories
      fetchData("tv", "tvFavourites");
      fetchData("tv", "tvWatchlater");
    }
  });

  // Initialize default section and button state
  toggleSectionVisibility("movies");
  setActiveButton(moviesButton, tvButton);

  // Fetch data for initial movies categories
  fetchData("movies", "moviesFavourites");
  fetchData("movies", "moviesWatchlater");
});
