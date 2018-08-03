
const request = require('request');


/**
 * send a message via slack incoming webhook
 * @param text
 */
exports.writeSlackNotification = (text) => {

    let body = { "text":text,"channel": "#karlsruhe","link_names": 1, "username": "Okkupations-Knecht","icon_emoji": ":bomb:" };

    if(!process.env.SLACK_WEBHOOK_URL) {
        console.log("could not send message to slack as SLACK_WEBHOOK_URL was not defined");
        
    } else {
        request({
            method: "POST",
            url: process.env.SLACK_WEBHOOK_URL,
            json: true,
            body: body
        }, function (error, response, body) {
            console.log(response);
        });

    }
}






