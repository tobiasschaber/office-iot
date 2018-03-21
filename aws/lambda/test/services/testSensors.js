
const sensorsServices = require('../../src/services/sensors');

sensorsServices.setLocalTestMode("officeiot");


var callback = function(a)  {
    console.log(a);
}

sensorsServices.getSensorsForRoom("00000000-0000-0000-0000-000000000000", callback);
sensorsServices.getRoomForSensor("26e98cf9", callback);