
function mappingValue(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function valToPositive(value){
  if(value<0){
    value=value*-1
  }
  return value;
}

function sendRandomBackground(){ // for testing purp
  let value = Math.floor(Math.random() * 3)+1
  console.log(value);
  sendMessage(backTopic, value.toString());
}

function betweenTrue(x, min, max) {
  return x >= min && x <= max;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(doStuff);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function watchLocation() {
  if (navigator.geolocation) {
    let id = navigator.geolocation.watchPosition(sendPosition);
    myId = id;
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function broadcastLoc(){  // sende device ID + lat & lng i et array
  navigator.geolocation.getCurrentPosition(sendPosition);
  
}
function sendPosition(position){
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  sendMessage(updateDeviceTopic,JSON.stringify({"id": myId,"lat":lat,"lng":lng}));
}

function doStuff(position){
  console.log(position.coords.latitude);
}


function calcPolygon(msg){
  console.log(msg, "gfgff");
}

function newLocation(){

  sendMessage(updateDeviceTopic,deviceID.toString());
}

function addDevice(deviceID){

  devices[deviceID] = {
    lat:"",
    lng:"",

  }
  console.log(devices);
}
let IDcount = 1;
 let devices = {};
 let myId = 0;

 function updateDevice(device){
   console.log(device);
   if(devices.hasOwnProperty(device.id)){
console.log(device.id,"loleeee")
   }else{
    console.log("nope")

   }
 }


 //Array/object på alle sammen, som holder alle devices positioner, og so  holder sig opdateret på hvert eneste device, og så beregnes arealet mellem dem på hvert device! 