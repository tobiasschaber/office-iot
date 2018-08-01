const AWS = require('aws-sdk');
const awsRegion = 'eu-central-1';
const sensorsService = require('./sensors');
const roomsService = require('./rooms');
const delayOccupiedToFreeMs = 5000;


const currentRoomOccupationTableName = 'currentRoomOccupation';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
};


exports.updateCurrentRoomOccupation = async (sensorId, motionDetected, creationTimestamp) => {
    AWS.config.update({region: awsRegion});
    return updateCurrentRoomOccupation(sensorId, motionDetected, creationTimestamp);
}



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
    var getCurrentRoomOccupationPromiseWrapper = getQueryPromiseWrapper();

    let resp = await getCurrentRoomOccupationPromiseWrapper(searchParams);

    let currentCreationTimestamp = resp.Items[0].lastUpdatedTimestamp;
    let currentMotionDetected = resp.Items[0].occupationStatus;

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
    var getCurrentRoomOccupationPromiseWrapper = getQueryPromiseWrapper();

    var resp = await getCurrentRoomOccupationPromiseWrapper(searchParams);

    let currentCreationTimestamp = resp.Items[0].lastUpdatedTimestamp;
    let currentMotionDetected = resp.Items[0].occupationStatus;
    callback(roomId, motionDetected, creationTimestamp, currentCreationTimestamp, currentMotionDetected);

}



/**
 * create a promise wrapper for the dynamoDB query, which uses a callback implementation
 * @param searchparams the parameters for the search
 * @returns {Promise<any>}
 */
function getQueryPromiseWrapper() {

    const docClient = new AWS.DynamoDB.DocumentClient();

    var wrapper = function (searchParams) {
        return new Promise((resolve, reject) => {
            docClient.scan(searchParams, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    return wrapper;
};



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



