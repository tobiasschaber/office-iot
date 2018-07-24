const motionServices = require('../../src/services/motions');

const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "26e98cf9";

it('should should return some motions for predefined sensor', function(done) {
    motionServices.getMotionsForSensor(predefinedSensorId, undefined, function(result) {
        if(!result || result.length === 0) {
            done("failed: no motions returned for sensor " +
                predefinedSensorId +
                ". please note that this might be due to never sending any motions!");
        } else {
            done(false);    // success
        }
    });
});


it('should return some motions for a predefined room', function(done) {
    motionServices.getMotionsForRoom(predefinedRoomId, undefined, function(result) {
        if(!result || result.length === 0) {
            done("failed: no motions returned for room " +
            predefinedRoomId +
            ". please note that this might be due to never sending any motions!")
        } else {

            if(!result[0].sensorId || result[0].sensorId !== predefinedSensorId) {
                done("failed: returned sensor for room does not have expected sensorId");
            } else {
                done(false); // success
            }
        }
    });
});


it('should return some motions for a predefined room with time override', function(done) {
    motionServices.getMotionsForRoom(predefinedRoomId, 12000000, function(result) {
        if(!result || result.length === 0) {
            done("failed: no motions returned for room " +
                predefinedRoomId +
                ". please note that this might be due to never sending any motions!")
        } else {

            if(!result[0].sensorId || result[0].sensorId !== predefinedSensorId) {
                done("failed: returned sensor for room does not have expected sensorId");
            } else {
                done(false); // success
            }
        }
    });
});