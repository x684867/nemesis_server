
var fs = require('fs');
var file = '/srv/nemesis/etc/nemesis/app/broker.config.json';
 
fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
 
  data = JSON.parse(data);
 
  console.log(data);
});
