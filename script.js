document.addEventListener("DOMContentLoaded", function () {

  const registerForm = document.getElementById("businessForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Business Registered Successfully!");
      registerForm.reset();
    });
  }

});