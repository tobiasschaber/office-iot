
const AWS = require('aws-sdk');
const sensorService = require('../services/sensors');
const apiHelper = require('../helper/apiHelper');
const awsRegion = 'eu-central-1';

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    sensorService.setLocalTestMode(awsCredentialsProfile);
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.setSensorLastUpdateReceived = async (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    if(!event) {
        console.log("error: event not set");
    } else {
        console.log(event.sensorId)
        console.log(event.creationTimestamp)
        if(!event.sensorId || !event.creationTimestamp) {
            callback(null, apiHelper.createResponse(500, "missing request parameter sensorId or creationTimestamp"));
        } else {
            let sensorId = event.sensorId;
            let creationTimestamp = event.creationTimestamp;

            let result = await sensorService.setSensorLastUpdateReceived(sensorId, creationTimestamp);
            callback(null, apiHelper.createResponse(200, JSON.stringify(result)));
        }
    }
};