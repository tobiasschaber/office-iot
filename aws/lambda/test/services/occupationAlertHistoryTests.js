const occupationAlertHistory = require('../../src/services/occupationAlertHistory');

const eventDateTime = new Date();
const testEvent = {
    summary: "testEventSummary",
    start: {
        dateTime: eventDateTime
    }
};

it('find a newly created event in the alert event history', function(done) {

    occupationAlertHistory.addNotification(testEvent, function(result) {
        if(!result || !result.summary) {
            done("failed: no newly created event was returned");
        } else {
            if(result.summary !== testEvent.summary) {
                done("failed: returned event has wrong summary");
            } else {
                if(result.start.dateTime !== testEvent.start.dateTime) {
                    done("failed: newly created event has wrong start date");
                } else {

                    occupationAlertHistory.getNotificationState(testEvent, function(resultState) {
                        if(!resultState || !resultState.summary) {
                            done("failed: could not find newly created event");
                        } else {
                            if(resultState.summary !== testEvent.summary) {
                                done("failed: returned summary is not as expected");
                            } else {
                                if(resultState.start.dateTime !== testEvent.start.dateTime) {
                                    done("failed: returned start time is not as expected");
                                } else {
                                    done(false);    // success
                                }
                            }
                        }
                    });
                }
            }
        }
    });
});