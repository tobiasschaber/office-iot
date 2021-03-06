
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
 * update a given room
 * @param roomId
 * @param roomName
 * @param svcAccountId
 * @param svcAccPrivateKey
 * @param calendarId
 */
exports.updateRoom = async (roomId, roomName, svcAccountId, svcAccPrivateKey, calendarId) => {
    AWS.config.update({region: awsRegion});
    return updateRoom(roomId, roomName, svcAccountId, svcAccPrivateKey, calendarId);
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
 */
async function getRooms() {

    let searchParams = getSearchParamsForGetRooms();
    return await serviceHelper.getQueryPromise(searchParams);
}


/**
 * get a room by a given roomId
 * @param roomId
 */
async function getRoomById(roomId) {

    let searchParams = getSearchParamsForGetRoomById(roomId);
    let roomPromise = serviceHelper.getQueryPromise(searchParams);

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
 */
async function createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId) {

    let uuid = uuidv1();
    let insertParams = getInsertParamsForCreateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId);

    let result = await serviceHelper.getPutPromise(insertParams);

    return { 'status': result,
             'uuid' : uuid };
}


/**
 * update a given room
 * @param uuid
 * @param roomName
 * @param svcAccountId
 * @param svcAccPrivateKey
 * @param calendarId
 * @return {Promise<void>}
 */
async function updateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId) {

    let insertParams = getUpdateParamsForCreateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId);

    let result = await serviceHelper.getUpdatePromise(insertParams);

    return { 'status': result,
        'uuid' : uuid };

}



/**
 * delete a room, identified by roomId
 * @param roomId
 * @callback
 */
async function deleteRoom(roomId) {

    let deleteParams = getDeleteParamsForDeleteByRoomId(roomId);
    return await serviceHelper.getDeletePromise(deleteParams);
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

    return {
        TableName: roomsTableName,
        Item: {
            "roomId": uuid,
            "roomName": roomName,
            "calendarServiceAccountId": svcAccountId,
            "calendarServiceAccountPrivateKey": svcAccPrivateKey,
            "calendarId": calendarId
        }
    }
}


/**
 * create the search parameters for deleting a room by roomId
 */
function getDeleteParamsForDeleteByRoomId(roomId) {

    return {
        TableName:roomsTableName,
        Key:{
            "roomId":roomId
        }
    };
}



/**
 * create search parameters for "getRooms"
 */
function getSearchParamsForGetRooms() {

    /* rooms database query parameters */
    return {
        TableName: roomsTableName,
        ProjectionExpression: "roomId, calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, roomName"
    };
}


/**
 * create search parameters for "getRooms"
 */
function getSearchParamsForGetRoomById(roomId) {

    /* sensor database query parameters */
    return {
        TableName: roomsTableName,
        ProjectionExpression: "#roomId, calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, roomName",
        FilterExpression:" #roomId = :roomId",
        ExpressionAttributeNames: {
            "#roomId": "roomId"
        }, ExpressionAttributeValues: {
            ":roomId": roomId
        }
    }
}


function getUpdateParamsForCreateRoom(uuid, roomName, svcAccountId, svcAccPrivateKey, calendarId) {

    return {
        TableName: roomsTableName,
        Key: {
            "roomId": uuid
        },
        UpdateExpression: "set calendarId = :cid, calendarServiceAccountId = :csaccid, roomName = :rn",
        ExpressionAttributeValues: {
            ":cid": calendarId,
            ":csaccid": svcAccountId,
            ":rn": roomName
        },
        ReturnValues:"UPDATED_NEW"
    }
}
