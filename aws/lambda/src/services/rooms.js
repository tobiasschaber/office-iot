
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
 * create a room
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





