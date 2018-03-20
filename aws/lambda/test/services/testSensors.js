
const sensorsServices = require('../../src/services/sensors');

sensorsServices.setLocalTestMode("officeiot");


var callback = function(a)  {
    console.log(a);
}

sensorsServices.getSensorsForRoom("1", callback);
sensorsServices.getRoomForSensor("26e98cf9", callback);