


//exports.handler = (event, context, callback) => {

    const awsCredentialsProfile = 'officeiot';      /* aws credentials profile name (default: default) */
    const awsRegion = 'eu-central-1';
    const motionTimeFrameSizeSec = 60*60*24;        /* time frame size in seconds in the past to query motion events */
    const calendarId = 'codecentric.de_3239393533353332373931@resource.calendar.google.com';
    const motionsTableName = 'motions';

    const AWS = require('aws-sdk');




    const docClient = new AWS.DynamoDB.DocumentClient();

    /* create query parameters for motions and calendar entries */
    var searchParams = calculateMotionQueryParams();






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

        /* iterate over all calendar entries */
        for(i=0; i<calendarEntries.length; i++) {
            var currentEvent = calendarEntries[i];

            /* ignore cancelled events */
            if(currentEvent.status !== 'cancelled') {
                console.log("===============================================================");
                console.log("Scanning: " + currentEvent.summary + " " + (currentEvent.recurrence? "[recurring event]":""));

                /* it looks like on recurring events, the date stays the same (date of creation) and
                only the time needs to be taken into consideration */
                let currentEventStart = copyTimeIntoToday(currentEvent.start.dateTime);
                let currentEventEnd   = copyTimeIntoToday(currentEvent.end.dateTime);

                var motionsDetected = false;
                var motionsCount = 0;

                /* iterate over all motions */
                for(j=0; j<motions.Items.length; j++) {
                    var currentMotion = motions.Items[j];

                    var currentMotionTimestamp = new Date(currentMotion.timestamp);

                    /* if there are motions in the calendar entry's timeframe */
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
     */
    function handleMotionsDetected(motionsDetected, motionsCount, currentEvent, currentEventStart, currentEventEnd) {


        if(motionsDetected != true) {
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
                console.log("Event Start: " + currentEventStart)
                console.log("Event Endet: " + currentEventEnd)
            }



        } else {
            console.log("FOUND " + motionsCount + " motions in " + currentEvent.summary);
        }

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



    /**
     * copy hours, minutes and seconds from a date to the same time today
     * @param dateTime
     */
    function copyTimeIntoToday(dateTime) {

        let newDate   = new Date(dateTime);
        var targetDate = new Date();

        targetDate.setHours(newDate.getHours());
        targetDate.setMinutes(newDate.getMinutes());
        targetDate.setSeconds(newDate.getSeconds());

        return targetDate;


    }