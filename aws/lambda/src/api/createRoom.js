
const AWS = require('aws-sdk');
const apiHelper = require('../helper/apiHelper');
const roomsService = require('../services/rooms');
const awsRegion = 'eu-central-1';



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    roomsService.setLocalTestMode(awsCredentialsProfile);
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.createRoom = async (event, context, callback) => {

    if(event.body) {
        if(!event.queryStringParameters) {
            event.queryStringParameters = [];
        }
        let requestBody = JSON.parse(event.body);

        event.queryStringParameters.roomName = requestBody.roomName;
        event.queryStringParameters.accountId = requestBody.accountId;
        event.queryStringParameters.privateKey = requestBody.privateKey;
        event.queryStringParameters.calendarId = requestBody.calendarId;
    }

    /* ensure event format is correct */
    if(!event || !event.queryStringParameters) {
        callback(null, apiHelper.createResponse(500, "event or event.queryStringParameters not set"));
        return;
    }

    /* ensure all request parameters are defined */
    if(!event.queryStringParameters.roomName ||
       !event.queryStringParameters.accountId ||
       !event.queryStringParameters.privateKey ||
       !event.queryStringParameters.calendarId) {
        callback(null, apiHelper.createResponse(500, "missing request parameter"));
        return;
    }

    AWS.config.update({region: awsRegion});

    let result = await roomsService.createRoom(
        event.queryStringParameters.roomName,
        event.queryStringParameters.accountId,
        event.queryStringParameters.privateKey,
        event.queryStringParameters.calendarId);

    callback(null, apiHelper.createResponse(200, JSON.stringify(result)));

};