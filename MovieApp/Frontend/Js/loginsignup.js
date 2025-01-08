document.addEventListener("DOMContentLoaded", async function () {
  try {
    const isIndexPage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/";
    const modalPath = isIndexPage
      ? "./Pages/loginsignup.html"
      : "../Pages/loginsignup.html";

    const modalResponse = await fetch(modalPath);

    if (!modalResponse.ok) {
      throw new Error(`Failed to load modal: ${modalResponse.statusText}`);
    }

    const modalHtml = await modalResponse.text();
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const userIcon = document.querySelector(".user-icon");
    const modalWrapper = document.querySelector(".modal-wrapper");
    const closeBtn = document.getElementById("close-btn");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginToggleBtn = document.getElementById("login-toggle-btn");
    const signupToggleBtn = document.getElementById("signup-toggle-btn");
    const logoutBtn = document.getElementById("logout-btn");

    const userId = localStorage.getItem("userId");

    if (userId) {
      logoutBtn.style.display = "block";
      userIcon.style.display = "none";
    } else {
      logoutBtn.style.display = "none";
      userIcon.style.display = "block";
    }

    userIcon.addEventListener("click", function () {
      modalWrapper.classList.add("active");
      loginForm.style.display = "block";
      signupForm.style.display = "none";
    });

    closeBtn.addEventListener("click", function () {
      modalWrapper.classList.remove("active");
    });

    window.addEventListener("click", function (event) {
      if (event.target === modalWrapper) {
        modalWrapper.classList.remove("active");
      }
    });

    loginToggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.style.display = "block";
      signupForm.style.display = "none";
    });

    signupToggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      signupForm.style.display = "block";
      loginForm.style.display = "none";
    });

    // Handle Login Form Submission
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const response = await fetch("http://localhost:4000/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("userId", data.userId); // Store userId instead of token
          alert("Login successful!");
          modalWrapper.classList.remove("active");
          logoutBtn.style.display = "block";
          userIcon.style.display = "none";
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
        const response = await fetch(
          "http://localhost:4000/api/user/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Account created successfully!");
          modalWrapper.classList.remove("active");
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
      localStorage.removeItem("userId"); // Remove userId on logout
      alert("You have been logged out!");
      logoutBtn.style.display = "none";
      userIcon.style.display = "block";
      modalWrapper.classList.add("active");
      loginForm.style.display = "block";
      signupForm.style.display = "none";
    });
  } catch (error) {
    console.error("Error loading login/signup modal:", error);
  }
});
