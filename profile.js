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


//load immediately orders created by a user
if (window.localStorage.getItem("current-user")) {
  fetch(`http://localhost:8080/api/orders/user/${localStorage.getItem('user-id')}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data, 'my deliveries');
      let newRowHtml = '<div class="order-table-head"><div class="order-id">ID</div><div class="order-description">Description</div><div class="order-from">From</div><div class="order-to">To</div><div class="order-distance">Distance</div><div class="order-price">Price</div><div class="order-status">Status</div><div class="order-change">Change status</div></div>';
      if (data !== undefined) {
        for (let i = 0; i < data.length; i++) {
          let changeButtonText;
          if (data[i].status == 'Avaliable') {
            changeButtonText = 'Cancel';
          } else if (data[i].status == 'Processing') {
            changeButtonText = "Can't be changed";
          } else if (data[i].status == 'Finished') {
            changeButtonText = 'Close';
          }
          newRowHtml += `<div class="order-table-row" id="${data[i].userId}"><div class="order-id">${data[i].id}</div>
          <div class="order-description">${data[i].description}</div><div class="order-from">${data[i].adressFrom}</div>
          <div class="order-to">${data[i].adressTo}</div><div class="order-distance">${data[i].distance} km</div>
          <div class="order-price">${data[i].price} €</div><div class="order-status">${data[i].status}</div>
          <div class="order-change"><button class="order-change-button">${changeButtonText}</button></div></div>`;
        }
        document.querySelector('.order-table').innerHTML = newRowHtml;
      } else if (data == null) {
        alert('You have not created any orders!');
      } else {
        console.log('Could not load orders of the user');
      }

      // change status buttons
      document.querySelectorAll('.order-change-button').forEach(btn => {
        btn.addEventListener('click', (event) => {
          if (event.currentTarget.textContent == 'Cancel') {
            fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
              method: 'DELETE',
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            })
              .then(response => {
                if (response.status == 200) {
                  window.location.href = "/profile.html";
                } else {
                  console.log('order not removed');
                }
              })
          }
          if (event.currentTarget.textContent == 'Close') {
            fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
              method: 'DELETE',
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            })
              .then(response => {
                if (response.status == 200) {
                  window.location.href = "/profile.html";
                } else {
                  console.log('order not closed');
                }
              })
          }
          if (event.currentTarget.textContent == 'Delivered') {
            fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
              method: 'PATCH',
              body: JSON.stringify({
                status: 'Completed'
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            })
              .then(response => {
                if (response.status == 200) {
                  window.location.href = "/profile.html";
                } else {
                  console.log('order not finished');
                }
              })
          }
        })
      });
    })
} else {
  window.location.href = "/login.html";
}

// load orders avaliable to take




//update profile info request
document.querySelector('#save-profile').addEventListener('click', () => {
  console.log(document.querySelector('#firstname-input').value);
  if (firstnameInput.value !== '' && lastnameInput.value !== '' && emailInput.value !== '') {
    fetch(`http://localhost:8080/api/users/${localStorage.getItem('user-id')}`, {
      method: 'PATCH',
      body: JSON.stringify({
        firstname: document.querySelector('#firstname-input').value,
        surname: document.querySelector('#lastname-input').value,
        email: document.querySelector('#email-input').value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (response.status == 200) {
          window.location.href = "/profile.html"
        } else {
          console.log('profile is not updated!');
        }
      })
  } else {
    alert('Not all fields are filled!');
  }
});

