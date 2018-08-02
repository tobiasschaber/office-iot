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
 * get all sensors attached to a given room
 * @param roomId the id of the room to query
 * @return {Promise<*>}
 */
exports.getSensorsForRoom = async (roomId) => {
    AWS.config.update({region: awsRegion});

    return listSensorsForRoom(roomId);
}



/**
 * get the room where a sensor is attached to (reverse)
 * @param sensorId the sensor to find owning room
 * @return {Promise<*>}
 */
exports.getRoomForSensor = async (sensorId) => {
    AWS.config.update({region: awsRegion});
    return getRoomForSensor(sensorId);
}


/**
 * delete a sensor by its id
 * @param sensorId
 * @return {Promise<*>}
 */
exports.deleteSensor = async (sensorId) => {
    AWS.config.update({region: awsRegion});
    return deleteSensor(sensorId);
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

    if(resp.Items.length === 0) {
        return "not found";
    }
    return resp.Items[0];
}



/**
 * delete a sensor, identified by sensorId
 * @param sensorId
 * @callback
 */
async function deleteSensor(sensorId) {

    var deleteParams = getDeleteParamsForDeleteBySensorId(sensorId);

    let result = await serviceHelper.getDeletePromise(deleteParams);

    return result;

}



/**
 * create the search parameters for deleting a sensor by sensorId
 */
function getDeleteParamsForDeleteBySensorId(sensorId) {

    var deleteParams = {
        TableName:sensorsTableName,
        Key:{
            "sensorId":sensorId
        }
    };

    return deleteParams;
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

