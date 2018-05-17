
const calendarServices = require('../../src/services/calendar');
const roomsServices = require('../../src/services/rooms');


calendarServices.setLocalTestMode("officeiot");
roomsServices.setLocalTestMode("officeiot");



/* log results to console */
var logCallback = function(msg) {
    console.log(msg);
}


/* get calendar events for a room */
var getCalendarForRoomCallback = function(room)  {
    calendarServices.getEventsForCalendar(room, logCallback);

}


/* get a test room by default id */
roomsServices.getRoomById("00000000-0000-0000-0000-000000000000", getCalendarForRoomCallback);
