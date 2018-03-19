
const AWS = require('aws-sdk');
const sensorsTableName = 'sensors';
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
exports.detachSensorFromRoom = (event, context, callback) => {

    AWS.config.update({region: awsRegion});

    const docClient = new AWS.DynamoDB.DocumentClient();


    detachSensorFromRoom("sensorId", "roomId");


    /**
     * detach a sensor from a room
     * @param sensorId
     * @param roomId
     * @param description
     */
    function detachSensorFromRoom(sensorId, roomId) {

        var params = {
            TableName: sensorsTableName,
            Item: {
                "sensorId": sensorId,
                "attachedInRoom": "{}",
            }
        };

        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to detach room. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Sensor detached: ", JSON.stringify(data, null, 2));
            }
        });

    }

}
