



    //exports.handler = (event, context, callback) => {

    var AWS = require('aws-sdk');
    const awsRegion = 'eu-central-1';
    AWS.config.update({region: awsRegion});

    const CONFIG = require('./config/calendarSettings');
    const CalendarAPI = require('node-google-calendar');
    var dynamoDB = new AWS.DynamoDB({region: awsRegion, apiVersion: '2012-08-10'});
    var docClient = new AWS.DynamoDB.DocumentClient();

    /* calculate the timestamp from when db entries will be queried */
    var timeLimit = Date.now() - (1000*60*150000);




    let cal = new CalendarAPI(CONFIG);
    let params = {
        calendarId: 'codecentric.de_3239393533353332373931@resource.calendar.google.com',
        timeMin: '2018-03-02T00:00:00-01:00',
        timeMax: '2018-03-02T18:00:00-01:00',
    };


    var p1 = cal.Events.list(params.calendarId, params)
        .then(resp => {
            return resp;
        }).catch(err => {
        console.log(err.message);
    });



    /* db query parameters to detect relevant events */
    var searchparams = {
        TableName: 'motions',
        ProjectionExpression: "id, #timestamp, motionDetected",
        FilterExpression: "#timestamp > :timestmp",
        ExpressionAttributeNames: {
            "#timestamp": "timestamp"
        },
        ExpressionAttributeValues: {
            ":timestmp": timeLimit,
        }
    };

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



    var p2 = scanMotions(searchparams);


    /**
     * Wait for all Promises in the list (p1 and p2) to be finished.
     *
     */
    Promise.all([p1, p2])
        .then(resp => {

            matchMotionsToCalendar(resp[0], resp[1]);

        }).catch(err => {
            console.log(err.message);
    });


    /**
     *
     * @param calendarEntries list of calendar entries
     * @param motions list of all motions
     */
    function matchMotionsToCalendar(calendarEntries, motions) {

        for(i=0; i<calendarEntries.length; i++) {
            console.log("Entry: " + calendarEntries[i].summary + " " + calendarEntries[i].status);
        }


        for(i=0; i<motions.Items.length; i++) {
            console.log("Event: " + motions.Items[i].timestamp);
        }

    }





    function onEventDetection(err, data) {


        if (err) {
            console.log("Error", err);
            callback(null, err);
        } else {

            console.log("length: " + data.Items.length);

            data.Items.forEach(function(item) {
                console.log(item.timestamp);

            });

            //console.log("Success", data);
            //callback(null, data.size());
        }

    }


    // function handleEvents(events) {
    //     //console.log(events);
    //     for(i=0; i<events.length; i++) {
    //         console.log("Event: " + events[i].summary + " " + events[i].status);
    //     }
    //
    // }


