'use strict';

let orders = [];
let firstnameInput = document.querySelector('#firstname-input');
let lastnameInput = document.querySelector('#lastname-input');
let emailInput = document.querySelector('#email-input');
let numberInput = document.querySelector('#number-input');
// let addressInput = document.querySelector('#address-input');

let currentPasswordInput = document.querySelector('#current-password-input');
let newPasswordInput = document.querySelector('#new-password-input');
let confirmPasswordInput = document.querySelector('#confirm-password-input');

// load data of profile if current user is logged in
if (window.localStorage.getItem("current-user")) {
  fetch(`http://localhost:8080/api/users/email/${window.localStorage.getItem("current-user")}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data !== undefined) {
        localStorage.setItem("user-id", data["id"]);
        firstnameInput.value = data["firstname"];
        lastnameInput.value = data["surname"];
        emailInput.value = data["email"];
        // numberInput.value = data[""];
      } else {
        window.location.href = "/login.html";
      }
    })
} else {
  window.location.href = "/login.html";
}

//load orders created by a user
if (window.localStorage.getItem("current-user")) {
  fetch(`http://localhost:8080/api/orders/user/${localStorage.getItem('user-id')}}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let newRowHtml;
      if (data !== undefined) {
        for (i = 0; i < data.length; i++) {
          newRowHtml += `<div class="order-table-row" id="${data[i].userId}"><div class="order-id">${data[i].id}</div><div class="order-description">${data[i].description}</div><div class="order-from">${data[i].adressFrom}</div><div class="order-to">${data[i].adressTo}</div><div class="order-status">${data[i].status}</div></div>`;
        }
        document.querySelector('.order-table').innerHTML = newRowHtml;
      } else if (data == null) {
        alert('You have not created any orders!');
      } else {
        console.log('Could not load orders of the user');
      }
    })
} else {
  window.location.href = "/login.html";
}



// update profile info request
// document.querySelector('#save-profile').addEventListener('click', () => {
//   if (firstnameInput.value !== '' && lastnameInput.value !== '' && emailInput.value !== '' && numberInput.value !== '') {
//     fetch('http://localhost:8080/api/users', {
//       method: 'POST',
//       body: JSON.stringify({
//         firstname: firstnameInput.value,
//         surname: lastnameInput.value,
//         email: emailInput.value,
//         password: numberInput.value,
//       }),
//       headers: {
//         "Content-type": "application/json; charset=UTF-8"
//       }
//     })
//       .then(response => {
//         if (response.status == 200) {
//           window.location.href = "/profile.html"
//         } else {
//           console.log('profile is not updated!');
//         }
//       })
//   } else {
//     alert('Not all fields are filled!');
//   }
// });

// change password request
// document.querySelector('#save-password').addEventListener('click', () => {
//   if (currentPasswordInput.value !== '' && newPasswordInput.value !== '') {
//     if (newPasswordInput.value === confirmPasswordInput.value) {
//       fetch(`http://localhost:8080/api/users/${localStorage.getItem('user-id')}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           currentpassword: currentPasswordInput.value,
//           newpassword: newPasswordInput
//         }),
//         headers: {
//           "Content-type": "application/json; charset=UTF-8"
//         }
//       })
//         .then(response => response.json())
//         .then(data => {
//           console.log(data);
//         })
//     } else {
//       alert('New password and its confirrmation are not the same!');
//       currentPasswordInput.value = '';
//       newPasswordInput.value = '';
//       confirmPasswordInput.value = '';
//     }
//   }
// });

// delete profile request
// document.querySelector('#delete-profile').addEventListener('click', () => {
//   if (currentPasswordInput.value !== '' && newPasswordInput.value !== '') {
//     fetch(`http://localhost:8080/api/users/${localStorage.getItem('user-id')}`, {
//       method: 'DELETE',
//       headers: {
//         "Content-type": "application/json; charset=UTF-8"
//       }
//     })
//       .then(response => {
//         if (response.status == 200) {
//           window.localStorage.removeItem('current-user');
//           window.localStorage.removeItem('user-id');
//           window.location.href = "/index.html";
//         } else {
//           alert('The password is not correct!');
//         }
//       })
//   }
// });

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