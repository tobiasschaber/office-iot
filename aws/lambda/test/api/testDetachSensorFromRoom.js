

var detach = require('../../src/api/detachSensorFromRoom');


detach.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(a);
    console.log(b);

}


/* invocation string:
    sensorId=testSensorId&roomId=testRoomId
 */
var event = {
    queryStringParameters: {
        sensorId: "testSensorId",
        roomId: "testRoomId"
    }
}

detach.detachSensorFromRoom(event, null, callback);