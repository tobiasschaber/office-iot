const sensorServices = require('../../src/services/sensors');
const attachmentServices = require('../../src/services/sensorAttachment');
const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "12345678";
const chai = require('chai');
const expect = chai.expect;


it('should attach a new sensor to a given room', async function() {
    let result = await attachmentServices.attachSensorToRoom(predefinedSensorId, predefinedRoomId, "test attachment");
    expect(result).to.equals("success");

    let checkResult = await sensorServices.getRoomForSensor(predefinedSensorId);
    expect(checkResult.attachedInRoom).to.equals(predefinedRoomId);
});


it('should set last updated field on sensor', async function() {

    var newUpdateTimestamp = new Date().getTime();


    let result = await sensorServices.setSensorLastUpdateReceived(predefinedSensorId, newUpdateTimestamp);
    expect(result).to.equals("success");

    let sensorStatus = await sensorServices.getSensorStatus();

    let newLastUpdated;

    for(let i=0; i<sensorStatus.length; i++) {
        if(sensorStatus[i].sensorId === predefinedSensorId) {
            newLastUpdated = sensorStatus[i].lastUpdated;
        }
    }
    expect(newLastUpdated).to.equal(newUpdateTimestamp);
    
    /* clean up */
    let deleteSensor = await sensorServices.deleteSensor(predefinedSensorId);
    expect(deleteSensor).to.equal("deleted");

});

