
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
    getAllRoomOccupations(callback);
}



function getAllRoomOccupations(callback) {

    var allRoomsPromiseWrapper = getAllRoomsPromiseWrapper();

    /**
     * Wait for all Promises to be finished
     */
    Promise.all([allRoomsPromiseWrapper])
        .then(resp => {
            var rooms = resp[0];

            return getMotionsForRooms(rooms, callback);



        }).catch(err => {
        console.log(err.message);
        callback(err.message);
    });

}


function getMotionsForRooms(rooms, callback) {

    var allMotions = {items: []};

    var roomsPromises = []


    /* iterate over all rooms */
    for(var i=0; i<rooms.Items.length; i++) {
        var currentRoom = rooms.Items[i];

        roomsPromises.push(getMotionPromiseWrapper(currentRoom.roomId));

    }

    Promise.all(roomsPromises)
    .then(motions => {

        for(var j=0; j<motions.length; j++) {
            allMotions.items.push({"roomId" : currentRoom.roomId, "motions" : motions[j]});
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


function getMotionPromiseWrapper(roomId) {
    return new Promise(function(resolve, reject) {
        motionServices.getMotionsForRoom(roomId, resolve);
    });
}

