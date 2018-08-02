

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



/**
 * get notifications from history
 * @param event
 */
exports.getNotificationState = async (event) => {
    AWS.config.update({region: awsRegion});
    return getNotificationState(event);

}



/**
 * add a notification to the history
 * @param event
 * @return {Promise<void>}
 */
exports.addNotification = async (event) => {
    AWS.config.update({region: awsRegion});
    return addNotification(event);

}


/**
 * get new notification status for an event identified by eventName and eventStartTime
 * @param eventName
 * @param eventStartTime
 * @param callback
 */
async function getNotificationState(event) {

    var searchParams = getQueryForGetNotificationState(event);
    var statePromise = await serviceHelper.getQueryPromise(searchParams);

    return statePromise.Items;
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
 */
async function addNotification(event) {

    var insertParams = getInsertParamsForAddNotification(event);
    var result = await serviceHelper.getPutPromise(insertParams);

    return result;
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
