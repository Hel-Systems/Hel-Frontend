let myLatLng = { lat: 38.3460, lng: -0.4907 };
let mapOptions = {
  center: myLatLng,
  zoom: 7,
  mapTypeId: google.maps.MapTypeId.ROADMAP

};
let duration;
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
      document.querySelector('#distance').value = (Math.round((parseInt(result.routes[0].legs[0].distance.text)) * 1.6)) + ' km';
      duration = result.routes[0].legs[0].duration.text;
      document.querySelector('#price').value = (parseInt(result.routes[0].legs[0].distance.text) * 0.1 + 10) + ' €';

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

