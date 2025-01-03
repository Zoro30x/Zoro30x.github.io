document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const userIcon = document.querySelector(".user-icon");
  const modalWrapper = document.querySelector(".modal-wrapper");
  const closeBtn = document.getElementById("close-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginToggleBtn = document.getElementById("login-toggle-btn");
  const signupToggleBtn = document.getElementById("signup-toggle-btn");

  // Open the modal with login form by default
  userIcon.addEventListener("click", function () {
    modalWrapper.classList.add("active");
    loginForm.style.display = "block"; // Show login form
    signupForm.style.display = "none"; // Hide signup form
  });

  // Close the modal when clicking the close button
  closeBtn.addEventListener("click", function () {
    modalWrapper.classList.remove("active");
  });

  // Close the modal if user clicks outside the modal
  window.addEventListener("click", function (event) {
    if (event.target === modalWrapper) {
      modalWrapper.classList.remove("active");
    }
  });

  // Toggle to login form
  loginToggleBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent page reload
    loginForm.style.display = "block"; // Show login form
    signupForm.style.display = "none"; // Hide signup form
  });

  // Toggle to signup form
  signupToggleBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent page reload
    signupForm.style.display = "block"; // Show signup form
    loginForm.style.display = "none"; // Hide login form
  });
});
