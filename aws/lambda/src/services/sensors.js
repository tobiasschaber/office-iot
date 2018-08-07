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
 * return the current status of all sensors
 * @return {Promise<void>}
 */
exports.getSensorStatus = async () => {
    AWS.config.update({region: awsRegion});
    return getSensorStatus();
}


/**
 * update the last update received status field of a sensor
 * @param sensorId the sensor to update
 * @param lastUpdatedTimestamp the new last updated timestamp
 * @return {Promise<void>}
 */
exports.setSensorLastUpdateReceived = async (sensorId, lastUpdatedTimestamp) => {
    AWS.config.update({region: awsRegion});
    return setSensorLastUpdateReceived(sensorId, lastUpdatedTimestamp);

}



/**
 * get all sensors for a room
 * @param roomId
 */
async function listSensorsForRoom(roomId) {

    let searchParams = getSearchParamsForListSensorsForRoom(roomId);
    return await serviceHelper.getQueryPromise(searchParams);
}


/**
 * get the room where a given sensor is attached
 * @param sensorId
 */
async function getRoomForSensor(sensorId) {
    let searchParams = getSearchParamsForGetRoomForSensor(sensorId);
    let resp = await serviceHelper.getQueryPromise(searchParams);

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

    let deleteParams = getDeleteParamsForDeleteBySensorId(sensorId);
    return await serviceHelper.getDeletePromise(deleteParams);
}


/**
 * get sensor status for all sensors
 * @return {Promise<any>}
 */
async function getSensorStatus() {
    let searchParams = getSearchParamsForGetSensorStatus();
    let sensors = await serviceHelper.getQueryPromise(searchParams);

    if(sensors.Items.length === 0) {
        return "not found";
    }
    return sensors.Items;

}


/**
 * update the "last updated" field of a sensor
 * @param sensorId the sensor to update
 * @param lastUpdatedTimestamp the new last updated timestamp
 * @return {Promise<any>}
 */
async function setSensorLastUpdateReceived(sensorId, lastUpdatedTimestamp) {

    let insertParams = getUpdateParamsSetLastUpdateReceived(sensorId, lastUpdatedTimestamp);
    return await serviceHelper.getUpdatePromise(insertParams);
}


/**
 * create the insert params to update the last updated timestamp of a sensor
 * @param sensorId the sensor to update
 * @param lastUpdatedTimestamp the new timestamp
 * @return {{TableName: string, Item: {sensorId: *, lastUpdated: *}}}
 */
function getUpdateParamsSetLastUpdateReceived(sensorId, lastUpdatedTimestamp) {

    return {
        TableName: sensorsTableName,
        Key: {
            "sensorId": sensorId
        },
        UpdateExpression: "set lastUpdated = :lu",
        ExpressionAttributeValues: {
            ":lu": lastUpdatedTimestamp
        },
        ReturnValues:"UPDATED_NEW"
    }
}


/**
 * create the search parameters for deleting a sensor by sensorId
 */
function getDeleteParamsForDeleteBySensorId(sensorId) {

    return {
        TableName:sensorsTableName,
        Key:{
            "sensorId":sensorId
        }
    };
}


function getSearchParamsForListSensorsForRoom(roomId) {

    /* sensor database query parameters */
    return {
        TableName: sensorsTableName,
        ProjectionExpression: "sensorId, #attachedInRoom, description, lastUpdated",
        FilterExpression:" #attachedInRoom = :attachedInRoom",
        ExpressionAttributeNames: {
            "#attachedInRoom": "attachedInRoom"
        }, ExpressionAttributeValues: {
            ":attachedInRoom": roomId
        }
    }
}


function getSearchParamsForGetSensorStatus() {

    /* sensor database query parameters */
    return {
        TableName: sensorsTableName,
        ProjectionExpression: "sensorId, attachedInRoom, description, lastUpdated",
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

