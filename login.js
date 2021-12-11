'use strict';

const form = document.querySelector('.logging');

// login form  - post request - redirect to profile page if response = 200
form.addEventListener('submit', (event) => {
  event.preventDefault();
  fetch('http://localhost:8080/api/login', {
    method: 'POST',
    body: JSON.stringify({
      email: form.elements[0].value,
      password: form.elements[1].value
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => {
      if (response.status == 200) {
        // save in local storage current user that logged in
        localStorage.setItem("current-user", form.elements[0].value);
        window.location.href = "/profile.html";
      } else {
        document.querySelector('.form-status').textContent = 'User not found';
      }
    })
});
