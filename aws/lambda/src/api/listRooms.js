
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
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.listRooms = async (event, context, callback) => {
    AWS.config.update({region: awsRegion});

    let body = await roomsService.getRooms();

    /* remove all private keys from external calls */
    for(let i=0; i<body.Items.length; i++) {
        body.Items[i].calendarServiceAccountPrivateKey = "hidden";
    }

    callback(null, helper.createResponse(200, JSON.stringify(body)));
}
