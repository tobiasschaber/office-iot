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
let buttonPin = 0;

/* last motion state which was sent as update. stored to prevent sending masses of messages */
let lastDetectedState = 0;

/* number of messages that already have been skipped since the last published message */
let skippedMessagesCount = 0;

/* state document which is used in the thing shadow */
let state = { motionDetected: false };

/* set up pins */
GPIO.set_mode(sensorPin, GPIO.MODE_INPUT);
GPIO.set_mode(ledPin, GPIO.MODE_OUTPUT);

AWS.Shadow.setStateHandler(
  function(data, event, reported, desired, reported_metadata, desired_metadata) {
    if (event === AWS.Shadow.CONNECTED) {
      AWS.Shadow.update(0, {reported: state});  // Report device state
    } else if (event === AWS.Shadow.UPDATE_DELTA) {
      for (let key in state) {
        if (desired[key] !== undefined) state[key] = desired[key];
      }
      AWS.Shadow.update(0, {reported: state});  // Report device state
    }
  print(JSON.stringify(reported), JSON.stringify(desired));
}, null);


GPIO.set_button_handler(buttonPin, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
  AWS.Shadow.update(0, {desired: {motionDetected: !state.motionDetected}});
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
        AWS.Shadow.update(0, {desired: {motionDetected: motion}});

    }
}, null);
