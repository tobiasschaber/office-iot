
const AWS = require('aws-sdk');
const roomsTableName = 'rooms';
const uuidv1 = require('uuid/v1');
const awsRegion = 'eu-central-1';



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * get all rooms
 * @param callback
 */
exports.getRooms = (callback) => {
    AWS.config.update({region: awsRegion});
    getRooms(callback);
}

/**
 * create a new room
 */
exports.createRoom = (roomName, svcAccountId, svcAccPrivateKey, calendarId, callback) => {
    AWS.config.update({region: awsRegion});
    createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId, callback);
}

/**
 * get a room by its id
 * @param roomId
 * @param callback
 */
exports.getRoomById = (roomId, callback) => {
    AWS.config.update({region: awsRegion});
    getRoomById(roomId, callback);
}

/**
 * delete a room identified by roomId
 * @param roomId
 * @param callback
 */
exports.deleteRoom = (roomId, callback) => {
    AWS.config.update({region: awsRegion});
    deleteRoom(roomId, callback)
}


/**
 * get all rooms
 * @param callback
 */
function getRooms(callback) {

    var searchParams = getSearchParamsForGetRooms();
    var scanSensorsPromiseWrapper = getQueryPromiseWrapper();

    /* create a promise via the wrapper */
    var roomPromise = scanSensorsPromiseWrapper(searchParams);

    /**
     * Wait for all Promises to be finished
     */
    Promise.all([roomPromise])
        .then(resp => {
            callback(resp[0]);

        }).catch(err => {
        console.log(err.message);
        callback(err.message);
    });
}


/**
 * get a room by a given roomId
 * @param roomId
 * @param callback
 */
function getRoomById(roomId, callback) {

    var searchParams = getSearchParamsForGetRoomById(roomId);
    var scanSensorsPromiseWrapper = getQueryPromiseWrapper();

    /* create a promise via the wrapper */
    var roomPromise = scanSensorsPromiseWrapper(searchParams);

    /**
     * Wait for all Promises to be finished
     */
    Promise.all([roomPromise])
        .then(resp => {
            callback(resp[0].Items[0]);

        }).catch(err => {
        console.log(err.message);
        callback(err.message);
    });

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





