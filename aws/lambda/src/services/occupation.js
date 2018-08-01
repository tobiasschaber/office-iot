
const AWS = require('aws-sdk');
const awsRegion = 'eu-central-1';
const roomServices = require('./rooms');
const motionServices = require('./motions');


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
};



exports.getAllRoomOccupations = (callback) => {
    AWS.config.update({region: awsRegion});
    getAllRoomOccupationsFull(undefined, callback);
}



exports.getAllRoomOccupationsWithTimeLimit = (timeLimitOverride, callback) => {
    AWS.config.update({region: awsRegion});
    getAllRoomOccupationsFull(timeLimitOverride, callback);
}



async function getAllRoomOccupationsFull(timeLimitOverride, callback) {

    var rooms = await roomServices.getRooms();


    let allMotions = await getMotionsForRooms(rooms, timeLimitOverride);
    callback(allMotions);
}


async function getMotionsForRooms(rooms, timeLimitOverride) {

    let allMotions = {items: []};

    var roomsPromises = [];


    /* iterate over all rooms */
    for(var i=0; i<rooms.Items.length; i++) {
        var currentRoom = rooms.Items[i];

        roomsPromises.push(getMotionPromiseWrapper(currentRoom.roomId, timeLimitOverride));

    }

    let motions = await Promise.all(roomsPromises);


        for(var j=0; j<motions.length; j++) {
            allMotions.items.push({"roomId" : currentRoom.roomId, "roomName" : currentRoom.roomName, "motions" : motions[j]});
        }

    return allMotions;

}



function getMotionPromiseWrapper(roomId, timeLimitOverride) {
    return new Promise(function(resolve, reject) {
        motionServices.getMotionsForRoom(roomId, timeLimitOverride, resolve);
    });
}

