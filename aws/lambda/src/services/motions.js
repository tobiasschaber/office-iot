
const AWS = require('aws-sdk');
const motionsTableName = 'motions';
const awsRegion = 'eu-central-1';
const motionTimeFrameSizeSec = 60*60*24;        /* time frame size in seconds in the past to query motion events */
const sensorsServices = require('./sensors');
const serviceHelper = require('../helper/serviceHelper');

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    sensorsServices.setLocalTestMode(awsCredentialsProfile);
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * get all motions for a sensor
 * @param sensorId the sensor to check for motions
 * @param timeLimitOverride
 * @return {Promise<*>}
 */
 exports.getMotionsForSensor = async(sensorId, timeLimitOverride) => {
    AWS.config.update({region: awsRegion});
    return getMotionsForSensor(sensorId.trim(), timeLimitOverride);
}


/**
 * get a list of all sensors sending data
 * @return {Promise<*>}
 */
exports.detectSensors = async() => {
    AWS.config.update({region: awsRegion});

    let allMotions = await detectSensors(undefined);

    let filtered = [];

    for(let i=0; i<allMotions.length; i++) {
        if(filtered.indexOf(allMotions[i].sensorId) == -1) {
            filtered.push(allMotions[i].sensorId);
        }
    }

    return filtered;
}


/**
 * get all motions for a room. will check all sensors attached to this room
 * @param roomId
 * @param timeLimitOverride
 * @return {Promise<*>}
 */
exports.getMotionsForRoom = async (roomId, timeLimitOverride) => {
    AWS.config.update({region: awsRegion});
    return getMotionsForRoom(roomId, timeLimitOverride);
}


/**
 * get all motions for a sensor
 * uses pagination if there are the results are divided into multiple pages
 * @param sensorId
 * @param timeLimitOverride
 * @param lastEvaluatedKey
 * @param pagedItems
 * @return {Promise<*>}
 */
async function getMotionsForSensor(sensorId, timeLimitOverride, lastEvaluatedKey, pagedItems) {

    let searchParams = getQueryForGetMotionsForSensor(sensorId, lastEvaluatedKey, timeLimitOverride);

    if(!pagedItems) {
        var pagedItems = [];
    }

    let resp = await serviceHelper.getQueryPromise(searchParams);

    if(resp.LastEvaluatedKey) {
        pagedItems = pagedItems.concat(resp.Items);
        return getMotionsForSensor(sensorId, timeLimitOverride, resp.LastEvaluatedKey, pagedItems);

    } else {
        pagedItems = pagedItems.concat(resp.Items);
        return pagedItems;
    }
}



/**
 * get all motions for a whole room from all motion sensors attached to that room
 * @param roomId
 * @param timeLimitOverride
 */
async function getMotionsForRoom(roomId, timeLimitOverride) {

    let resp = await sensorsServices.getSensorsForRoom(roomId);

    /* resp now contains all sensors attached to the room */
    let allSensors = resp.Items;
    let allMotions = [];


    for(let i=0; i<allSensors.length; i++) {

        let resp2 = await getMotionsForSensor(allSensors[i].sensorId, timeLimitOverride, undefined);

        allMotions = allMotions.concat(resp2);
    }

    return allMotions;
}



/**
 * get a list of all sensors sending data
 * @return {Promise<void>}
 */
async function detectSensors(lastEvaluatedKey, pagedItems) {

    let searchParams = getQueryForDetectSensors(lastEvaluatedKey);

    if(!pagedItems) {
        var pagedItems = [];
    }

    let resp = await serviceHelper.getQueryPromise(searchParams);

    if(resp.LastEvaluatedKey) {
        pagedItems = pagedItems.concat(resp.Items);
        return detectSensors(resp.LastEvaluatedKey, pagedItems);

    } else {
        pagedItems = pagedItems.concat(resp.Items);
        return pagedItems;
    }
}




/**
 * get all motions for a sensor
 * uses pagination if there are the results are divided into multiple pages
 * @param sensorId
 * @param timeLimitOverride
 * @param lastEvaluatedKey
 * @param pagedItems
 * @return {Promise<*>}
 */
async function getMotionsForSensor(sensorId, timeLimitOverride, lastEvaluatedKey, pagedItems) {

    let searchParams = getQueryForGetMotionsForSensor(sensorId, lastEvaluatedKey, timeLimitOverride);

    if(!pagedItems) {
        var pagedItems = [];
    }

    let resp = await serviceHelper.getQueryPromise(searchParams);

    if(resp.LastEvaluatedKey) {
        pagedItems = pagedItems.concat(resp.Items);
        return getMotionsForSensor(sensorId, timeLimitOverride, resp.LastEvaluatedKey, pagedItems);

    } else {
        pagedItems = pagedItems.concat(resp.Items);
        return pagedItems;
    }
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


function getQueryForGetMotionsForSensor(sensorId, lastEvaluatedKey, timeLimitOverride) {
    sensorId = sensorId.trim()
    let now = Date.now();

    /* calculate the timestamp from when db entries will be queried */
    let timeLimit = now - (1000 * motionTimeFrameSizeSec);

    console.log("hard config:" + timeLimit);
    if(timeLimitOverride) {
        // console.log("overriding time limit");
        timeLimit = now - timeLimitOverride;
    }
    console.log("using search time limit: " + timeLimit);

    console.log("override co:" + timeLimit);


    /* motions database query parameters to detect relevant events */
    let searchparams = {
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


function getQueryForDetectSensors(lastEvaluatedKey) {


    /* motions database query parameters to detect relevant events */
    let searchparams = {
        TableName: motionsTableName,
        ProjectionExpression: "sensorId"
    };

    if(lastEvaluatedKey) {
        searchparams.ExclusiveStartKey = lastEvaluatedKey;
    }

    return searchparams;
}
