var prompt = require('prompt');
var request = require('request');

var authStr = "Basic " + new Buffer("david:JFvZ8F*M20^A9b").toString("base64");

var doPost = function(userId, next){
  request({
    url: 'http://192.168.2.11:3000/api/consumptions', //URL to hit
    method: 'POST',
    headers: {
        'Content-Type': 'text/json',
        'Custom-Header': 'Custom Value',
        'Authorization' : authStr
    },
    body: JSON.stringify({user: userId}) //Set the body as a string
}, function(error, response, body){
    if(error) {
      console.log("HOI!");
        console.log(error);
    } else {
        console.log("ADDED CONSUMPTION!");
        next();
    }
});
};

var properties = [{
    description: 'Enter your Burcht User ID',     // Prompt displayed to the user. If not supplied name will be used.
    type: 'string',                 // Specify the type of input to expect.
    pattern: /^[a-f\d]{24}$/,
    message: 'Must be valid Burcht User ID', // Warning message to display if validation fails.
    required: true                        // If true, value entered must be non-empty.
  }];

var requestInput = function(){
  prompt.get(properties, function(err, result) {
    if (err) {
      return onErr(err);
    }
    doPost(result.question, requestInput);
  });
};

prompt.start();
requestInput();

function onErr(err) {
  console.log(err);
  return 1;
}
