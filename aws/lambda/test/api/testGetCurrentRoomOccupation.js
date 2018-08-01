

var getCurrentRoomOccupation = require('../../src/api/getCurrentRoomOccupation');


getCurrentRoomOccupation.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(b);

}





/* invocation string:
    timeFrame=120000
    https://tw2a648px5.execute-api.eu-central-1.amazonaws.com/prod/occupation?timeFrame=10000
 */
var event = {
    queryStringParameters: {
        timeFrame: 10000
    }
}

getCurrentRoomOccupation.getCurrentRoomOccupation(event, null, callback);
