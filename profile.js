'use strict';

let orders = [];
let nameInput = document.querySelector('#name-input');
let emailInput = document.querySelector('#email-input');
let numberInput = document.querySelector('#number-input');
let addressInput = document.querySelector('#address-input');



if (window.localStorage.getItem("current-user") !== '') {
  fetch(`http://localhost:8080/api/users/email/${window.localStorage.getItem("current-user")}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => {
      if (response.status == 200) {
        response.json();
      }
      else {
        console.log('response status is not 200');
      }
    })
    .then(data => {
      nameInput.value = data.firstname;
      emailInput.value = data.email;
    });
}

// showing main menu options 
document.querySelector('#my-orders').addEventListener('change', () => {
  if (document.querySelector('#my-orders').checked == true) {
    document.querySelector('.personal-data').style.display = 'none';
    document.querySelector('#profile-title').textContent = 'My orders';
    document.querySelector('.orders').style.display = 'flex';

  }
});
document.querySelector('#profile').addEventListener('change', () => {
  if (document.querySelector('#profile').checked == true) {
    document.querySelector('.orders').style.display = 'none';
    document.querySelector('.personal-data').style.display = 'flex';
    document.querySelector('#profile-title').textContent = 'Profile';
  }
});


// showing different sub-menu options
document.querySelector('#edit-profile').addEventListener('change', () => {
  if (document.querySelector('#edit-profile').checked == true) {
    document.querySelector('.edit-inputs').classList.remove('hide');
    document.querySelector('.side-bar').classList.remove('hide');
    document.querySelector('.edit-password').classList.add('hide');
    document.querySelector('.delete-profile').classList.add('hide');
  }
});

document.querySelector('#password').addEventListener('change', () => {
  if (document.querySelector('#password').checked == true) {
    document.querySelector('.edit-inputs').classList.add('hide');
    document.querySelector('.side-bar').classList.add('hide');
    document.querySelector('.edit-password').classList.remove('hide');
    document.querySelector('.delete-profile').classList.add('hide');
  }
});

document.querySelector('#delete-profile').addEventListener('change', () => {
  if (document.querySelector('#delete-profile').checked == true) {
    document.querySelector('.edit-inputs').classList.add('hide');
    document.querySelector('.side-bar').classList.add('hide');
    document.querySelector('.edit-password').classList.add('hide');
    document.querySelector('.delete-profile').classList.remove('hide');
  }
});
// logout button
document.querySelector('.logout-btn').addEventListener('click', () => {
  window.localStorage.removeItem('current-user');
  window.location.href = "/index.html";
})