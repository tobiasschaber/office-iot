
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const roomsTableName = 'rooms';
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
exports.createRoom = (event, context, callback) => {

    AWS.config.update({region: awsRegion});
    const docClient = new AWS.DynamoDB.DocumentClient();

    createRoom("name des Raums", "AccountIDXXX", "PrivateKeyXXX", "calendarIDZZZ");


    /**
     * add a room to the database with the given parameters
     * @param roomName
     * @param svcAccountId
     * @param svcAccPrivateKey
     * @param calendarId
     * @returns {*}
     */
    function createRoom(roomName, svcAccountId, svcAccPrivateKey, calendarId) {
        var uuid = uuidv1();
        var params = {
            TableName: roomsTableName,
            Item: {
                "roomId": uuid,
                "roomName": roomName,
                "calendarServiceAccountId": svcAccountId,
                "calendarServiceAccountPrivateKey": svcAccPrivateKey,
                "calendarId": calendarId
            }
        };

        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to create room. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Room created: ", JSON.stringify(data, null, 2));

                var response = {
                    "statusCode": 200,
                    "headers": {
                    },
                    "body": JSON.stringify(data),
                    "isBase64Encoded": false
                };
                callback(null, response);

            }
        });
    }

}