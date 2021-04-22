// --- SETTING UP --------------------------------------
const myBroker = "wss://edp21:Ko5z2bU0Uf7ajNzv@edp21.cloud.shiftr.io"; 
const myID = "itu" + parseInt(Math.random() * 1000000, 10); //Construct a random unique ID
const client = mqtt.connect(myBroker, {clientId: myID});
const deviceID = Math.random()*1000

// --- CONNECTING--------------------------------------
client.on('connect', function() {
  console.log('connected!');
  client.subscribe(locTopic);
  client.subscribe(backTopic);
  client.subscribe(polygonTopic);
  client.subscribe(updateDeviceTopic);
});

// --- VARIABLES --------------------


// --- SEND MESSAGE --------------------------------------
function sendMessage(topic, msg)
{
  client.publish(topic, msg);
}


// --- RECEIVING MESSAGE --------------------------------------
client.on('message', function(topic, message) 
{
  if (topic == locTopic){
    let unpMsg= JSON.parse(msg.toString());
    calcPolygonTopic(msg);
  } 
  if(topic == backTopic){
    let msg = message.toString();
    let hue = mappingValue(msg, 1, 3, 0, 95);
    onePixelDo(true, hue, 100, 80)
  }
  if (topic == polygonTopic){
    let msg = message.toString();
    calcPolygon(msg);
  } 

  if (topic == updateDeviceTopic){
    let msg = JSON.parse(message);
    console.log("lkjljlkjlkj")
    updateDevice(msg);
  } 


});









