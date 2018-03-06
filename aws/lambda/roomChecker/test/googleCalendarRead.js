



//exports.handler = (event, context, callback) => {

     var AWS = require('aws-sdk');
     AWS.config.update({region: 'eu-central-1'});

    const CONFIG = require('../config/calendarSettings');
    const CalendarAPI = require('node-google-calendar');

    let cal = new CalendarAPI(CONFIG);
    let params = {
        calendarId: 'codecentric.de_3239393533353332373931@resource.calendar.google.com',
        timeMin: '2018-03-02T00:00:00-01:00',
        timeMax: '2018-03-02T18:00:00-01:00',
    };



    cal.Events.list(params.calendarId, params)
        .then(resp => {
            handleEvents(resp);
        }).catch(err => {
            console.log(err.message);
    });


//};



function handleEvents(events) {
    //console.log(events);
    for(i=0; i<events.length; i++) {
        console.log("Event: " + events[i].summary + " " + events[i].status);
    }

}


