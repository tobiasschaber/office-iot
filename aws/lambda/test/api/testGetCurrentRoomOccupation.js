

var getCurrentRoomOccupation = require('../../src/api/getCurrentRoomOccupation');


getCurrentRoomOccupation.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(b);

}





/* invocation string:
    timeFrame=120000
 */
var event = {
    queryStringParameters: {
        timeFrame: 120000
    }
}

getCurrentRoomOccupation.getCurrentRoomOccupation(event, null, callback);
