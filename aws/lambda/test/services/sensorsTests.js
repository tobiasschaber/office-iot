const sensorsServices = require('../../src/services/sensors');


const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "7654321";
const alreadyExistingSensorId = "26e98cf9";
const secondAlreadyExistingSensorId = "72b7343c";
const chai = require('chai');
const expect = chai.expect;


it('should deliver the predefined sensor for a room', async function() {

    let result = await sensorsServices.getSensorsForRoom(predefinedRoomId);

    expect(result).to.not.be.undefined;
    expect(result.Items.length).to.above(0);

});


it('should find a room for a given sensor', async function() {

    let result = await sensorsServices.getRoomForSensor(alreadyExistingSensorId);

    expect(result).to.not.be.undefined;
    expect(result.attachedInRoom).to.equal(predefinedRoomId);

});


it('should delete the before created sensor', async function () {

    let deleteSensor = await sensorsServices.deleteSensor(predefinedSensorId);

    expect(deleteSensor).to.equal("deleted");
    let shouldNotFind = await sensorsServices.getRoomForSensor(predefinedSensorId);

    expect(shouldNotFind).to.equal("not found");


});
