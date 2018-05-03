/*
 * set the HC-SR501 sensor to repeatable trigger mode.
 */

load('api_config.js');
load('api_aws.js');
load('api_gpio.js');
load('api_timer.js');

/* read configuration */
let sensorPin = Cfg.get('app.sensorPin');
let ledPin = Cfg.get('app.ledPin');
let frequencyMs = Cfg.get('app.pollFrequency');
let maxNumberOfSkips = Cfg.get('app.maxNumberOfSkips');

/* last motion state which was sent as update. stored to prevent sending masses of messages */
let lastDetectedState = 0;

/* number of messages that already have been skipped since the last published message */
let skippedMessagesCount = 0;

/* state document which is used in the thing shadow */
let state = { motionDetected: 0 };

/* set up pins */
GPIO.set_mode(sensorPin, GPIO.MODE_INPUT);
GPIO.set_mode(ledPin, GPIO.MODE_OUTPUT);

AWS.Shadow.setStateHandler(
  function(data, event, reported, desired, reported_metadata, desired_metadata) {
    if (event === AWS.Shadow.CONNECTED) {
        AWS.Shadow.
      AWS.Shadow.update(0, state);  // Report device state

    }

}, null);


Timer.set(frequencyMs, true, function() {
    print("start by timer...");
    let motion = GPIO.read(sensorPin);
    GPIO.write(ledPin, motion);

    if(lastDetectedState === motion && skippedMessagesCount < maxNumberOfSkips) {
        print("skipping as not changed");
        skippedMessagesCount = skippedMessagesCount + 1;

    } else {
        lastDetectedState = motion;
        skippedMessagesCount = 0;
        AWS.Shadow.update(0, {motionDetected: motion});

    }
}, null);