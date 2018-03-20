

var occupationMatcher = require('../../src/occupationMatcher/occupationMatcher');


occupationMatcher.setLocalTestMode("officeiot");

var callback = function(a, b) {
    console.log(a);
    console.log(b);
}


var event = {
    queryStringParameters: {
    }
}


occupationMatcher.matchOccupations(event, null, callback);