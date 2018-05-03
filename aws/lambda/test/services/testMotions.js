
const motionsServices = require('../../src/services/motions');


motionsServices.setLocalTestMode("officeiot");


/* log results to console */
var logCallback = function(msg) {
    console.log(msg);
}


//motionsServices.getMotionsForSensor("26e98cf9", logCallback);
//motionsServices.getMotionsForSensor("1234567", logCallback);
motionsServices.getMotionsForRoom("00000000-0000-0000-0000-000000000000", logCallback);
