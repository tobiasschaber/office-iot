

const AWS = require('aws-sdk');
const notificationsTableName = 'occupationAlertHistory';
const awsRegion = 'eu-central-1';
const serviceHelper = require('../helper/serviceHelper');

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


//TODO callback ausbauen
exports.getNotificationState = (event, callback) => {
    AWS.config.update({region: awsRegion});
    getNotificationState(event, callback);

}

//TODO callback ausbauen
exports.addNotification = (event, callback) => {
    AWS.config.update({region: awsRegion});
    addNotification(event, callback);

}


/**
 * get new notification status for an event identified by eventName and eventStartTime
 * @param eventName
 * @param eventStartTime
 * @param callback
 */
async function getNotificationState(event, callback) {

    var searchParams = getQueryForGetNotificationState(event);
    var statePromise = await serviceHelper.getQueryPromise(searchParams);

    /* Wait for all promises to be finished */
    Promise.all([statePromise])
        .then(resp => {
            console.log("=============================")
            callback(event, resp[0].Items);
        }).catch(err => {
            console.log(err.message);
            callback(err.message);
    });
}


function getQueryForGetNotificationState(event) {


    /* motions database query parameters to detect relevant events */
    var searchparams = {
        TableName: notificationsTableName,
        ProjectionExpression: "eventName, eventStartTimestamp, lastNotificationSendOnDate",
        FilterExpression: "eventName = :eventName and eventStartTimestamp = :eventStartTimestamp",
        ExpressionAttributeValues: {
            ":eventName": event.summary,
            ":eventStartTimestamp": new Date(event.start.dateTime).getTime()
        }
    };
    return searchparams;
}




/**
 * add a new notification for an event identified by eventName and eventStartTime
 * @param eventName
 * @param eventStartTime
 * @param callback
 */
function addNotification(event, callback) {

    const docClient = new AWS.DynamoDB.DocumentClient();
    var insertParams = getInsertParamsForAddNotification(event);

    docClient.put(insertParams, function (err, data) {
        if (err) {
            console.error("Unable to add notification. Error JSON:", JSON.stringify(err, null, 2));
            callback(err.message);
        } else {
            callback(event, "added");
        }
    });

}


function getInsertParamsForAddNotification(event) {

    var params = {
        TableName: notificationsTableName,
        Item: {
            "eventName": event.summary,
            "eventStartTimestamp": new Date(event.start.dateTime).getTime(),
            "lastNotificationSendOnDate": new Date().getTime()
        }
    }
    return params;
}
