
const AWS = require('aws-sdk');
const roomServices   = require('../services/rooms');
const sensorServices = require('../services/sensors');
const calendarServices = require('../services/calendar');



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    roomServices.setLocalTestMode("officeiot");
    sensorServices.setLocalTestMode("officeiot");
}


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.matchOccupations = (event, context, callback) => {

    const awsRegion = 'eu-central-1';
    AWS.config.update({region: awsRegion});

    roomServices.getRooms(roomsCallback);
}


var motionsCallback = function(sensors) {

    console.log(sensors);

}

var roomsCallback = function(rooms) {

    /* iterate over all rooms */
    for(var i=0; i<rooms.Items.length; i++) {
        var currentRoom = rooms.Items[i];
        console.log("raum: " + currentRoom.roomId)

        var calendarPromise = calendarPromiseWrapper(currentRoom);
        var sensorPromise = sensorPromiseWrapper(currentRoom.roomId);

        /* Wait for all Promises in the list (calendarPromise and motionsPromise) to be finished */
        Promise.all([calendarPromise, sensorPromise])
            .then(resp => {

                callback(resp[0]);

            }).catch(err => {
            console.log(err.message);
        });
    }
}


function calendarPromiseWrapper(room) {
    return new Promise(function(resolve, reject) {
        calendarServices.getEventsForCalendar(room, resolve);
    });

}

function sensorPromiseWrapper(roomId) {
    return new Promise(function(resolve, reject) {
        sensorServices.getMotionsForRoom(roomId, resolve);
    });

}



