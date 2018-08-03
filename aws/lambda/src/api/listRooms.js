
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
exports.listRooms = async (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    let rooms = await roomsService.getRooms();

    /* remove all private keys from external calls */
    for(let i=0; i<rooms.Items.length; i++) {
        rooms.Items[i].calendarServiceAccountPrivateKey = "hidden";
    }

    let responseBody = {};
    responseBody.rooms = rooms.Items;

    callback(null, apiHelper.createResponse(200, JSON.stringify(responseBody)));
}
