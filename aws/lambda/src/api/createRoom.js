
const AWS = require('aws-sdk');
const helper = require('./helper');
const roomsService = require('../services/rooms');
const awsRegion = 'eu-central-1';



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    roomsService.setLocalTestMode(awsCredentialsProfile);
}


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.createRoom = (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    /* ensure event format is correct */
    if(!event || !event.queryStringParameters) {
        callback(null, helper.createResponse(500, "event or event.queryStringParameters not set"));
        return;
    }

    /* ensure all request parameters are defined */
    if(!event.queryStringParameters.roomName ||
       !event.queryStringParameters.accountId ||
       !event.queryStringParameters.privateKey ||
       !event.queryStringParameters.calendarId) {
        callback(null, helper.createResponse(500, "missing request parameter"));
        return;
    }

    var wrapperCallback = function(body) {

        callback(null, helper.createResponse(200, JSON.stringify(body)));
    }

    roomsService.createRoom(
        event.queryStringParameters.roomName,
        event.queryStringParameters.accountId,
        event.queryStringParameters.privateKey,
        event.queryStringParameters.calendarId,
        wrapperCallback);



    /**
     * add a room to the database with the given parameters
     * @param roomName
     * @param svcAccountId
     * @param svcAccPrivateKey
     * @param calendarId
     * @returns {*}
     */
    function createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId) {



    }

}