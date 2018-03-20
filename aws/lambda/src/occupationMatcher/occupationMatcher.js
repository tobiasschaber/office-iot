
const AWS = require('aws-sdk');
const listRooms = require('../api/listRooms');



/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    listRooms.setLocalTestMode("officeiot");
}


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.matchOccupations = (event, context, callback) => {

    const awsRegion = 'eu-central-1';
    AWS.config.update({region: awsRegion});

    listRooms.listRooms(event, null, roomsCallback);


}


var roomsCallback = function(a, rooms) {
    var items = JSON.parse(rooms.body);
    console.log(items.Items[0])


    //TODO NÄCSHTE SCHRITTE: vollständige backend services implementieren für "get sensors for room" und evtl für alle anderen services auch. also
    // noch mal eine Schicht dazwischen.

}
