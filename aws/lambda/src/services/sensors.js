const AWS = require('aws-sdk');
const sensorsTableName = 'sensors';
const awsRegion = 'eu-central-1';
const motionServices = require('./motions');
const serviceHelper = require('./serviceHelper');


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    motionServices.setLocalTestMode(awsCredentialsProfile);
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * get all sensors for a given room (by id)
 * @param roomId
 * @param callback
 */
exports.getSensorsForRoom = async (roomId) => {
    AWS.config.update({region: awsRegion});

    return listSensorsForRoom(roomId);
}

/**
 * get the room where a sensor is attached to
 * @param sensorId
 * @param callback
 */
exports.getRoomForSensor = async (sensorId) => {
    AWS.config.update({region: awsRegion});
    return getRoomForSensor(sensorId);
}


/**
 * get all sensors for a room
 * @param roomId
 * @param callback
 */
async function listSensorsForRoom(roomId) {

    var searchParams = getSearchParamsForListSensorsForRoom(roomId);
    var resp = await serviceHelper.getQueryPromise(searchParams);

    return resp;

}


/**
 * get the room where a given sensor is attached
 * @param sensorId
 * @param callback
 */
async function getRoomForSensor(sensorId) {
    var searchParams = getSearchParamsForGetRoomForSensor(sensorId);
    var resp = await serviceHelper.getQueryPromise(searchParams);

    return resp.Items[0];
}




/**
 * create search parameters for "listSensorsForRoom"
 * @param roomId
 * @returns {{  TableName: string,
 *              ProjectionExpression: string,
 *              FilterExpression: string,
 *              ExpressionAttributeNames: {"#attachedInRoom": string},
 *              ExpressionAttributeValues: {":attachedInRoom": *}}}
 */
function getSearchParamsForListSensorsForRoom(roomId) {

    /* sensor database query parameters */
    return {
        TableName: sensorsTableName,
        ProjectionExpression: "sensorId, #attachedInRoom, description",
        FilterExpression:" #attachedInRoom = :attachedInRoom",
        ExpressionAttributeNames: {
            "#attachedInRoom": "attachedInRoom"
        }, ExpressionAttributeValues: {
            ":attachedInRoom": roomId
        }
    }
}


function getSearchParamsForGetRoomForSensor(sensorId) {

    /* sensor database query parameters */
    return {
        TableName: sensorsTableName,
        ProjectionExpression: "attachedInRoom, #sensorId",
        FilterExpression:" #sensorId = :sensorId",
        ExpressionAttributeNames: {
            "#sensorId": "sensorId"
        }, ExpressionAttributeValues: {
            ":sensorId": sensorId
        }
    }
}

