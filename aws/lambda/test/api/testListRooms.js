

var listRooms = require('../../src/api/listRooms');


listRooms.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(a);
    console.log(b);
}


var event = {
    queryStringParameters: {
    }
}


listRooms.listRooms(event, null, callback);


