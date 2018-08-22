

var detectSensors = require('../../src/api/detectSensors');


detectSensors.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(b);

}


/* invocation string:
    roomName=TestRoom&accountId=testAccountId&privateKey=testPrivateKey&calendarId=testCalendarId
 */
var event = {
    queryStringParameters: {
    }
}

detectSensors.detectSensors(event, null, callback);
