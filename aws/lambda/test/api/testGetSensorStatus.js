

var sensorStatus = require('../../src/api/getSensorStatus');


sensorStatus.setLocalTestMode("officeiot");

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


sensorStatus.getSensorStatus(event, null, callback);
