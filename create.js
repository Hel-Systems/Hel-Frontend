// cheking for existing of current user

if (!localStorage.getItem('current-user')) {
  window.location.href = "/login.html";
}

let myLatLng = { lat: 38.3460, lng: -0.4907 };
let mapOptions = {
  center: myLatLng,
  zoom: 7,
  mapTypeId: google.maps.MapTypeId.ROADMAP

};
let duration;
let distance;
let price;
//create map
let map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
let directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
let directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

document.querySelector('#calculate').addEventListener('click', (event) => {
  event.preventDefault();
  calcRoute();
})

//define calcRoute function
function calcRoute() {

  //create request
  let request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      distance = Math.round((parseInt(result.routes[0].legs[0].distance.text) * 1.6));
      document.querySelector('#distance').value = distance + ' km';

      duration = result.routes[0].legs[0].duration.text;
      price = Math.round(parseInt(result.routes[0].legs[0].distance.text) * 0.1 + 10);
      document.querySelector('#price').value = price + ' €';
      duration = result.routes[0].legs[0].duration.text;

      //display route
      directionsDisplay.setDirections(result);
    } else {
      //delete route from map
      directionsDisplay.setDirections({ routes: [] });
      //center map in London
      map.setCenter(myLatLng);

      //show error message
    }
  });
}

// eventListener on button create order

let fromInput = document.querySelector('#from');
let toInput = document.querySelector('#to');
let descriptionInput = document.querySelector('#description');



document.querySelector('#create').addEventListener('click', () => {
  fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      description: descriptionInput.value,
      adressFrom: fromInput.value,
      adressTo: toInput.value,
      deliverymanEmail: 'Not assigned',
      distance: distance,
      price: price,
      duration: duration,
      status: 'Avaliable',
      userId: localStorage.getItem('user-id')
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => {
      if (response.status == 200) {
        window.location.href = "/profile.html";
      }
    })
})

