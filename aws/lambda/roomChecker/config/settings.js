


/* calendar settings */
const SERVICE_ACCT_ID = 'aws-lambda@office-iot.iam.gserviceaccount.com';
const TIMEZONE = 'UTC+01:00';
const CALENDAR_ID = {
    'primary': 'tobias.schaber@codecentric.de',
};

var key = require('./office-iot-aws-lambda-private-key').private_key;

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.timezone = TIMEZONE;
module.exports.calendarId = CALENDAR_ID;
module.exports.key = key;