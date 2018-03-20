
const roomsServices= require('../../src/services/rooms');

roomsServices.setLocalTestMode("officeiot");


var callback = function(a)  {
    console.log(a);
}

roomsServices.getRooms(callback);
