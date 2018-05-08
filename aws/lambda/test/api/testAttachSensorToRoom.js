

var attach = require('../../src/api/attachSensorToRoom');


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




var secondarySensor = {
    queryStringParameters: {
        sensorId: "72b7343c",
        roomId: "00000000-0000-0000-0000-000000000000",
        description: "second sensor attached in room Jakku"

    }
}

attach.attachSensorToRoom(secondarySensor, null, callback);