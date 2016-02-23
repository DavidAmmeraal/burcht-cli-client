var prompt = require('prompt');


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
    console.log('Command-line input received:');
    console.log('  User ID:: ' , result);
    requestInput();
  });
};

prompt.start();
requestInput();

function onErr(err) {
  console.log(err);
  return 1;
}
