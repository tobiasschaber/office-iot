/*
 * set the HC-SR501 sensor to repeatable trigger mode.
 */

load('api_config.js');
load('api_shadow.js');
load('api_gpio.js');
load('api_timer.js');

/* read configuration */
let sensorPin = Cfg.get('app.sensorPin');
let ledPin = Cfg.get('app.ledPin');
let frequencyMs = Cfg.get('app.pollFrequency');
let maxNumberOfMotionSkips = Cfg.get('app.maxNumberOfMotionSkips');
let maxNumberOfNoMotionSkips = Cfg.get('app.maxNumberOfNoMotionSkips');

/* last motion state which was sent as update. stored to prevent sending masses of messages */
let lastDetectedState = 0;

/* number of messages that already have been skipped since the last published message */
let skippedMotionMessagesCount = 0;
let skippedNoMotionMessagesCount = 0;

/* state document which is used in the thing shadow */
let state = { motionDetected: 0 };

/* set up pins */
GPIO.set_mode(sensorPin, GPIO.MODE_INPUT);
GPIO.set_mode(ledPin, GPIO.MODE_OUTPUT);

Shadow.addHandler(
  function(event, obj) {
    if (event === 'CONNECTED') {
      Shadow.update(0, state);  // Report device state

    }

}, null);


Timer.set(frequencyMs, true, function() {
    print("start by timer...");
    let motion = GPIO.read(sensorPin);
    GPIO.write(ledPin, motion);


    let skip = false;

    /* no change detected since last detection*/
    if(lastDetectedState === motion) {

        if(motion === 0 && skippedNoMotionMessagesCount < maxNumberOfNoMotionSkips) {
            print("skipping NO MOTION as not changed ");
            skippedNoMotionMessagesCount = skippedNoMotionMessagesCount + 1;
            skip = true;
        }

        if(motion === 1 && skippedMotionMessagesCount < maxNumberOfMotionSkips) {
            print("skipping MOTION as not changed ");
            skippedMotionMessagesCount = skippedMotionMessagesCount + 1;
            skip = true;
        }
    }

    if(!skip) {
        print("pushing update");
        lastDetectedState = motion;
        skippedMotionMessagesCount = 0;
        skippedNoMotionMessagesCount = 0;
        Shadow.update(0, {motionDetected: motion});
    }



}, null);