

var createRoom = require('../../src/api/createRoom');


createRoom.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(b);

}


/* invocation string:
    roomName=TestRoom&accountId=testAccountId&privateKey=testPrivateKey&calendarId=testCalendarId
 */
var event = {
    queryStringParameters: {
        roomName: "TestRoom",
        accountId: " testAccountId",
        privateKey: "testPrivateKey",
        calendarId: "testCalendarId"

    }
}

createRoom.createRoom(event, null, callback);