// change password request
document.querySelector('#save-password').addEventListener('click', () => {
  if (currentPasswordInput.value !== '' && newPasswordInput.value !== '') {
    if (newPasswordInput.value === confirmPasswordInput.value) {
      fetch(`http://localhost:8080/api/users/${localStorage.getItem('user-id')}/changePassword`, {
        method: 'PATCH',
        body: JSON.stringify({
          oldPassword: currentPasswordInput.value,
          password: newPasswordInput.value
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          window.location.href = "/profile.html";
        })
    } else {
      alert('New password and its confirrmation are not the same!');
      currentPasswordInput.value = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';
    }
  }
});

// delete profile request
document.querySelector('#delete-profile-button').addEventListener('click', () => {
  if (document.querySelector('#delete-profile-input').value !== '') {
    console.log('here');
    fetch(`http://localhost:8080/api/users/${localStorage.getItem('user-id')}`, {
      method: 'DELETE',
      body: JSON.stringify({
        password: document.querySelector('#delete-profile-input').value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        console.log('!');
        if (response.status == 200) {
          window.localStorage.removeItem('current-user');
          window.localStorage.removeItem('user-id');
          window.location.href = "/index.html";
        } else {
          alert('The password is not correct!');
        }
      })
  }
});

// showing main menu options and get current orders
document.querySelector('#my-orders').addEventListener('change', () => {
  if (document.querySelector('#my-orders').checked == true) {
    document.querySelector('.personal-data').style.display = 'none';
    document.querySelector('#profile-title').textContent = 'My orders';
    document.querySelector('.orders').style.display = 'flex';
    document.querySelector('.avaliable-orders').style.display = 'none';
    document.querySelector('.my-deliveries').style.display = 'none';
    if (window.localStorage.getItem("current-user")) {
      fetch(`http://localhost:8080/api/orders/user/${localStorage.getItem('user-id')}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data, 'my deliveries');
          let newRowHtml = '<div class="order-table-head"><div class="order-id">ID</div><div class="order-description">Description</div><div class="order-from">From</div><div class="order-to">To</div><div class="order-distance">Distance</div><div class="order-price">Price</div><div class="order-status">Status</div><div class="order-change">Change status</div></div>';
          if (data !== undefined) {
            for (let i = 0; i < data.length; i++) {
              let changeButtonText;
              if (data[i].status == 'Avaliable') {
                changeButtonText = 'Cancel';
              } else if (data[i].status == 'Processing') {
                changeButtonText = "Can't be changed";
              } else if (data[i].status == 'Finished') {
                changeButtonText = 'Close';
              }
              newRowHtml += `<div class="order-table-row" id="${data[i].userId}"><div class="order-id">${data[i].id}</div>
          <div class="order-description">${data[i].description}</div><div class="order-from">${data[i].adressFrom}</div>
          <div class="order-to">${data[i].adressTo}</div><div class="order-distance">${data[i].distance} km</div>
          <div class="order-price">${data[i].price} €</div><div class="order-status">${data[i].status}</div>
          <div class="order-change"><button class="order-change-button">${changeButtonText}</button></div></div>`;
            }
            document.querySelector('.order-table').innerHTML = newRowHtml;
          } else if (data == null) {
            alert('You have not created any orders!');
          } else {
            console.log('Could not load orders of the user');
          }

          // change status buttons
          document.querySelectorAll('.order-change-button').forEach(btn => {
            btn.addEventListener('click', (event) => {
              if (event.currentTarget.textContent == 'Cancel') {
                fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
                  method: 'DELETE',
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
                })
                  .then(response => {
                    if (response.status == 200) {
                      window.location.href = "/profile.html";
                    } else {
                      console.log('order not removed');
                    }
                  })
              }
              if (event.currentTarget.textContent == 'Close') {
                fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
                  method: 'DELETE',
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
                })
                  .then(response => {
                    if (response.status == 200) {
                      window.location.href = "/profile.html";
                    } else {
                      console.log('order not closed');
                    }
                  })
              }
              if (event.currentTarget.textContent == 'Delivered') {
                fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    status: 'Completed'
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
                })
                  .then(response => {
                    if (response.status == 200) {
                      window.location.href = "/profile.html";
                    } else {
                      console.log('order not finished');
                    }
                  })
              }
            })
          });
        })
    } else {
      window.location.href = "/login.html";
    }
  }
});
document.querySelector('#profile').addEventListener('change', () => {
  if (document.querySelector('#profile').checked == true) {
    document.querySelector('.orders').style.display = 'none';
    document.querySelector('.avaliable-orders').style.display = 'none';
    document.querySelector('.personal-data').style.display = 'flex';
    document.querySelector('#profile-title').textContent = 'Profile';
    document.querySelector('.my-deliveries').style.display = 'none';

    if (window.localStorage.getItem("current-user")) {
      fetch(`http://localhost:8080/api/users/email/${window.localStorage.getItem("current-user")}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data, 'my orders');
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
  }
});
document.querySelector('#deliveres').addEventListener('change', () => {
  if (document.querySelector('#deliveres').checked == true) {
    document.querySelector('.personal-data').style.display = 'none';
    document.querySelector('#profile-title').textContent = 'Avaliable orders';
    document.querySelector('.orders').style.display = 'none';
    document.querySelector('.avaliable-orders').style.display = 'flex';
    document.querySelector('.my-deliveries').style.display = 'none';

    if (window.localStorage.getItem("current-user")) {
      fetch(`http://localhost:8080/api/orders/status/Avaliable`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('avaliable', data);
          console.log(localStorage.getItem('user-id'));
          let newRowHtml = '<div class="order-table-head"><div class="order-id">ID</div><div class="order-description">Description</div><div class="order-from">From</div><div class="order-to">To</div><div class="order-distance">Distance</div><div class="order-price">Price</div><div class="order-status">Status</div><div class="order-change">Change status</div></div>';
          if (data !== undefined) {
            for (let i = 0; i < data.length; i++) {
              let changeButtonText;
              if (parseInt(localStorage.getItem('user-id')) !== data[i].userId) {
                if (data[i].status == 'Avaliable') {
                  changeButtonText = 'Take';
                  newRowHtml += `<div class="order-table-row" id="${data[i].userId}"><div class="order-id">${data[i].id}</div>
              <div class="order-description">${data[i].description}</div><div class="order-from">${data[i].adressFrom}</div>
              <div class="order-to">${data[i].adressTo}</div><div class="order-distance">${data[i].distance} km</div>
              <div class="order-price">${data[i].price} €</div><div class="order-status">${data[i].status}</div>
              <div class="order-change"><button class="order-change-button">${changeButtonText}</button></div></div>`;
                }
              }
            }
            document.querySelector('.order-table-avaliable').innerHTML = newRowHtml;
          } else if (data == null) {
            alert('No avaliable dileveres');
          } else {
            console.log('Could not load avaliable orders');
          }

          // change status buttons
          document.querySelectorAll('.order-change-button').forEach(btn => {
            btn.addEventListener('click', (event) => {
              if (event.currentTarget.textContent == 'Take') {
                fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    status: 'Processing',
                    deliverymanEmail: localStorage.getItem('current-user')
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
                })
                  .then(response => {
                    if (response.status == 200) {
                      window.location.href = "/profile.html";
                    } else {
                      console.log('order not assigned');
                    }
                  })
              }
            })
          });
        })
    } else {
      window.location.href = "/login.html";
    }
  }
});
document.querySelector('#my-deliveries').addEventListener('change', () => {
  if (document.querySelector('#my-deliveries').checked == true) {
    document.querySelector('.personal-data').style.display = 'none';
    document.querySelector('#profile-title').textContent = 'My deliveries';
    document.querySelector('.orders').style.display = 'none';
    document.querySelector('.avaliable-orders').style.display = 'none';
    document.querySelector('.my-deliveries').style.display = 'flex';

    if (window.localStorage.getItem("current-user")) {
      fetch(`http://localhost:8080/api/orders/status/Processing`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('processing', data);
          let newRowHtml = '<div class="order-table-head"><div class="order-id">ID</div><div class="order-description">Description</div><div class="order-from">From</div><div class="order-to">To</div><div class="order-distance">Distance</div><div class="order-price">Price</div><div class="order-status">Status</div><div class="order-change">Change status</div></div>';
          if (data !== undefined) {
            for (let i = 0; i < data.length; i++) {
              let changeButtonText;
              if (localStorage.getItem('current-user') == data[i].deliverymanEmail) {
                if (data[i].status == 'Processing') {
                  changeButtonText = 'Complete';
                  newRowHtml += `<div class="order-table-row" id="${data[i].userId}"><div class="order-id">${data[i].id}</div>
              <div class="order-description">${data[i].description}</div><div class="order-from">${data[i].adressFrom}</div>
              <div class="order-to">${data[i].adressTo}</div><div class="order-distance">${data[i].distance} km</div>
              <div class="order-price">${data[i].price} €</div><div class="order-status">${data[i].status}</div>
              <div class="order-change"><button class="order-change-button">${changeButtonText}</button></div></div>`;
                }
                if (data[i].status == 'Finished') {
                  changeButtonText = 'Close';
                  newRowHtml += `<div class="order-table-row" id="${data[i].userId}"><div class="order-id">${data[i].id}</div>
              <div class="order-description">${data[i].description}</div><div class="order-from">${data[i].adressFrom}</div>
              <div class="order-to">${data[i].adressTo}</div><div class="order-distance">${data[i].distance} km</div>
              <div class="order-price">${data[i].price} €</div><div class="order-status">${data[i].status}</div>
              <div class="order-change"><button class="order-change-button">${changeButtonText}</button></div></div>`;
                }
              }
            }
            document.querySelector('.delivery-table').innerHTML = newRowHtml;
          } else if (data == null) {
            alert('No processing dileveres');
          } else {
            console.log('Could not load processing orders');
          }

          // change status buttons
          document.querySelectorAll('.order-change-button').forEach(btn => {
            btn.addEventListener('click', (event) => {
              if (event.currentTarget.textContent == 'Complete') {
                fetch(`http://localhost:8080/api/orders/${event.currentTarget.parentNode.parentNode.querySelector('.order-id').textContent}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    status: 'Finished',
                    email: localStorage.getItem('current-user')
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
                })
                  .then(response => {
                    if (response.status == 200) {
                      window.location.href = "/profile.html";
                    } else {
                      console.log('order not finished');
                    }
                  })
              }
            })
          });
        })
    } else {
      window.location.href = "/login.html";
    }
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
