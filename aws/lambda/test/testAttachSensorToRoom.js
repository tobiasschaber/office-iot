

var attach = require('../api/attachSensorToRoom');


attach.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(a);
    console.log(b);

}


/* invocation string:
    sensorId=testSensorId&roomId=testRoomId&description=testDescription
 */
var event = {
    queryStringParameters: {
        sensorId: "testSensorId",
        roomId: "testRoomId",
        description: "testDescription"

    }
}

attach.attachSensorToRoom(event, null, callback);