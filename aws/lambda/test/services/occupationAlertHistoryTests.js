const occupationAlertHistory = require('../../src/services/occupationAlertHistory');
const chai = require('chai');
const eventDateTime = new Date();
const testEvent = {
    summary: "testEventSummary",
    start: {
        dateTime: eventDateTime
    }
};


it('find a newly created event in the alert event history', async function() {

    let result = await occupationAlertHistory.addNotification(testEvent);

    var expect = chai.expect;

    expect(result).to.equals("success");

    let resultState = await occupationAlertHistory.getNotificationState(testEvent);

    expect(resultState).to.not.be.undefined;
    expect(resultState[0].eventName).to.equal(testEvent.summary);
    expect(resultState[0].eventStartTimestamp).to.equal(testEvent.start.dateTime.getTime());

});