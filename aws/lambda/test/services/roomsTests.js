const roomsServices = require('../../src/services/rooms');
const chai = require('chai');



it('should not find an unexisting room', async function() {

    let noRoom = await roomsServices.getRoomById("unexisting-room");

    var expect = chai.expect;

    expect(noRoom).to.equals("not found");

});



it('should create a new room and find it by its id and in the all rooms list', async function() {
    let calendarId = "testSvc";
    let roomName = "testRoomName";
    let calendarServiceAccountId = "testSvcAccountId";
    let calendarServiceAccountPrivateKey = "testPrivateKey";

    /* create a room */
    let newRoom = await roomsServices.createRoom(roomName, calendarServiceAccountId, calendarServiceAccountPrivateKey, calendarId);

    var expect = chai.expect;

    expect(newRoom).to.not.be.undefined;
    expect(newRoom.uuid).to.not.be.undefined;

    let reRead = await roomsServices.getRoomById(newRoom.uuid);

    console.log(reRead);

    expect(reRead.roomId).to.equal(newRoom.uuid);
    expect(reRead.calendarServiceAccountPrivateKey).to.equal(calendarServiceAccountPrivateKey);
    expect(reRead.calendarId).to.equal(calendarId);
    expect(reRead.roomName).to.equal(roomName);
    expect(reRead.calendarServiceAccountId).to.equal(calendarServiceAccountId);


    let listing = await roomsServices.getRooms();
    let listRead = listing.Items;


    let found = false;
    for(var i=0; i<listRead.length; i++) {
        if(listRead[i].roomId === newRoom.uuid) {
            found = true;
            expect(listRead[i].calendarServiceAccountPrivateKey).to.equal(calendarServiceAccountPrivateKey);
            expect(listRead[i].calendarId).to.equal(calendarId);
            expect(listRead[i].roomName).to.equal(roomName);
            expect(listRead[i].calendarServiceAccountId).to.equal(calendarServiceAccountId);        }
    }

    if(!found) {
        expect(found).to.be.true;
    }

    /* clean up */
    let deleteRoom = await roomsServices.deleteRoom(newRoom.uuid);

    expect(deleteRoom).to.equal("deleted");
});

