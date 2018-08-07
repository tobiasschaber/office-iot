
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
    callback(null, apiHelper.createResponse(200, JSON.stringify(status)));
}


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
