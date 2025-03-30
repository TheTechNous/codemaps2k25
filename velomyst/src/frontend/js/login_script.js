// Select the signin and signup buttons
const signinBtn = document.querySelector(".signin-btn");
const signupBtn = document.querySelector(".signup-btn");

// Select the signin and signup forms
const signinForm = document.querySelector("#signin-overlay .form-container");
const signupForm = document.querySelector("#signup-overlay .form-container");

// Add event listeners to the signin and signup buttons
signinBtn.addEventListener("click", () => {
  document.getElementById("signin-overlay").classList.add("active");
});

signupBtn.addEventListener("click", () => {
  document.getElementById("signup-overlay").classList.add("active");
});

// Add event listeners to the signin and signup forms
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = signinForm.querySelector('input[type="text"]').value;
  const password = signinForm.querySelector('input[type="password"]').value;

  // Send a POST request to the signin API endpoint
  fetch("https://quack-mama.onrender.com/docs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const confirmPassword = signupForm.querySelector(
    'input[type="password"]:last-child'
  ).value;

  // Send a POST request to the signup API endpoint
  fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, confirmPassword }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});

// Add event listeners to the close buttons
document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("signin-overlay").classList.remove("active");
    document.getElementById("signup-overlay").classList.remove("active");
  });
});
