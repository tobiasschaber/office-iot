


// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html


//exports.handler = (event, context, callback) => {

    var AWS = require('aws-sdk');
    AWS.config.update({region: 'eu-central-1'});
    var dynamoDB = new AWS.DynamoDB({region: 'eu-central-1', apiVersion: '2012-08-10'});

    var docClient = new AWS.DynamoDB.DocumentClient();


    /* calculate the timestamp from when db entries will be queried */
    var timeLimit = Date.now() - (1000*60*150000);


    /* db query parameters to detect relevant events */
    var params = {
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

    /* execute search query and hand over results to handler */
    docClient.scan(params, onEventDetection);


    /**
     * handler for detected events
     * @param err
     * @param data
     */
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

//};





