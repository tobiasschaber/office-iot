
const AWS = require('aws-sdk');
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * return all events for a given calendar
 */
exports.getEventsForCalendar = (calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, callback) => {
    AWS.config.update({region: awsRegion});
    getEventsForCalendar(calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, callback);
}


/**
 * return all events for the calendar of a given room
 * @param room
 * @param callback
 */
exports.getEventsForCalendar = (room, callback) => {
    getEventsForCalendar(
        room.calendarId,
        room.calendarServiceAccountId,
        room.calendarServiceAccountPrivateKey,
        callback);
}


/**
 * return implementation for all events for a given calendar
 * @param calendarId
 * @param calendarServiceAccountId
 * @param calendarServiceAccountPrivateKey
 * @param callback
 */
function getEventsForCalendar(calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey, callback) {

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


    /* Wait for all Promises to be finished */
    Promise.all([calendarPromise])
        .then(resp => {
            callback(resp[0]);

        }).catch(err => {
        console.log(err.message);
        callback(err.message);
    });
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
    var calendarQueryParams = {
        calendarId: calendarId,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
    };

    return calendarQueryParams;
}



/**
 * create the configuration needed to query a calendar
 * @param calendarId
 * @param calendarServiceAccountId
 * @param calendarServiceAccountPrivateKey
 * @returns {{serviceAcctId: *, timezone: string, calendarId: {primary: *}, key: *}}
 */
function getCalendarConfiguration(calendarId, calendarServiceAccountId, calendarServiceAccountPrivateKey) {
    var config = {
        'serviceAcctId' : calendarServiceAccountId,
        'timezone' : 'UTC+01:00',
        'calendarId' : {
            'primary': calendarId,
        },
        'key' : calendarServiceAccountPrivateKey
    };

    return config;
}


