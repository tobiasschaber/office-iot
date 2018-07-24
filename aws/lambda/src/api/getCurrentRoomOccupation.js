
const AWS = require('aws-sdk');
const helper = require('./helper');
const occupationService = require('../services/occupation');
const awsRegion = 'eu-central-1';
const checkedTimeFrame = 1000*60*3; /* 1 minute timeframe for check */

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    occupationService.setLocalTestMode(awsCredentialsProfile);
};


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.getCurrentRoomOccupation = (event, context, callback) => {

    var useTimeFrame = checkedTimeFrame;

    if(event && event.queryStringParameters && event.queryStringParameters.timeFrame) {
        useTimeFrame = event.queryStringParameters.timeFrame;
    }

    console.log("used search timeframe: " + useTimeFrame);

    AWS.config.update({region: awsRegion});

    let filterCallback = function(body) {
        var items = body.items;
        var result = {rooms: []};
        var currentDate = new Date();


        for(var i=0; i<items.length; i++) {
            var roomStatus = "";

            /* is there any motion data? */
            if(items[i].motions.length > 0) {

                var allMotions = items[i].motions;

                /* iterate over all motions */
                for(var j=0; j<allMotions.length; j++) {

                    var currentMotionTimestamp = new Date(allMotions[j].creationTimestamp);

                    /* if timestamp is in the defined frame */
                    if(currentMotionTimestamp > (currentDate - useTimeFrame)) {
                        roomStatus = "free";

                        /* found an occupation? -> finished */
                        if(allMotions[j].motionDetected) {
                            roomStatus = "occupied";
                            break;
                        }
                    }
                }

            } else {
                roomStatus = "no sensor data";
            }


            var roomResult = {
                "roomId" : items[i].roomId,
                "roomName" : items[i].roomName,
                "status" : roomStatus
            }

            result.rooms.push(roomResult);

        }

        // /* remove all private keys from external calls */
        // for(let i=0; i<body.Items.length; i++) {
        //     body.Items[i].calendarServiceAccountPrivateKey = "hidden";
        // }

        callback(null, helper.createResponse(200, JSON.stringify(result)));
    };


    occupationService.getAllRoomOccupationsWithTimeLimit(useTimeFrame, filterCallback);
};

