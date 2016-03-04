var prompt = require('prompt');
var request = require('request');
var jsonfile = require('jsonfile');

var file = 'open-consumptions.json';

var doPost = function(data) {
  jsonfile.readFile('/home/david/burcht-cli-client/conf.json', function(err, conf){
    user = conf.user;
    password = conf.password;

    console.log("USER: " + user);
    console.log("PASSWORD: " + password);

    var authStr = "Basic " + new Buffer(user + ":" + password).toString("base64");
    request({
      url: 'https://burcht.davidammeraal.nl/api/consumptions', //URL to hit
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authStr
      },
      body: JSON.stringify(data),
      timeout: 5000, //Set the body as a string
    }, function(error, response, body) {
      jsonfile.readFile(file, function(err, backlog) {
        if(error){
          if(!backlog){
            backlog = [];
          }
          data.forEach(function(v){
            backlog.push(v);
          });
          jsonfile.writeFile(file, backlog, {spaces: 2});
        }else if(backlog.length > 0){
          jsonfile.writeFileSync(file, [], {space: 2});
          doPost(backlog);
        }
      });
    });
  });

};

var properties = [{
  description: 'Enter your Burcht User ID', // Prompt displayed to the user. If not supplied name will be used.
  type: 'string', // Specify the type of input to expect.
  pattern: /^[0-9]{4}$/,
  message: 'Must be valid Burcht User ID', // Warning message to display if validation fails.
  required: true // If true, value entered must be non-empty.
}];

var requestInput = function() {
  prompt.get(properties, function(err, result) {
    if (err) {
      return onErr(err);
    }
    doPost([{user: result.question, created: "" + new Date()}]);
    requestInput();
  });
};

prompt.start();
requestInput();

function onErr(err) {
  console.log(err);
  return 1;
}
