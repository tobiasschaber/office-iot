


//exports.handler = (event, context, callback) => {

    const awsRegion = 'eu-central-1';
    const timeFrameSize = 60*60;       /* time frame size in seconds */
    const calendarId = 'codecentric.de_3239393533353332373931@resource.calendar.google.com';
    const motionsTableName = 'motions';

    const AWS = require('aws-sdk');
    const calendarConfig = require('./config/calendarSettings');
    const CalendarAPI = require('node-google-calendar');

    AWS.config.update({region: awsRegion});

    const cal = new CalendarAPI(calendarConfig);
    const docClient = new AWS.DynamoDB.DocumentClient();

    /* calculate the timestamp from when db entries will be queried */
    const timeLimit = Date.now() - (1000*timeFrameSize);


    /* calendar query parameters */
    let calendarQueryParams = {
        calendarId: calendarId,
        timeMin: '2018-03-02T00:00:00-01:00',
        timeMax: '2018-03-02T18:00:00-01:00',
    };

    /* motions database query parameters to detect relevant events */
    let searchparams = {
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
    var scanMotions = function(searchparams) {
        return new Promise((resolve, reject) => {
            docClient.scan(searchparams, (err, data) => {
                if(err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };

    /* create a promise via the wrapper */
    var motionsPromise = scanMotions(searchparams);


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

