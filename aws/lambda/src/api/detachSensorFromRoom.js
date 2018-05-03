
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
};



/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.detachSensorFromRoom = (event, context, callback) => {

    /* ensure event format is correct */
    if(!event || !event.queryStringParameters) {
        callback(null, helper.createResponse(500, "event or event.queryStringParameters not set"));
        return;
    }

    /* ensure all request parameters are defined */
    if(!event.queryStringParameters.sensorId ||
        !event.queryStringParameters.roomId) {
        callback(null, helper.createResponse(500, "missing request parameter"));
        return;
    }


    AWS.config.update({region: awsRegion});
    const docClient = new AWS.DynamoDB.DocumentClient();


    detachSensorFromRoom(event.queryStringParameters.sensorId,
                         event.queryStringParameters.roomId);


    /**
     * detach a sensor from a room
     * @param sensorId
     * @param roomId
     */
    function detachSensorFromRoom(sensorId, roomId) {

        let params = {
            TableName: sensorsTableName,
            Item: {
                "sensorId": sensorId,
                "attachedInRoom": "-",
            }
        };

        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to detach sensor from room. Error JSON:", JSON.stringify(err, null, 2));
                callback(null, helper.createResponse(500, "error: " + JSON.stringify((err, null, 2))));
            } else {
                console.log("Sensor detached: ", JSON.stringify(data, null, 2));
                callback(null, helper.createResponse(200, "sensor detached"));
            }
        });

    }

};
