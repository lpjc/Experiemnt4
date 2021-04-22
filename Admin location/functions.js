
//________________  ::  EXPERIEMNT 4, ITU ::  ________________

// This edit: 2. iteration: 22/april/2021. 
// by group7™: Alberte, Emil, Lars, Line & Nikolai

//________________  ::  INITIALIZE ::  ________________

var mymap = L.map('mapid').setView([55.69611359991787, 12.560069974945], 13); // maybe change setView to dynamic? (should happen further down in code)
var myId = Math.floor(Math.random() * 10000);
var polygonLayer = L.layerGroup().addTo(mymap); 
var deviceArray = []
var polygon;
var area;

  //adding "tile" (the graphic of a map)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

console.log("Initialize complete, myId: " + myId);

//________________  ::  RECIEVING INFORMATION  ::  ________________
// Upon getting a message on the "deviceTopic"-topic:
  // Utilizing the deviceArray, check if newDevice's ID is already existing in the array of known device ID's.
  // if it already exists:  replace the old lat & lng with new lat & lgn
  // if it doesn't already exists:  add the dew device, with Id & lat & lng.

function onRecievedDevice(newDevice){
  var isNew = true;
  deviceArray.forEach(oldDevices => {
    if (oldDevices.id == newDevice.id){
      isNew = false;
      oldDevices.lat = newDevice.lat
      oldDevices.lng = newDevice.lng
    }
  });
  if (isNew){
    deviceArray.push(newDevice)
  }
  createPoly();
}

//________________  ::  CREATING POLYGON & CALCULATING AREA  ::  ________________
  // Create a polygon with all the devices in the deviceArray.
  // Empty the polyPoints array and .clearLayers to replace old polygonw ith new, each time there is new to be drawn.
function createPoly(){
  let polyPoints =[]

  polygonLayer.clearLayers();

  deviceArray.forEach(device => { 
    var latlng = L.latLng(device.lat, device.lng)
    polyPoints.push(latlng)
  });
  polygon = L.polygon(polyPoints, {color: 'green'});
  polygon.addTo(polygonLayer);
}

  // calculating area utilizing a Leaflet and Geometry lib combined. 
  // note that realArea and readableArea are not the same. readableArea is in measurement we understand, realArea is not.
function getArea(){

  console.log("calculating area...");

  var realArea = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]); 
  readableArea = L.GeometryUtil.readableArea(realArea, true);
  console.log(readableArea + " is the area"); // might be in "ha" if surface is large. 1 ha = 10.000 square metres.
}

//________________::  SEND BACKGROUND (IGNORE IN THIS EDIT) ::____________________
  // Leftovers from 1. iteration, ready to be integrated as result of 3. iteration.

function sendBackground(){
  // WORK IN PROGRESS send the value of background based on area of polygon
}

function sendRandomBackground(){ // for testing purp
  let value = Math.floor(Math.random() * 3)+1
  console.log(value);
  sendMessage(backTopic, value.toString());
}

//________________  ::  SENDING INFORMATION  ::  ________________
// getLocation is on-demand sending message, watchLocation is sending message whenever location changes

  //tied to a button for sending on-demand
function getLocation() { 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendPosition);
    console.log("Getting Location");
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

  // tied to loding the page, to run full time. Activated when device moves to new position
function watchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(sendPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

  // sends location + myId to deviceTopic.
function sendPosition(position){
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  sendMessage(deviceTopic,JSON.stringify({"id": myId,"lat":lat,"lng":lng}));
}

//________________  ::  UTILITY FUNCTIONS  ::  ________________

  // maps one value from range1 to range2, returns a new mapped value
function mappingValue(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

  // turns any value potitive
function valToPositive(value){
  if(value<0){
    value=value*-1
  }
  return value;
}
  // returns true/false if/ifnot between.
function betweenTrue(x, min, max) {
  return x >= min && x <= max;
}
