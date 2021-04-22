

//--------------- functions for admins---------------

var mymap = L.map('mapid').setView([51.505, -0.09], 13);
var myId = Math.floor(Math.random() * 10000);
var polygonLayer = L.layerGroup().addTo(mymap); 
console.log(myId);

//adding "tile" (the graphic of a map)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

//________________:function to create polygon of active devices:________________

var obj1 = {id:1, lat:51.509, lng:-0.05};
var obj2 = {id:2, lat:51.509, lng:-0.06};
var obj3 = {id:3, lat:51.51, lng:-0.057};

var deviceArray = []
var polygon;

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

// create polygon, should be made of devices positions

function createPoly(){
  let polyPoints =[]

  polygonLayer.clearLayers();

  deviceArray.forEach(device => { 
    var latlng = L.latLng(device.lat, device.lng)
    polyPoints.push(latlng)
  });
  polygon = L.polygon(polyPoints, {color: 'blue'});
  polygon.addTo(polygonLayer);
}

function getArea(){

  console.log("calculating area...");

  var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
  var readableArea = L.GeometryUtil.readableArea(area, true);
  console.log(readableArea + " is the area"); // might be in "ha": 1 ha = 10,000 square metres.
}
//________________::____________________

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
    navigator.geolocation.getCurrentPosition(sendPosition);
    //sendPosition(navigator.geolocation);
    console.log("Getting Location");
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function watchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(sendPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function sendPosition(position){
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  sendMessage(deviceTopic,JSON.stringify({"id": myId,"lat":lat,"lng":lng}));
//  console.log("Sent message: "+ "id" + myId+"lat"+lat+"lng"+lng );
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
