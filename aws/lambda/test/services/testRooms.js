
const roomsServices= require('../../src/services/rooms');

roomsServices.setLocalTestMode("officeiot");


var callback = function(msg)  {
    console.log(msg);
}

/* test list all rooms */
roomsServices.getRooms(callback);

/* test get room by id */
roomsServices.getRoomById("00000000-0000-0000-0000-000000000000", callback);

/* test create a room */
roomsServices.createRoom("testRaum", "testAccountId", "testPrivateKey", "testCalendarId", callback);
