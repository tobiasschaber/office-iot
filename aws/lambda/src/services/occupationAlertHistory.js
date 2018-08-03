

const AWS = require('aws-sdk');
const notificationsTableName = 'occupationAlertHistory';
const awsRegion = 'eu-central-1';
const serviceHelper = require('../helper/serviceHelper');
const notificationTTL = (60*60*24*3*1000);  /* time to live for notifications = 3 days */

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
 * @param event
 */
async function getNotificationState(event) {

    let searchParams = getQueryForGetNotificationState(event);
    let statePromise = await serviceHelper.getQueryPromise(searchParams);

    return statePromise.Items;
}


function getQueryForGetNotificationState(event) {

    /* motions database query parameters to detect relevant events */
    return {
        TableName: notificationsTableName,
        ProjectionExpression: "eventName, eventStartTimestamp, lastNotificationSendOnDate",
        FilterExpression: "eventName = :eventName and eventStartTimestamp = :eventStartTimestamp",
        ExpressionAttributeValues: {
            ":eventName": event.summary,
            ":eventStartTimestamp": new Date(event.start.dateTime).getTime()
        }
    };
}



/**
 * add a new notification for an event identified by event
 * @param event
 */
async function addNotification(event) {

    let insertParams = getInsertParamsForAddNotification(event);
    return await serviceHelper.getPutPromise(insertParams);
}


function getInsertParamsForAddNotification(event) {

    /* set TTL to */
    let ttlDate = Math.round((new Date().getTime() + notificationTTL ) / 1000);

    return {
        TableName: notificationsTableName,
        Item: {
            "eventName": event.summary,
            "eventStartTimestamp": new Date(event.start.dateTime).getTime(),
            "lastNotificationSendOnDate": new Date().getTime(),
            "ttl": ttlDate
        }
    }
}
