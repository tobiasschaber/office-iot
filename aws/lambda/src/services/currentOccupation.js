const AWS = require('aws-sdk');
const awsRegion = 'eu-central-1';
const sensorsService = require('./sensors');
const serviceHelper = require('../helper/serviceHelper');
const delayOccupiedToFreeMs = 5000;


const currentRoomOccupationTableName = 'currentRoomOccupation';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    sensorsService.setLocalTestMode(awsCredentialsProfile);
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
};


/**
 * update the occupation status for a given room
 * @param sensorId
 * @param motionDetected
 * @param creationTimestamp
 * @return {Promise<*>}
 */
exports.updateCurrentRoomOccupation = async (sensorId, motionDetected, creationTimestamp) => {
    AWS.config.update({region: awsRegion});
    return updateCurrentRoomOccupation(sensorId, motionDetected, creationTimestamp);
}


/**
 * return the current occupation status for a given room
 * @param roomId the room id th check
 * @param roomName the name to check
 * @param callback
 * @return {Promise<void>}
 */
//TODO callback ausbauen
exports.getCurrentRoomOccupation = async (roomId, roomName, callback) => {
    AWS.config.update({region: awsRegion});
    return getCurrentRoomOccupation(roomId, roomName, callback);
}




/**
 * function to update the current room occupation table
 * @param sensorId
 * @param motionDetected
 * @param creationTimestamp
 */
async function updateCurrentRoomOccupation(sensorId, motionDetected, creationTimestamp) {

    let resp = await sensorsService.getRoomForSensor(sensorId, resolve);

    let roomId = resp[0].attachedInRoom;
    return getCurrentRoomOccupationEnriched(roomId, motionDetected, creationTimestamp, updateCurrentRoomOccupationTable);
}



function updateCurrentRoomOccupationTable(roomId, motionDetected, creationTimestamp, currentCreationTimestamp, currentMotionDetected) {

     /* switch from "free" to "occupied" */
     if(motionDetected === 1) {
         updateCurrentOccupation(getInsertParamsForUpdateCurrentOccupation(roomId, creationTimestamp, "occupied"));

     } else {
         if(motionDetected === 0) {
             if(creationTimestamp >= (currentCreationTimestamp + delayOccupiedToFreeMs)) {
                 updateCurrentOccupation(getInsertParamsForUpdateCurrentOccupation(roomId, creationTimestamp, "free"));
             }
         }
     }
}



function getInsertParamsForUpdateCurrentOccupation(roomId, newLastUpdatedTimestamp, newOccupationStatus) {

    var params = {
        TableName: currentRoomOccupationTableName,
        Item: {
            "roomId": roomId,
            "lastUpdatedTimestamp": newLastUpdatedTimestamp,
            "occupationStatus": newOccupationStatus
        }
    }
    return params;
}



/**
 * perform an update on the current occupation status table
 * @param insertParams
 */
function updateCurrentOccupation(insertParams) {

    const docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(insertParams, function (err, data) {
        if (err) {
            console.error("Unable to add notification. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("updated current occupation status table");
        }
    });

}


async function getCurrentRoomOccupation(roomId, roomName, callback) {

    var searchParams = getQueryForGetCurrentRoomOccupation(roomId);
    let resp = await serviceHelper.getQueryPromise(searchParams);

    let currentCreationTimestamp;
    let currentMotionDetected;

    if(resp.Items.length === 0) {
        currentMotionDetected = "no data";
        currentCreationTimestamp = "0";
    } else {
        currentCreationTimestamp = resp.Items[0].lastUpdatedTimestamp;
        currentMotionDetected = resp.Items[0].occupationStatus;
    }

    let currentOccupationStatus = {
        "roomId": roomId,
        "roomName": roomName,
        "creationTimestamp": currentCreationTimestamp,
        "motionDetected": currentMotionDetected
    }

    callback(currentOccupationStatus);

}


async function getCurrentRoomOccupationEnriched(roomId, motionDetected, creationTimestamp, callback) {

    var searchParams = getQueryForGetCurrentRoomOccupation(roomId);
    var resp = await serviceHelper.getQueryPromise(searchParams);

    let currentCreationTimestamp = resp.Items[0].lastUpdatedTimestamp;
    let currentMotionDetected = resp.Items[0].occupationStatus;
    callback(roomId, motionDetected, creationTimestamp, currentCreationTimestamp, currentMotionDetected);

}



function getQueryForGetCurrentRoomOccupation(roomId) {


    /* motions database query parameters to detect relevant events */
    var searchparams = {
        TableName: currentRoomOccupationTableName,
        ProjectionExpression: "lastUpdatedTimestamp, occupationStatus",
        FilterExpression: "roomId = :roomId",
        ExpressionAttributeValues: {
            ":roomId": roomId
        }
    };
    return searchparams;
}



