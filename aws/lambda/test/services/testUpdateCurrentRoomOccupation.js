const currentOccupationServices = require('../../src/services/currentOccupation');



let predefinedSensorId = "26e98cf9";
let motionDetected = "1";
let creationTimestamp = new Date();





let event = { state: { reported: { motionDetected: 0 } },
    clientToken: '26e98cf9',
        creationTimestamp: 1533300899926,
    ttl: 1533387299,
    sensorId: '26e98cf9',
    motionDetected: 0 }


async function trigger() {
    let resp = await currentOccupationServices.updateCurrentRoomOccupation(event.sensorId, event.motionDetected, event.creationTimestamp);
    console.log(resp);
}

trigger();