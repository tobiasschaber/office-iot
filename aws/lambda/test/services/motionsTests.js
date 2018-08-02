const motionServices = require('../../src/services/motions');
const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "26e98cf9";
const chai = require('chai');
const expect = chai.expect;


it('should should return some motions for predefined sensor', async function() {
    let result = await motionServices.getMotionsForSensor(predefinedSensorId, undefined);
    expect(result.length).to.above(0);
});


it('should return some motions for a predefined room', async function() {

    let result = await motionServices.getMotionsForRoom(predefinedRoomId, undefined);
    expect(result.length).to.above(0);
    expect(result[0]).to.not.be.undefined;
    expect(result[0].sensorId).to.equal(predefinedSensorId);

}).timeout(5000);


it('should return some motions for a predefined room with time override', async function() {
    let result = await motionServices.getMotionsForRoom(predefinedRoomId, 12000000);

    expect(result.length).to.above(0);
    expect(result[0]).to.not.be.undefined;
    expect(result[0].sensorId).to.equal(predefinedSensorId);

});