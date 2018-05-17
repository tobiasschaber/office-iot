const sensorsServices = require('../../src/services/sensors');


const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const predefinedSensorId = "26e98cf9";

it('should deliver the predefined sensor for a room', function(done) {
    sensorsServices.getSensorsForRoom(predefinedRoomId, function(result) {
        if(!result || result.Items.length === 0) {
            done("found no sensors because room not found");
            } else {

            for (var i = 0; i < result.Items.length; i++) {
                if (result.Items[i].sensorId === predefinedSensorId) {
                    done(false);    // success
                    return;
                }
            }
            done("the predefined sensor was not found")
        }
    });
});


it('should find a room for a given sensor', function(done) {
    sensorsServices.getRoomForSensor(predefinedSensorId, function(result) {
        if(!result || !result.attachedInRoom) {
            done("failed: no room returned");
        } else {
            if(result.attachedInRoom === predefinedRoomId) {
                done(false);    // success
            } else {
                done("returned room does not match expected room id");
            }
        }

    });
});
