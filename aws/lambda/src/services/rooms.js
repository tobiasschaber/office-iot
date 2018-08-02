
const AWS = require('aws-sdk');
const roomsTableName = 'rooms';
const uuidv1 = require('uuid/v1');
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
 */
exports.createRoom = async (roomName, svcAccountId, svcAccPrivateKey, calendarId) => {
    AWS.config.update({region: awsRegion});
    return createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId);
}


/**
 * get a room by its id
 * @param roomId
 */
exports.getRoomById = async (roomId) => {
    AWS.config.update({region: awsRegion});

    return getRoomById(roomId);

}



/**
 * delete a room identified by roomId
 * @param roomId
 */
exports.deleteRoom = (roomId) => {
    AWS.config.update({region: awsRegion});
    return deleteRoom(roomId);
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

    if(result.Items.length === 0) {
        return "not found";
    }

    return result.Items[0];
}


/**
 * create a new room. the roomId is randomly generated
 * @param roomName
 * @param svcAccountId
 * @param svcAccPrivateKey
 * @param calendarId
 * @param callback
 */
async function createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId, callback) {

    var uuid = uuidv1();
    var insertParams = getInsertParamsForCreateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId);
    var result = await serviceHelper.getPutPromise(insertParams);

    //TODO exception handling
    return { 'uuid' : uuid };

}


/**
 * delete a room, identified by roomId
 * @param roomId
 * @callback
 */
async function deleteRoom(roomId) {

    const docClient = new AWS.DynamoDB.DocumentClient();
    var deleteParams = getDeleteParamsForDeleteByRoomId(roomId);

    let result = await serviceHelper.getDeletePromise(deleteParams);

    return result;

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

