

var detach = require('../api/detachSensorFromRoom');


detach.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(a);
    console.log(b);

}


var event = {
    queryStringParameters: {
        sensorId: "testSensorId",
        roomId: "testRoomId"
    }
}

detach.detachSensorFromRoom(event, null, callback);