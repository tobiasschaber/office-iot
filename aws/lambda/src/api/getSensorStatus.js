
const AWS = require('aws-sdk');
const apiHelper = require('../helper/apiHelper');
const sensorService = require('../services/sensors');
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    sensorService.setLocalTestMode(awsCredentialsProfile);
};


exports.getSensorStatus = async (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    let status = await sensorService.getSensorStatus();

    let responseBody = {};
    responseBody.sensors = status;

    callback(null, apiHelper.createResponse(200, JSON.stringify(responseBody)));
}

