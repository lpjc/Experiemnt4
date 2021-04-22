

//--------------- functions for admins---------------

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  //adding "tile" (the graphic of a map)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

  // create polygon, should be made of devices positions
var polyPoints = [  //coords
  [51.509, -0.05],
  [51.509, -0.06],
  [51.51, -0.057]]

var polygon = L.polygon(polyPoints, {color: 'red'}); // create the polygon

polygon.addTo(mymap); // add to tileset

function getArea(){

  console.log("calculating area...");

  var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
  var readableArea = L.GeometryUtil.readableArea(area, true);
  console.log(readableArea + " is the area"); // might be in "ha": 1 ha = 10,000 square metres.
}

function sendBackground(){
  // send the value of background based on area of polygon
}

function sendRandomBackground(){ // for testing purp
  let value = Math.floor(Math.random() * 3)+1
  console.log(value);
  sendMessage(backTopic, value.toString());
}

//--------------- functions for device -----------------

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(doStuff);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function watchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(doStuff);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function broadcastLoc(lat, lng){  // sende device ID + lat & lng i et array

  let IDLatLng=[deviceID, lat, lng]
  let msg = JSON.stringify(IDLatLng);
  sendMessage(locTopic, msg)
}

function doStuff(position){
  console.log(position.coords.latitude);
}

//------------ Functions for all---------------

function mappingValue(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function valToPositive(value){
  if(value<0){
    value=value*-1
  }
  return value;
}
function betweenTrue(x, min, max) {
  return x >= min && x <= max;
}
