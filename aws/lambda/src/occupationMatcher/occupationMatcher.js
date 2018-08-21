


const AWS = require('aws-sdk');
const roomServices   = require('../services/rooms');
const sensorServices = require('../services/sensors');
const motionsServices = require('../services/motions');
const calendarServices = require('../services/calendar');
const slackServices = require('../services/slack')
const occupationAlertHistory = require('../services/occupationAlertHistory');
const feiertage = require('feiertagejs');



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    roomServices.setLocalTestMode(awsCredentialsProfile);
    sensorServices.setLocalTestMode(awsCredentialsProfile);
    motionsServices.setLocalTestMode(awsCredentialsProfile);
    calendarServices.setLocalTestMode(awsCredentialsProfile);
    occupationAlertHistory.setLocalTestMode(awsCredentialsProfile);
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.matchOccupations = async (event, context, callback) => {

    const awsRegion = 'eu-central-1';
    AWS.config.update({region: awsRegion});

    let result = await matchOccupations();
    callback(result);
};



async function matchOccupations() {
    let rooms = await roomServices.getRooms();

    /* iterate over all rooms */
    for(let i=0; i<rooms.Items.length; i++) {
        let currentRoom = rooms.Items[i];
        let roomId = rooms.Items[i].roomId;

        /* check if the room is connected to a calendar */
        if(currentRoom.calendarServiceAccountPrivateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {

            let calendarEntries = await calendarServices.getEventsForCalendarByRoom(currentRoom);

            if (calendarEntries) {
                let motionsForRoom = await motionsServices.getMotionsForRoom(roomId, undefined);
                matchMotionsToCalendar(calendarEntries, motionsForRoom);

            } else {
                console.log("error: no calendar entries could be read for calendar: " + currentRoom.roomId + " (" + currentRoom.roomName + "). skipping matching.");
            }
        } else {
            console.log("skipping calendar " + currentRoom.roomName + " : no private key provided");
        }


    }

    return "done";
}


/**
 * the matcher implementation which contains the main logic of correlating
 * motion events and calendar entries
 * @param calendarEntries list of calendar entries
 * @param motions list of all motions
 */
async function matchMotionsToCalendar(calendarEntries, motions) {

    /* check if today is a public holiday */
    if(!feiertage.isHoliday(new Date(), 'BW')) {

        if(calendarEntries) {
            console.log(calendarEntries.length);

            /* iterate over all calendar entries */
            for(let i=0; i<calendarEntries.length; i++) {
                let currentEvent = calendarEntries[i];

                /* ignore cancelled events */
                if (currentEvent.status !== 'cancelled') {
                    console.log("===============================================================");
                    console.log("Scanning: " + currentEvent.summary + " " + (currentEvent.recurrence ? "[recurring event]" : ""));
                    console.log("Terminstatus: " + currentEvent.status);

                    /* it looks like on recurring events, the date stays the same (date of creation) and
                    only the time needs to be taken into consideration */
                    let currentEventStart = copyTimeIntoToday(currentEvent.start.dateTime);
                    let currentEventEnd = copyTimeIntoToday(currentEvent.end.dateTime);

                    let motionsDetected = false;
                    let nomotionsDetected = false;
                    let motionsCount = 0;
                    let nomotionsCount = 0;

                    /* iterate over all motions */
                    for (let j = 0; j < motions.length; j++) {
                        let currentMotion = motions[j];
                        let currentMotionTimestamp = new Date(currentMotion.creationTimestamp);

                        /* if there are motions in the calendar entry's timeframe. compare 0/1 with true/false with == not === !*/
                        /* reduce event end by 5 minutes offset */

                        if (currentEventStart <= currentMotionTimestamp &&
                            currentEventEnd >= (currentMotionTimestamp-(1000*60*5))) {
                            if (currentMotion.motionDetected == true) {
                                motionsDetected = true;
                                ++motionsCount;
                            } else {
                                nomotionsDetected = true;
                                ++nomotionsCount;
                            }
                        }
                    }

                    await handleMotionsDetected(motionsDetected, nomotionsDetected, motionsCount, currentEvent, currentEventStart, currentEventEnd);
                }
            }
        } else {
            console.log("skipping calendar as entries could not be read");
        }

    }
    else {
        console.log("Not scanning due to holiday today");
    }
}


/**
 * decide what to do depending on the motion detection status
 * @param motionsDetected true if any motions have been detected, otherwise false
 * @param nomotionsDetected true if there are no-motions events detected, otherwise false
 * @param motionsCount number of motions detected
 * @param currentEvent the event which is currently checked
 * @param currentEventStart start time of the event
 * @param currentEventEnd end time of the event
 */
async function handleMotionsDetected(motionsDetected, nomotionsDetected, motionsCount, currentEvent, currentEventStart, currentEventEnd) {

    console.log("motionsDetected: " + motionsDetected)
    console.log("nomotionsDetected: " +nomotionsDetected)

    let now = Date.now();

    if(motionsDetected !== true) {
        console.log("Found no motions in " + currentEvent.summary + " from " + currentEvent.creator.email);

        if(nomotionsDetected !== true) {

            if (currentEventEnd > now) {
                if (currentEventStart < now) {
                    console.log("There are no motions and no nomotion events detected. It seems like there was no sensor sending data!")
                } else {
                    console.log("(Event is not yet started)");
                }
            }

        } else {

            if (currentEventEnd > now) {
                if (currentEventStart < now) {
                    console.log("(Event is currently running)");
                } else {
                    console.log("(Event is not yet started)");
                }
            } else {

                let notificationState = await occupationAlertHistory.getNotificationState(currentEvent);
                await handleNotification(currentEvent, notificationState);


                console.log("Event is over!");
                console.log("");
                console.log("(NOBODY THERE)");
                console.log("             ");
                console.log("            °");
                console.log("           ° ");
                console.log("   >-)))°>  ");
                console.log("Event Start: " + currentEventStart);
                console.log("Event Endet: " + currentEventEnd);

            }
        }

    } else {
        console.log("FOUND " + motionsCount + " motions in " + currentEvent.summary);
    }

}

/**
 * handles notifications
 * @param event
 * @param reply
 */
async function handleNotification(event, reply) {

    let sendNotification = false;

    /* empty reply event means there was never send a notification for this event */
    if(reply == null || reply[0] == null) {
        sendNotification = true;

    } else {

        /* check if the last notification sent for this event was before today */
        let lastNotificationSend = new Date(reply[0].lastNotificationSendOnDate);
        let now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        if(lastNotificationSend < now) {
            sendNotification = true;
        }
        console.log(now);
        console.log(lastNotificationSend);
    }

    if(sendNotification) {
        console.log("Lege an für " + event.summary);
        await occupationAlertHistory.addNotification(event);

        let roomName = event.location;

        if(!roomName) roomName = event.organizer.displayName;

        slackServices.writeSlackNotification(
            "Liebe(r) @" + event.creator.email +
            ", hast du vielleicht im Termin \""
            +event.summary + "\" den Raum \"" +
            roomName + "\" blockiert?");

    } else {
        console.log("Für " + event.summary + " wurde bereits eine Notification eingestellt.");
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