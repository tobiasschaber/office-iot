
const AWS = require('aws-sdk');
const apiHelper = require('./apiHelper');
const sensorAttachment = require('../services/sensorAttachment');
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
};



/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.detachSensorFromRoom = async (event, context, callback) => {

    /* ensure event format is correct */
    if (!event || !event.queryStringParameters) {
        callback(null, apiHelper.createResponse(500, "event or event.queryStringParameters not set"));
        return;
    }

    /* ensure all request parameters are defined */
    if (!event.queryStringParameters.sensorId ||
        !event.queryStringParameters.roomId) {
        callback(null, apiHelper.createResponse(500, "missing request parameter"));
        return;
    }

    AWS.config.update({region: awsRegion});

    let result =  await sensorAttachment.detachSensorFromRoom(
            event.queryStringParameters.sensorId,
            event.queryStringParameters.roomId);

    callback(null, apiHelper.createResponse(200, JSON.stringify(result)));

}
