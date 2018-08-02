
const AWS = require('aws-sdk');
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
};


/**
 * returns all events for a given calendar
 * @param calendarId the calendarId to query
 * @param calendarServiceAccountId API account id
 * @param calendarServiceAccountPrivateKey API private key
 * @return {Promise<*>}
 */
exports.getEventsForCalendar = async (calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey) => {
    AWS.config.update({region: awsRegion});
    return getEventsForCalendar(
        calendarId,
        calendarServiceAccountId,
        calendarServiceAccountPrivateKey);
};


/**
 * return all events for the calendar of a given room
 * @param room
 * @return {Promise<*>}
 */
exports.getEventsForCalendarByRoom = async (room) => {
    AWS.config.update({region: awsRegion});
    return getEventsForCalendar(
        room.calendarId,
        room.calendarServiceAccountId,
        room.calendarServiceAccountPrivateKey);
};


/**
 * return implementation for all events for a given calendar
 * @param calendarId
 * @param calendarServiceAccountId
 * @param calendarServiceAccountPrivateKey
 * @param callback
 */
async function getEventsForCalendar(calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey) {

    const calendarConfig = getCalendarConfiguration(
        calendarId,
        calendarServiceAccountId,
        calendarServiceAccountPrivateKey);


    const CalendarAPI = require('node-google-calendar');

    const cal = new CalendarAPI(calendarConfig);

    var calendarQueryParams = getQueryParamsForGetEventsForCalendar(calendarId);

    /* the promise which reads calendar entries (events) */
    var calendarPromise = cal.Events.list(calendarQueryParams.calendarId, calendarQueryParams)
        .then(resp => {
            return resp;
        }).catch(err => {
            console.log(err.message);
        });

    let resp = await calendarPromise;
    return resp;

}





/**
 * calculate the google calendar query parameters containing a time frame
 * of the whole current day
 * @returns {{calendarId: string, timeMin: string, timeMax: string}}
 */
function getQueryParamsForGetEventsForCalendar(calendarId) {

    var start = new Date();
    var end  = new Date();

    /* begin at 00:00:00 and end at 23:59:59 to get all calendar entries of the day */
    start.setHours(0, 0, 0);
    end.setHours(23, 59, 59);

    console.log("-----------------------------------");
    console.log("start: " + start.toUTCString());
    console.log("  end: " + end.toUTCString());
    console.log("-----------------------------------");

    /* calendar query parameters */
    return {
        calendarId: calendarId,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true // ensure that recurring events are shown with start date "today" and not "day of event creation"
    };
}



/**
 * create the configuration needed to query a calendar
 * @param calendarId
 * @param calendarServiceAccountId
 * @param calendarServiceAccountPrivateKey
 * @returns {{serviceAcctId: *, timezone: string, calendarId: {primary: *}, key: *}}
 */
function getCalendarConfiguration(calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey) {
    return {
        'serviceAcctId' : calendarServiceAccountId,
        'timezone' : 'UTC+01:00',
        'calendarId' : {
            'primary': calendarId,
        },
        'key' : calendarServiceAccountPrivateKey
    };
}


