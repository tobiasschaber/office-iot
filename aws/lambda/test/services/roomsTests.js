const roomsServices = require('../../src/services/rooms');


it('should not find an unexisting room', function(done) {

    roomsServices.getRoomById("unexisting-room", function(result) {
        if(!result) {
            done(false);    // success
        }

        else done(result);
    });
});



it('should create a new room and find it by its id', function(done) {

    /* create a room */
    roomsServices.createRoom("testRoomName", "testSvcAccountId", "testPrivateKey", "testSvc", function(result) {

        if(!result) {
            done("failed to create room");
        }

        /* try to query the new room by its id */
        roomsServices.getRoomById(result, function(resultGetRoom) {
            if(!resultGetRoom) {
                done("failed to get newly created room");
            }

            if(resultGetRoom.roomId !== result) {
                done("returned new room has an unexpected id: expected: " + result + ", was: " + resultGetRoom.roomId);
            }

            roomsServices.deleteRoom(resultGetRoom.roomId, function(resultDeleteRoom) {
                if(resultDeleteRoom) {
                    done(false);    // success
                } else {
                    done("failed to delete room");
                }
            });
        });
    });
});



//
// it('should find the above created room as part of all rooms list', function(done) {
//
//     rooms.getRooms(function(result) {
//         console.log(result);
//
//     });
//
// });
