
const AWS = require('aws-sdk');
const currentOccupationService = require('../services/currentOccupation');
const apiHelper = require('../helper/apiHelper');
const awsRegion = 'eu-central-1';

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    currentOccupationService.setLocalTestMode(awsCredentialsProfile);
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.updateCurrentRoomOccupation = async (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    if(!event) {
        console.log("error: event not set");
    } else {
        if(!event.sensorId || !event.creationTimestamp) {
            console.log("error: sensorId or motionDetected or creationTimestamp not set");
        } else {
            let sensorId = event.sensorId;
            let motionDetected = event.motionDetected;
            let creationTimestamp = event.creationTimestamp;

            let result = await currentOccupationService.updateCurrentRoomOccupation(sensorId, motionDetected, creationTimestamp);
            callback(null, apiHelper.createResponse(200, JSON.stringify(result)));
        }
    }
};