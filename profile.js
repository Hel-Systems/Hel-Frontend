'use strict';

// showing different sub-menu options
document.querySelector('#edit-profile').addEventListener('change', () => {
  if (document.querySelector('#edit-profile').checked == true) {
    document.querySelector('.edit-inputs').classList.remove('hide');
    document.querySelector('.side-bar').classList.remove('hide');
    document.querySelector('.edit-password').classList.add('hide');
    document.querySelector('.delete-profile').classList.add('hide');
    console.log('change');
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