
# About motion-js
motion-js is the firmware used for all motion detection sensors in the office-iot project.
It is written for mongoose-os in javascript

# Build and install firmware
In order to build the software you need to perform the following steps:

## create secrets file 
You need to create a file named "secrets" in the root folder of office-iot project with the following contents:

export MONGOOSE_OS_DASH_API_KEY=*your dash api key*

export WLAN_NAME=*wlan name for the sensor*

export WLAN_PASSWORD=*wlan password for the sensor*

## build the software
go into mongoose/apps/motion-js and execute the following file:

./build.sh

This will build the firmware and store it in a zip file (fw.zip) in the "build" directory.

You will also be asked to upload the firmware to mongoose dash.

## install the firmware on a sensor thing

go into mongoose/apps/motion-js and execute the following file:

./deploy.sh

This will flash the sensor device with the firmware stored under build/fw.zip.

It will also configure the device with WLAN credentials (from secrets file) and AWS region.

It will then prepare the device to use mongoose dashboard over-the-air (ota) deployments.

*NOTE*: The device must already be registered in mongoose-dashboard with its thing_name. If this is not already the
 case, go to dash.mongoose-os.com and register the device.
 
## check if everything works

Log into dash.mongoose-os.com and check if your new device is online after a minute.
