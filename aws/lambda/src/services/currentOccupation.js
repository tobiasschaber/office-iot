const AWS = require('aws-sdk');
const awsRegion = 'eu-central-1';
const sensorsService = require('./sensors');
const serviceHelper = require('../helper/serviceHelper');
const delayOccupiedToFreeMs = 3000;  /* time in ms to force-keep a room occupied */
const timeUntilOccupationNoData = 60000; /* time (ms) to indicate that room has no data */


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
 * @return {Promise<void>}
 */
exports.getCurrentRoomOccupation = async (roomId, roomName) => {
    AWS.config.update({region: awsRegion});
    return getCurrentRoomOccupation(roomId, roomName);
}




/**
 * function to update the current room occupation table
 * @param sensorId
 * @param motionDetected
 * @param creationTimestamp
 */
async function updateCurrentRoomOccupation(sensorId, motionDetected, creationTimestamp) {

    let resp = await sensorsService.getRoomForSensor(sensorId);

    let roomId = resp.attachedInRoom;
    return getCurrentRoomOccupationEnriched(roomId, motionDetected, creationTimestamp, updateCurrentRoomOccupationTable);
}



function updateCurrentRoomOccupationTable(roomId, motionDetected, creationTimestamp, currentCreationTimestamp, currentMotionDetected) {

     /* switch from "free" to "occupied" */
     if(motionDetected == 1) {
         console.log("update to status occupied");
         updateCurrentOccupation(getInsertParamsForUpdateCurrentOccupation(roomId, creationTimestamp, "occupied"));

     } else {
         if(motionDetected == 0) {

             if(creationTimestamp >= (currentCreationTimestamp + delayOccupiedToFreeMs)) {
                 console.log("update to status free");
                 updateCurrentOccupation(getInsertParamsForUpdateCurrentOccupation(roomId, creationTimestamp, "free"));
             } else {
                 console.log("ignore status update");
             }

         }
     }
}



function getInsertParamsForUpdateCurrentOccupation(roomId, newLastUpdatedTimestamp, newOccupationStatus) {

    return {
        TableName: currentRoomOccupationTableName,
        Item: {
            "roomId": roomId,
            "lastUpdatedTimestamp": newLastUpdatedTimestamp,
            "occupationStatus": newOccupationStatus
        }
    }
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


async function getCurrentRoomOccupation(roomId, roomName) {

    let searchParams = getQueryForGetCurrentRoomOccupation(roomId);
    let resp = await serviceHelper.getQueryPromise(searchParams);

    let currentCreationTimestamp;
    let currentMotionDetected;

    if(resp.Items.length === 0) {
        currentMotionDetected = "no data";
        currentCreationTimestamp = "0";
    } else {

        if(resp.Items[0].lastUpdatedTimestamp < (new Date().getTime() - (timeUntilOccupationNoData))) {
            currentMotionDetected = "no data";
            currentCreationTimestamp = "0";
        } else {
            currentCreationTimestamp = resp.Items[0].lastUpdatedTimestamp;
            currentMotionDetected = resp.Items[0].occupationStatus;
        }
    }

    return {
        "roomId": roomId,
        "roomName": roomName,
        "creationTimestamp": currentCreationTimestamp,
        "motionDetected": currentMotionDetected
    };
}


async function getCurrentRoomOccupationEnriched(roomId, motionDetected, creationTimestamp, callback) {

    let searchParams = getQueryForGetCurrentRoomOccupation(roomId);
    let resp = await serviceHelper.getQueryPromise(searchParams);

    /* default values if room occupation config db entry was not yet created */
    let currentCreationTimestamp = 0;
    let currentMotionDetected = 0;

    if(resp.Items.length > 0) {
        currentCreationTimestamp = resp.Items[0].lastUpdatedTimestamp;
        currentMotionDetected = resp.Items[0].occupationStatus;
    }

    callback(roomId, motionDetected, creationTimestamp, currentCreationTimestamp, currentMotionDetected);

}



function getQueryForGetCurrentRoomOccupation(roomId) {


    /* motions database query parameters to detect relevant events */
    return {
        TableName: currentRoomOccupationTableName,
        ProjectionExpression: "lastUpdatedTimestamp, occupationStatus",
        FilterExpression: "roomId = :roomId",
        ExpressionAttributeValues: {
            ":roomId": roomId
        }
    };
}



