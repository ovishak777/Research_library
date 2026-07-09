document.addEventListener("DOMContentLoaded", () => {
  if (Auth.isLoggedIn()) {
    window.location.href = "library.html";
    return;
  }

  const LoginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("pwo");
  const errorMessage = document.getElementById("error-message");

  LoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = passwordInput.value;

    if (Auth.login(password)) {
      window.location.href = "library.html";
    } else {
      errorMessage.textContent = "Invalid password.";
    }
  });
});
