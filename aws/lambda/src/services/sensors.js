
const AWS = require('aws-sdk');
const sensorsTableName = 'sensors';
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * get all sensors for a given room (by id)
 * @param roomId
 * @param callback
 */
exports.getSensorsForRoom = (roomId, callback) => {
    AWS.config.update({region: awsRegion});
    listSensorsForRoom(roomId, callback);
}

/**
 * get the room where a sensor is attached to
 * @param sensorId
 * @param callback
 */
exports.getRoomForSensor = (sensorId, callback) => {
    AWS.config.update({region: awsRegion});
    getRoomForSensor(sensorId, callback);
}




/**
 * get all sensors for a room
 * @param roomId
 * @param callback
 */
function listSensorsForRoom(roomId, callback) {

    var searchParams = getSearchParamsForListSensorsForRoom(roomId);
    var scanSensorsPromiseWrapper = getQueryPromiseWrapper();

    /* create a promise via the wrapper */
    var sensorPromise = scanSensorsPromiseWrapper(searchParams);

    /**
     * Wait for all Promises to be finished
     */
    Promise.all([sensorPromise])
        .then(resp => {
            callback(resp[0]);

        }).catch(err => {
            console.log(err.message);
            callback(err.message);
    });
}


function getRoomForSensor(sensorId, callback) {
    var searchParams = getSearchParamsForGetRoomForSensor(sensorId);
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
 * create search parameters for "listSensorsForRoom"
 * @param roomId
 * @returns {{TableName: string, ProjectionExpression: string, FilterExpression: string, ExpressionAttributeNames: {"#attachedInRoom": string}, ExpressionAttributeValues: {":attachedInRoom": *}}}
 */
function getSearchParamsForListSensorsForRoom(roomId) {

    /* sensor database query parameters */
    var searchparams = {
        TableName: sensorsTableName,
        ProjectionExpression: "sensorId, #attachedInRoom, description",
        FilterExpression:" #attachedInRoom = :attachedInRoom",
        ExpressionAttributeNames: {
            "#attachedInRoom": "attachedInRoom"
        }, ExpressionAttributeValues: {
            ":attachedInRoom": roomId
        }
    }

    return searchparams;
}


function getSearchParamsForGetRoomForSensor(sensorId) {

    /* sensor database query parameters */
    var searchparams = {
        TableName: sensorsTableName,
        ProjectionExpression: "attachedInRoom, #sensorId",
        FilterExpression:" #sensorId = :sensorId",
        ExpressionAttributeNames: {
            "#sensorId": "sensorId"
        }, ExpressionAttributeValues: {
            ":sensorId": sensorId
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




