
const occupationAlertHistory = require('../../src/services/occupationAlertHistory');


occupationAlertHistory.setLocalTestMode("officeiot");

/* log results to console */
var logCallback = function(msg) {
    console.log(msg);
}

occupationAlertHistory.addNotification("Lavego", 1523434500000, logCallback);
occupationAlertHistory.getNotificationState("Lavego", 1523434500000, logCallback);
