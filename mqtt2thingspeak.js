var mqtt = require('mqtt');
var fs = require('fs');
var url = require('url');
var ThingSpeakClient = require('thingspeakclient');
var tsclient = new ThingSpeakClient();

var cfg = JSON.parse(fs.readFileSync('cfg.json', 'utf8'));
var host = cfg.host || 'localhost';
var port = cfg.port || 1883;
var client = mqtt.connect("mqtt://"+cfg.username+":"+cfg.password+"@"+host+":"+port,
{ protocolId: 'MQIsdp', protocolVersion: 3 });
var topic= cfg.topic;

client.subscribe(topic);
// console.log(cfg.tschannel);
tsclient.attachChannel(Number(cfg.tschannel), { writeKey:cfg.tskey}, function(err, resp) {
    if (!err && resp > 0) {
        console.log('attach successfully. Entry number was: ' + resp);
    } else if(err) {
      console.log(err);
  }});

var ob;
counter = 0;
client.on('message', function(topic,message) {
  console.log(JSON.parse(message));
  if(counter++ > 30) {
    ob = JSON.parse(message);
    tsclient.updateChannel(Number(cfg.tschannel), {field1: ob.temp, field2:Number(ob.hum)});
    counter = 0;
  }
});
