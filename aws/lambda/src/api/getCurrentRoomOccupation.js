
const AWS = require('aws-sdk');
const helper = require('./helper');
const currentOccupationService = require('../services/currentOccupation');
const roomsService = require('../services/rooms');
const awsRegion = 'eu-central-1';

/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
    currentOccupationService.setLocalTestMode(awsCredentialsProfile);
};




/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.getCurrentRoomOccupation = (event, context, callback) => {

    AWS.config.update({region: awsRegion});

    let result = {rooms: []};

    let roomsPromise = roomsPromiseWrapper();

    Promise.all([roomsPromise])
        .then(resp => {

            let allRooms = resp[0].Items;

            let occPromises = [];
            for(let i=0; i<allRooms.length; i++) {
                occPromises.push(currentOccupationPromiseWrapper(allRooms[i].roomId, allRooms[i].roomName));
            }

            Promise.all(occPromises)
                .then(resp2 => {
                    for(let j=0; j<resp2.length; j++) {

                        var roomResult = {
                            "roomId" : resp2[j].roomId,
                            "roomName" : resp2[j].roomName,
                            "status" : resp2[j].motionDetected
                        }
                        result.rooms.push(roomResult);
                    }

                    callback(null, helper.createResponse(200, JSON.stringify(result)));

                });


        });
}

function roomsPromiseWrapper() {
    return new Promise(function(resolve, reject) {
        roomsService.getRooms(resolve);
    });
}


function currentOccupationPromiseWrapper(roomId, roomName) {
    return new Promise(function(resolve, reject) {
        currentOccupationService.getCurrentRoomOccupation(roomId, roomName, resolve);
    });
}




//
//     let filterCallback = function(body) {
//         var items = body.items;
//         var result = {rooms: []};
//         var currentDate = new Date();
//
//
//         for(var i=0; i<items.length; i++) {
//             var roomStatus = "";
//
//             /* is there any motion data? */
//             if(items[i].motions.length > 0) {
//
//                 var allMotions = items[i].motions;
//
//                 /* iterate over all motions */
//                 for(var j=0; j<allMotions.length; j++) {
//
//                     var currentMotionTimestamp = new Date(allMotions[j].creationTimestamp);
//
//                     /* if timestamp is in the defined frame */
//                     if(currentMotionTimestamp > (currentDate - useTimeFrame)) {
//                         roomStatus = "free";
//
//                         /* found an occupation? -> finished */
//                         if(allMotions[j].motionDetected) {
//                             roomStatus = "occupied";
//                             break;
//                         }
//                     }
//                 }
//
//             } else {
//                 roomStatus = "no sensor data";
//             }
//
//
//             var roomResult = {
//                 "roomId" : items[i].roomId,
//                 "roomName" : items[i].roomName,
//                 "status" : roomStatus
//             }
//
//             result.rooms.push(roomResult);
//
//         }
//
//         // /* remove all private keys from external calls */
//         // for(let i=0; i<body.Items.length; i++) {
//         //     body.Items[i].calendarServiceAccountPrivateKey = "hidden";
//         // }
//
//         callback(null, helper.createResponse(200, JSON.stringify(result)));
//     };
//
//
//     occupationService.getAllRoomOccupationsWithTimeLimit(useTimeFrame, filterCallback);
// };

