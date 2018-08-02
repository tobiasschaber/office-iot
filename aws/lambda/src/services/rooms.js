
const AWS = require('aws-sdk');
const roomsTableName = 'rooms';
const uuidv1 = require('uuid/v1');
const awsRegion = 'eu-central-1';
const serviceHelper = require('./serviceHelper');



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * get a list of all existing rooms
 * @return {Promise<*>}
 */
exports.getRooms = async () => {
    AWS.config.update({region: awsRegion});
    return getRooms();

}


/**
 * create a new room
 * @param roomName
 * @param svcAccountId
 * @param svcAccPrivateKey
 * @param calendarId
 * @param callback
 */
//TODO callback ausbauen
exports.createRoom = (roomName, svcAccountId, svcAccPrivateKey, calendarId, callback) => {
    AWS.config.update({region: awsRegion});
    createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId, callback);
}


/**
 * get a room by its id
 * @param roomId
 * @param callback
 */
//TODO callback ausbauen
exports.getRoomById = async (roomId, callback) => {
    AWS.config.update({region: awsRegion});

    getRoomById(roomId, callback);

}



/**
 * delete a room identified by roomId
 * @param roomId
 * @param callback
 */
//TODO callback ausbauen
exports.deleteRoom = (roomId, callback) => {
    AWS.config.update({region: awsRegion});
    deleteRoom(roomId, callback)
}




/**
 * get all rooms
 * @param callback
 */
async function getRooms() {

    var searchParams = getSearchParamsForGetRooms();
    var roomPromise = await serviceHelper.getQueryPromise(searchParams);

   return roomPromise;
}


/**
 * get a room by a given roomId
 * @param roomId
 * @param callback
 */
async function getRoomById(roomId, callback) {

    var searchParams = getSearchParamsForGetRoomById(roomId);
    var roomPromise = serviceHelper.getQueryPromise(searchParams);

    let result = await roomPromise;
    callback(result.Items[0]);

}


/**
 * create a new room. the roomId is randomly generated
 * @param roomName
 * @param svcAccountId
 * @param svcAccPrivateKey
 * @param calendarId
 * @param callback
 */
function createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId, callback) {

    const docClient = new AWS.DynamoDB.DocumentClient();
    var uuid = uuidv1();
    var insertParams = getInsertParamsForCreateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId);

    docClient.put(insertParams, function (err, data) {
        if (err) {
            console.error("Unable to create room. Error JSON:", JSON.stringify(err, null, 2));
            callback(err.message);
        } else {
            console.log("room created with id: " + uuid);

            callback(uuid);
        }
    });

}


/**
 * delete a room, identified by roomId
 * @param roomId
 * @callback
 */
function deleteRoom(roomId, callback) {

    const docClient = new AWS.DynamoDB.DocumentClient();
    var deleteParams = getDeleteParamsForDeleteByRoomId(roomId);

    docClient.delete(deleteParams, function (err, data) {
        if(err) {
            console.log(err);
            callback(false);
        } else {
            callback(true);
        }
    });
}


/**
 * create aws dynamodb insert parameters for a new room
 * @param uuid
 * @param roomName
 * @param svcAccountId
 * @param svcAccPrivateKey
 * @param calendarId
 * @return {{TableName: string, Item: {roomId: *, roomName: *, calendarServiceAccountId: *, calendarServiceAccountPrivateKey: *, calendarId: *}}}
 */
function getInsertParamsForCreateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId) {

    var params = {
        TableName: roomsTableName,
        Item: {
            "roomId": uuid,
            "roomName": roomName,
            "calendarServiceAccountId": svcAccountId,
            "calendarServiceAccountPrivateKey": svcAccPrivateKey,
            "calendarId": calendarId
        }
    }

    return params;
}


/**
 * create the search parameters for deleting a room by roomId
 */
function getDeleteParamsForDeleteByRoomId(roomId) {

    var deleteParams = {
        TableName:roomsTableName,
        Key:{
            "roomId":roomId
        }
    };

    return deleteParams;
}



/**
 * create search parameters for "getRooms"
 */
function getSearchParamsForGetRooms() {

    /* rooms database query parameters */
    var searchparams = {
        TableName: roomsTableName,
        ProjectionExpression: "roomId, calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, roomName"
    };

    return searchparams;
}


/**
 * create search parameters for "getRooms"
 */
function getSearchParamsForGetRoomById(roomId) {

    /* sensor database query parameters */
    var searchparams = {
        TableName: roomsTableName,
        ProjectionExpression: "#roomId, calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, roomName",
        FilterExpression:" #roomId = :roomId",
        ExpressionAttributeNames: {
            "#roomId": "roomId"
        }, ExpressionAttributeValues: {
            ":roomId": roomId
        }
    }

    return searchparams;
}

