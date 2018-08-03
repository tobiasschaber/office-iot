

var occupationMatcher = require('../../src/occupationMatcher/occupationMatcher');


occupationMatcher.setLocalTestMode("officeiot");

var callback = function(a, b) {

}


var event = {
    queryStringParameters: {
    }
}

occupationMatcher.matchOccupations(event, null, callback);
