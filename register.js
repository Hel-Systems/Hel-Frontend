'use strict';

const form = document.querySelector('.registration');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (form.elements['password'].value == form.elements['confirm'].value) {
    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      body: JSON.stringify({
        firstname: form.elements['firstname'].value,
        surname: form.elements['surname'].value,
        email: form.elements['email'].value,
        password: form.elements['password'].value,
        role: form.elements['radio'].value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (response.status == 200) {
          window.location.href = "/login.html"
        }
      })
  }
});