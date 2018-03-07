


//exports.handler = (event, context, callback) => {

    const awsRegion = 'eu-central-1';
    const motionTimeFrameSizeSec = 60*60;       /* time frame size in seconds in the past to query motion events */
    const calendarId = 'codecentric.de_3239393533353332373931@resource.calendar.google.com';
    const motionsTableName = 'motions';

    const AWS = require('aws-sdk');
    const calendarConfig = require('./config/calendarSettings');
    const CalendarAPI = require('node-google-calendar');

    AWS.config.update({region: awsRegion});

    const cal = new CalendarAPI(calendarConfig);
    const docClient = new AWS.DynamoDB.DocumentClient();

    /* create query parameters for motions and calendar entries */
    var calendarQueryParams = calculateCalendarQueryParams(calendarId);
    var searchParams = calculateMotionQueryParams();


    /**
     * the promise which reads calendar entries (events)
     */
    var calendarPromise = cal.Events.list(calendarQueryParams.calendarId, calendarQueryParams)
        .then(resp => {
            return resp;
        }).catch(err => {
        console.log(err.message);
    });





    /**
     * promise wrapper for the dynamoDB query, which uses a callback implementation
     * @param searchparams the parameters for the search
     * @returns {Promise<any>}
     */
    var scanMotions = function(searchParams) {
        return new Promise((resolve, reject) => {
            docClient.scan(searchParams, (err, data) => {
                if(err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };


    /* create a promise via the wrapper */
    var motionsPromise = scanMotions(searchParams);




    /**
     * Wait for all Promises in the list (calendarPromise and motionsPromise) to be finished.
     *
     */
    Promise.all([calendarPromise, motionsPromise])
        .then(resp => {

            matchMotionsToCalendar(resp[0], resp[1]);

        }).catch(err => {
            console.log(err.message);
    });



    /**
     * the matcher implementation which contains the main logic of correlating
     * motion events and calendar entries
     * @param calendarEntries list of calendar entries
     * @param motions list of all motions
     */
    function matchMotionsToCalendar(calendarEntries, motions) {

        for(i=0; i<calendarEntries.length; i++) {
            console.log("Entry: " + calendarEntries[i].summary + " " + calendarEntries[i].status);
        }

        for(i=0; i<motions.Items.length; i++) {
            console.log("Event: " + motions.Items[i].timestamp + " | " + motions.Items[i].motionDetected);
        }

    }


    /**
     * calculate the google calendar query parameters containing a time frame
     * of the whole current day
     * @returns {{calendarId: string, timeMin: string, timeMax: string}}
     */
    function calculateCalendarQueryParams(calendarId) {

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
     * calculate the query search params for the dynamoDB query to request
     * all events in a given time
     * @returns {{TableName: string, ProjectionExpression: string, FilterExpression: string, ExpressionAttributeNames: {"#timestamp": string}, ExpressionAttributeValues: {":timestmp": number}}}
     */
    function calculateMotionQueryParams() {

        /* calculate the timestamp from when db entries will be queried */
        var timeLimit = Date.now() - (1000*motionTimeFrameSizeSec);

        /* motions database query parameters to detect relevant events */
        var searchparams = {
            TableName: motionsTableName,
            ProjectionExpression: "id, #timestamp, motionDetected",
            FilterExpression: "#timestamp > :timestmp",
            ExpressionAttributeNames: {
                "#timestamp": "timestamp"
            },
            ExpressionAttributeValues: {
                ":timestmp": timeLimit,
            }
        };

        return searchparams;

    }