
const AWS = require('aws-sdk');
const roomServices   = require('../services/rooms');
const sensorServices = require('../services/sensors');
const motionsServices = require('../services/motions');
const calendarServices = require('../services/calendar');
const slackApi = require('../api/slackIntegration')



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    roomServices.setLocalTestMode("officeiot");
    sensorServices.setLocalTestMode("officeiot");
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.matchOccupations = (event, context, callback) => {

    const awsRegion = 'eu-central-1';
    AWS.config.update({region: awsRegion});

    matchOccupations(callback);
};


function matchOccupations(callback) {
    roomServices.getRooms(roomsCallback);
}

var roomsCallback = function(rooms) {

    /* iterate over all rooms */
    for(var i=0; i<rooms.Items.length; i++) {
        var currentRoom = rooms.Items[i];

        var calendarPromise = calendarPromiseWrapper(currentRoom);
        var motionPromise = motionPromiseWrapper(currentRoom.roomId);

        /* Wait for all Promises in the list (calendarPromise and motionsPromise) to be finished */
        Promise.all([calendarPromise, motionPromise])
            .then(resp => {
                matchMotionsToCalendar(resp[0], resp[1]);

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

function motionPromiseWrapper(roomId) {
    return new Promise(function(resolve, reject) {
        motionsServices.getMotionsForRoom(roomId, resolve);
    });

}


/**
 * the matcher implementation which contains the main logic of correlating
 * motion events and calendar entries
 * @param calendarEntries list of calendar entries
 * @param motions list of all motions
 */
function matchMotionsToCalendar(calendarEntries, motions) {

    /* iterate over all calendar entries */
    for(i=0; i<calendarEntries.length; i++) {
        var currentEvent = calendarEntries[i];

        /* ignore cancelled events */
        if(currentEvent.status !== 'cancelled') {
            console.log("===============================================================");
            console.log("Scanning: " + currentEvent.summary + " " + (currentEvent.recurrence? "[recurring event]":""));
            console.log("Terminstatus: " + currentEvent.status);

            /* it looks like on recurring events, the date stays the same (date of creation) and
            only the time needs to be taken into consideration */
            let currentEventStart = copyTimeIntoToday(currentEvent.start.dateTime);
            let currentEventEnd   = copyTimeIntoToday(currentEvent.end.dateTime);

            var motionsDetected = false;
            var motionsCount = 0;

            /* iterate over all motions */
            for(j=0; j<motions.length; j++) {
                var currentMotion = motions[j];

                var currentMotionTimestamp = new Date(currentMotion.creationTimestamp);

                /* if there are motions in the calendar entry's timeframe. compare 0/1 with true/false with == not === !*/
                if(currentMotion.motionDetected == true) {
                    if(currentEventStart <= currentMotionTimestamp &&
                        currentEventEnd   >= currentMotionTimestamp) {
                        motionsDetected = true;
                        ++motionsCount;
                    }
                }
            }

            handleMotionsDetected(motionsDetected, motionsCount, currentEvent, currentEventStart, currentEventEnd);
        }
    }
}


/**
 * decide what to do depending on the motion detection status
 * @param motionsDetected
 * @param motionsCount
 * @param currentEvent
 * @param currentEventStart
 * @param currentEventEnd
 */
function handleMotionsDetected(motionsDetected, motionsCount, currentEvent, currentEventStart, currentEventEnd) {

    if(motionsDetected !== true) {
        console.log("Found no motions in " + currentEvent.summary + " from " + currentEvent.creator.email);

        let now = Date.now();

        if(currentEventEnd > now) {
            if(currentEventStart < now) {
                console.log("(Event is currently running)");
            } else {
                console.log("(Event is not yet started)");
            }
        } else {
            console.log("Event is over!");
            console.log("");
            console.log("(NOBODY THERE)");
            console.log("             ");
            console.log("            °");
            console.log("           ° ");
            console.log("   >-)))°>  ");
            console.log("Event Start: " + currentEventStart);
            console.log("Event Endet: " + currentEventEnd);

            slackApi.writeSlackNotification("Event " + currentEvent.summary + " is over. Did not find any motions. Böseböseböse.");
        }



    } else {
        console.log("FOUND " + motionsCount + " motions in " + currentEvent.summary);
    }

}



/**
 * copy hours, minutes and seconds from a date to the same time today
 * @param dateTime
 */
function copyTimeIntoToday(dateTime) {

    let newDate   = new Date(dateTime);
    let targetDate = new Date();

    targetDate.setHours(newDate.getHours());
    targetDate.setMinutes(newDate.getMinutes());
    targetDate.setSeconds(newDate.getSeconds());

    return targetDate;
}