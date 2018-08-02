const attachmentServices = require('../../src/services/sensorAttachment');
const sensorServices = require('../../src/services/sensors');


const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "12345678";
const chai = require('chai');


it('should attach a new sensor to a given room', async function() {
    let result = await attachmentServices.attachSensorToRoom(predefinedSensorId, predefinedRoomId, "test attachment");

    var expect = chai.expect;
    expect(result).to.equals("success");

    let checkResult = await sensorServices.getRoomForSensor(predefinedSensorId);

    expect(checkResult.attachedInRoom).to.equals(predefinedRoomId);
});


it('should detach a test sensor', async function() {

    let result = await attachmentServices.detachSensorFromRoom(predefinedSensorId, predefinedRoomId);

    var expect = chai.expect;
    expect(result).to.equals("success");

    let checkResult = await sensorServices.getRoomForSensor(predefinedSensorId);

    expect(checkResult.attachedInRoom).to.equals("-");



    /* clean up */
    let deleteSensor = await sensorServices.deleteSensor(predefinedSensorId);
    expect(deleteSensor).to.equal("deleted");

});

