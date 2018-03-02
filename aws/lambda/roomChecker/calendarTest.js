



exports.handler = (event, context, callback) => {

     var AWS = require('aws-sdk');
     AWS.config.update({region: 'eu-central-1'});


    const CONFIG = require('./config/settings');
    const CalendarAPI = require('node-google-calendar');
    let cal = new CalendarAPI(CONFIG);

    console.log("DA BIN ICH");

    let params = {
        calendarId: 'tobias.schaber@codecentric.de',
        timeMin: '2018-03-02T00:00:00-01:00',
        timeMax: '2018-03-02T18:00:00-01:00',
    };

    cal.Events.list(params.calendarId, params)
        .then(resp => {
            console.log(resp[0].summary);
        }).catch(err => {
            console.log(err.message);
    });


    console.log("da war ich");
};






