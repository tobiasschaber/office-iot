

var createRoom = require('../api/createRoom');


createRoom.setLocalTestMode("officeiot");
var callback = function(a, b) {
    console.log(a);
    console.log(b);

}
createRoom.createRoom(null, null, callback);
