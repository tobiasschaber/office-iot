
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



function getAllRoomOccupationsFull(timeLimitOverride, callback) {

    var allRoomsPromiseWrapper = getAllRoomsPromiseWrapper();

    /**
     * Wait for all Promises to be finished
     */
    Promise.all([allRoomsPromiseWrapper])
        .then(resp => {
            var rooms = resp[0];

            return getMotionsForRooms(rooms, timeLimitOverride, callback);



        }).catch(err => {
        console.log(err.message);
        callback(err.message);
    });

}


function getMotionsForRooms(rooms, timeLimitOverride, callback) {

    var allMotions = {items: []};

    var roomsPromises = []


    /* iterate over all rooms */
    for(var i=0; i<rooms.Items.length; i++) {
        var currentRoom = rooms.Items[i];

        roomsPromises.push(getMotionPromiseWrapper(currentRoom.roomId, timeLimitOverride));

    }

    Promise.all(roomsPromises)
    .then(motions => {

        for(var j=0; j<motions.length; j++) {
            allMotions.items.push({"roomId" : currentRoom.roomId, "roomName" : currentRoom.roomName, "motions" : motions[j]});
        }

        callback(allMotions);

    }).catch(err => {
        console.log(err.message);
    });
}


function getAllRoomsPromiseWrapper() {
    return new Promise(function(resolve, reject) {
        roomServices.getRooms(resolve);
    });
}


function getMotionPromiseWrapper(roomId, timeLimitOverride) {
    return new Promise(function(resolve, reject) {
        motionServices.getMotionsForRoom(roomId, timeLimitOverride, resolve);
    });
}

