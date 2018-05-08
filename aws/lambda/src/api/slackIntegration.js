

const request = require('request');



/**
 * send a message via slack incoming webhook
 * @param body
 */
exports.writeSlackNotification = (text) => {

    var body = { "text":text,"channel": "#trash-ka","link_names": 1, "username": "Okkupations-Knecht","icon_emoji": ":bomb:" };



    //TODO OBFUSCATE HOOK URL
    request({
        url: "<<your webhook url hier",
        method: "POST",
        json: true,
        body: body
    }, function (error, response, body){
        console.log(response);
    });


}






