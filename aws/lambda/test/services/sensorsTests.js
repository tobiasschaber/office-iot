const sensorsServices = require('../../src/services/sensors');


const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "7654321";
const alreadyExistingSensorId = "26e98cf9";
const chai = require('chai');


it('should deliver the predefined sensor for a room', async function() {
    let result = [];
    result = await sensorsServices.getSensorsForRoom(predefinedRoomId);

    var expect = chai.expect;

    expect(result).to.not.be.undefined;
    expect(result.Items.length).to.above(0);

});


it('should find a room for a given sensor', async function() {
    let result = [];
    result = await sensorsServices.getRoomForSensor(alreadyExistingSensorId);

    var expect = chai.expect;
    expect(result).to.not.be.undefined;
    expect(result.attachedInRoom).to.equal(predefinedRoomId);

});


it('should delete the before created sensor', async function () {

    let deleteSensor = await sensorsServices.deleteSensor(predefinedSensorId);

    var expect = chai.expect;

    expect(deleteSensor).to.equal("deleted");
    let shouldNotFind = await sensorsServices.getRoomForSensor(predefinedSensorId);

    expect(shouldNotFind).to.equal("not found");


});
