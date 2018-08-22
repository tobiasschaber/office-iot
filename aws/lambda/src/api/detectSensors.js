const AWS = require('aws-sdk');
const apiHelper = require('../helper/apiHelper');
const motionServices = require('../services/motions');
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    motionServices.setLocalTestMode(awsCredentialsProfile);
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.detectSensors = async (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    let detectedSensors = await motionServices.detectSensors();

    let responseBody = {};
    responseBody.sensors = detectedSensors;

    callback(null, apiHelper.createResponse(200, JSON.stringify(responseBody)));
}

