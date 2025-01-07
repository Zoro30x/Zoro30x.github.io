document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Determine the correct path for fetching the modal
    const isIndexPage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/";
    const modalPath = isIndexPage
      ? "./Pages/loginsignup.html"
      : "../Pages/loginsignup.html";

    // Dynamically load the login/signup modal HTML
    const modalResponse = await fetch(modalPath);

    if (!modalResponse.ok) {
      throw new Error(`Failed to load modal: ${modalResponse.statusText}`);
    }

    const modalHtml = await modalResponse.text();
    document.body.insertAdjacentHTML("beforeend", modalHtml); // Add modal to the body
    console.log("Login/signup modal loaded successfully!");

    // DOM elements
    const userIcon = document.querySelector(".user-icon");
    const modalWrapper = document.querySelector(".modal-wrapper");
    const closeBtn = document.getElementById("close-btn");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginToggleBtn = document.getElementById("login-toggle-btn");
    const signupToggleBtn = document.getElementById("signup-toggle-btn");
    const logoutBtn = document.getElementById("logout-btn"); // Logout button

    if (!userIcon || !modalWrapper) {
      throw new Error(
        "Modal elements not found. Ensure login-signup-modal.html contains the correct structure."
      );
    }

    // Check if JWT token exists in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // If the user is logged in, hide the user icon and show the logout button
      logoutBtn.style.display = "block";
      userIcon.style.display = "none";
    } else {
      // If not logged in, show the user icon and hide the logout button
      logoutBtn.style.display = "none";
      userIcon.style.display = "block";
    }

    // Show the modal and default to the login form
    userIcon.addEventListener("click", function () {
      modalWrapper.classList.add("active");
      loginForm.style.display = "block"; // Show login form
      signupForm.style.display = "none"; // Hide signup form
    });

    // Close the modal
    closeBtn.addEventListener("click", function () {
      modalWrapper.classList.remove("active");
    });

    // Close modal on clicking outside the modal
    window.addEventListener("click", function (event) {
      if (event.target === modalWrapper) {
        modalWrapper.classList.remove("active");
      }
    });

    // Toggle to login form
    loginToggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.style.display = "block"; // Show login form
      signupForm.style.display = "none"; // Hide signup form
    });

    // Toggle to signup form
    signupToggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      signupForm.style.display = "block"; // Show signup form
      loginForm.style.display = "none"; // Hide login form
    });

    // Handle Login Form Submission
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const response = await fetch("http://localhost:4000/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token); // Store JWT in localStorage
          alert("Login successful!");
          modalWrapper.classList.remove("active"); // Close modal
          logoutBtn.style.display = "block"; // Show logout button
          userIcon.style.display = "none"; // Hide user icon
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      }
    });

    // Handle Signup Form Submission
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      try {
        const response = await fetch("http://localhost:4000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Signup successful:", data);
          alert("Account created successfully!");
          modalWrapper.classList.remove("active"); // Close modal
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again.");
      }
    });

    // Handle Logout Functionality
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("token"); // Clear JWT token
      alert("You have been logged out!");
      logoutBtn.style.display = "none"; // Hide logout button
      userIcon.style.display = "block"; // Show user icon
      modalWrapper.classList.add("active"); // Reopen login modal
      loginForm.style.display = "block"; // Show login form
      signupForm.style.display = "none"; // Hide signup form
    });
  } catch (error) {
    console.error("Error loading login/signup modal:", error);
  }
});
