
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const helper = require('./helper');
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

    /* ensure event format is correct */
    if(!event || !event.queryStringParameters) {
        callback(null, helper.createResponse(500, "event or event.queryStringParameters not set"));
        return;
    }

    /* ensure all request parameters are defined */
    if(!event.queryStringParameters.roomName ||
       !event.queryStringParameters.accountId ||
       !event.queryStringParameters.privateKey ||
       !event.queryStringParameters.calendarId) {
        callback(null, helper.createResponse(500, "missing request parameter"));
        return;
    }


    AWS.config.update({region: awsRegion});
    const docClient = new AWS.DynamoDB.DocumentClient();

    /* execute the main function */
    createRoom( event.queryStringParameters.roomName,
                event.queryStringParameters.accountId,
                event.queryStringParameters.privateKey,
                event.queryStringParameters.calendarId);



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
                callback(null, helper.createResponse(500, "error: " + JSON.stringify((err, null, 2))));
            } else {
                console.log("room created");

                callback(null, helper.createResponse(200, "room created with id: " + uuid));
            }
        });
    }

}