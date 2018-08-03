
const sensorAttachmentServices = require('../../src/services/sensorAttachment');

const predefinedRoomId = "00000000-0000-0000-0000-000000000000";
const firstSensorId = "26e98cf9";
const secondSensorId = "72b7343c";


/* this will create the two default sensors in Jakku used in the project */
createSensors();



async function createSensors() {
    await sensorAttachmentServices.attachSensorToRoom(firstSensorId, predefinedRoomId, "Sensor auf dem Tisch im Jakku");
    await sensorAttachmentServices.attachSensorToRoom(secondSensorId, predefinedRoomId, "Zweiter Sensor auf dem Tisch im Jakku");
}


