
const AWS = require('aws-sdk');
const apiHelper = require('./apiHelper');
const currentOccupationService = require('../services/currentOccupation');
const roomsService = require('../services/rooms');
const awsRegion = 'eu-central-1';

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    currentOccupationService.setLocalTestMode(awsCredentialsProfile);
    roomsService.setLocalTestMode(awsCredentialsProfile);
};




/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.getCurrentRoomOccupation = async (event, context, callback) => {

    AWS.config.update({region: awsRegion});

    let result = {rooms: []};
    let rooms = await roomsService.getRooms();
    let allRooms = rooms.Items;
    let occPromises = [];

    for(let i=0; i<allRooms.length; i++) {
        occPromises.push(currentOccupationPromiseWrapper(allRooms[i].roomId, allRooms[i].roomName));
    }

    let resp2 = await Promise.all(occPromises);

    for(let j=0; j<resp2.length; j++) {

        var roomResult = {
            "roomId" : resp2[j].roomId,
            "roomName" : resp2[j].roomName,
            "status" : resp2[j].motionDetected
        }
        result.rooms.push(roomResult);
    }

    callback(null, apiHelper.createResponse(200, JSON.stringify(result)));


}


//TODO cleanup
function currentOccupationPromiseWrapper(roomId, roomName) {
    return new Promise(function(resolve, reject) {
        currentOccupationService.getCurrentRoomOccupation(roomId, roomName, resolve);
    });
}



