
const AWS = require('aws-sdk');
const sensorsTableName = 'sensors';
const helper = require('./helper');
const awsRegion = 'eu-central-1';



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.attachSensorToRoom = (event, context, callback) => {

    /* ensure event format is correct */
    if(!event || !event.queryStringParameters) {
        callback(null, helper.createResponse(500, "event or event.queryStringParameters not set"));
        return;
    }

    /* ensure all request parameters are defined */
    if(!event.queryStringParameters.sensorId ||
        !event.queryStringParameters.roomId ||
        !event.queryStringParameters.description) {
        callback(null, helper.createResponse(500, "missing request parameter"));
        return;
    }

    AWS.config.update({region: awsRegion});
    const docClient = new AWS.DynamoDB.DocumentClient();

    attachSensorToRoom(event.queryStringParameters.sensorId,
                       event.queryStringParameters.roomId,
                       event.queryStringParameters.description);


    /**
     * attach a sensor to a room
     * @param sensorId
     * @param roomId
     * @param description
     */
    function attachSensorToRoom(sensorId, roomId, description) {

        var params = {
            TableName: sensorsTableName,
            Item: {
                "sensorId": sensorId,
                "attachedInRoom": roomId,
                "description": description
            }
        };

        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to attach sensor to room. Error JSON:", JSON.stringify(err, null, 2));
                callback(null, helper.createResponse(500, "error: " + JSON.stringify((err, null, 2))));
            } else {
                console.log("Sensor attached: ", JSON.stringify(data, null, 2));
                callback(null, helper.createResponse(200, "sensor attached."));

            }
        });

    }

}