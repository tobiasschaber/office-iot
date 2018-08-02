const AWS = require('aws-sdk');
const sensorsTableName = 'sensors';
const awsRegion = 'eu-central-1';
const serviceHelper = require('../helper/serviceHelper');



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * attach a sensor to a room
 * @param sensorId the sensor to attach
 * @param roomId the room to attach the sensor to
 * @param description name of the attachment
 * @return {Promise<void>}
 */
exports.attachSensorToRoom = async (sensorId, roomId, description) => {
    AWS.config.update({region: awsRegion});
    return attachSensorToRoom(sensorId, roomId, description);
}


/**
 * detach a sensor from a room
 * @param sensorId the sensor to find owning room
 * @param roomId
 * @return {Promise<void>}
 */
exports.detachSensorFromRoom = async (sensorId, roomId) => {
    AWS.config.update({region: awsRegion});
    return detachSensorFromRoom(sensorId, roomId);
}



/**
 * attach a sensor to a room
 * @param sensorId
 * @param roomId
 * @param description
 */
async function attachSensorToRoom(sensorId, roomId, description) {

    let params = {
        TableName: sensorsTableName,
        Item: {
            "sensorId": sensorId,
            "attachedInRoom": roomId,
            "description": description
        }
    };

    var attache = await serviceHelper.getPutPromise(params);

    return attache;
}




/**
 * detach a sensor from a room
 * @param sensorId
 * @param roomId
 */
async function detachSensorFromRoom(sensorId, roomId) {

    let params = {
        TableName: sensorsTableName,
        Item: {
            "sensorId": sensorId,
            "attachedInRoom": "-",
        }
    };

    var detache = await serviceHelper.getPutPromise(params);

    return detache;
}

