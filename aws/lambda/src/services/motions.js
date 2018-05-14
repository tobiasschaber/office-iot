
const AWS = require('aws-sdk');
const motionsTableName = 'motions';
const awsRegion = 'eu-central-1';
const motionTimeFrameSizeSec = 60*60*24;        /* time frame size in seconds in the past to query motion events */
const sensorsServices = require('./sensors');

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * get all motions for a sensor
 * @param sensorId
 * @param callback
 */
exports.getMotionsForSensor = (sensorId, callback) => {
    AWS.config.update({region: awsRegion});
    getMotionsForSensor(sensorId.trim(), callback);
}


/**
 * get all motions detected in a given room
 * @param roomId
 * @param callback
 */
exports.getMotionsForRoom = (roomId, callback) => {
    AWS.config.update({region: awsRegion});
    getMotionsForRoom(roomId, callback);
}


/**
 * get all motions for a sensor
 * @param sensorId
 * @param callback
 */
function getMotionsForSensor(sensorId, callback, lastEvaluatedKey, pagedItems) {

    var searchParams = getQueryForGetMotionsForSensor(sensorId, lastEvaluatedKey);
    var scanMotionsPromiseWrapper = getQueryPromiseWrapper();

    if(!pagedItems) var pagedItems = [];

    /* create a promise via the wrapper */
    var roomPromise = scanMotionsPromiseWrapper(searchParams);

    /* Wait for all Promises to be finished */
    Promise.all([roomPromise])
        .then(resp => {

            if(resp[0].LastEvaluatedKey) {
                pagedItems = pagedItems.concat(resp[0].Items)
                getMotionsForSensor(sensorId, callback, resp[0].LastEvaluatedKey, pagedItems);

            } else {
                pagedItems = pagedItems.concat(resp[0].Items)
                callback(pagedItems);
            }



        }).catch(err => {
        console.log(err.message);
        callback(err.message);
    });
}



/**
 * get all motions for a whole room from all motion sensors attached to that room
 * @param roomId
 * @param callback
 */
function getMotionsForRoom(roomId, callback) {
    var sensorPromise = sensorsPromiseWrapper(roomId);

    /* Wait for all sensors to be collected */
    Promise.all([sensorPromise])
        .then(resp => {


            /* resp[0] now contains all sensors attached to the room */
            var allSensors = resp[0].Items;
            var allProms = [];


            for(var i=0; i<allSensors.length; i++) {
                let promise = motionsPromiseWrapper(allSensors[i].sensorId);
                allProms.push(promise);
            }

            Promise.all(allProms)
                .then(resp => {
                    /* nested data structure */



                    callback(flatten(resp));

                }).catch(err => {
                console.log(err.message);
            });

        }).catch(err => {
        console.log(err.message);
    })

}

/**
 * helper function to create a flattened list out of a nested one
 * @param arr
 */
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}


function sensorsPromiseWrapper(roomId) {
    return new Promise(function(resolve, reject) {
        sensorsServices.getSensorsForRoom(roomId, resolve);
    });
}


function motionsPromiseWrapper(sensorId) {
    return new Promise(function(resolve, reject) {
        getMotionsForSensor(sensorId, resolve, undefined);
    });
}


function getQueryForGetMotionsForSensor(sensorId, lastEvaluatedKey) {
    sensorId = sensorId.trim()

    /* calculate the timestamp from when db entries will be queried */
    var timeLimit = Date.now() - (1000*motionTimeFrameSizeSec);


    /* motions database query parameters to detect relevant events */
    var searchparams = {
        TableName: motionsTableName,
        ProjectionExpression: "sensorId, creationTimestamp, motionDetected",
        FilterExpression: "creationTimestamp > :timestmp and sensorId = :sensorId",
        ExpressionAttributeValues: {
            ":timestmp": timeLimit,
            ":sensorId": sensorId
        }
    };

    if(lastEvaluatedKey) {
        searchparams.ExclusiveStartKey = lastEvaluatedKey;
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

