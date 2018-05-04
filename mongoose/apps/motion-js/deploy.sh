#!/bin/bash

# this script is used to flash a thing device with a given firmware and configure it
#
# prequisites:
#
# please provide a secrets file in root project folder setting these variables:
# - MONGOOSE_OS_DASH_API_KEY
# - WLAN_NAME
# - WLAN_PASSWORD


# read the secrets file containing the API key
source ../../../secrets

echo "========================================="
echo "flashing and configuring sensor device"
echo "========================================="
sudo mos flash
sudo mos wifi $WLAN_NAME '$WLAN_PASSWORD'
sudo mos aws-iot-setup --aws-region eu-central-1 --aws-iot-policy mos-default




echo "========================================="
echo "checking whether the sensor is registered in mongoose dash"
echo "========================================="

# read the name from the sensor via mos config tool, remove "" and trim it (xargs)
thingName=$(sudo mos config-get | grep thing_name | cut -d: -f2 | tr -d '"' | xargs)

if [ -z "$thingName" ]
    then
        echo "ERROR: could not read thing_name from device"
        exit
fi




echo "========================================="
echo "reading api key for sensor from mongoose dash"
echo "========================================="

# get the "id" (which is the api key) by the known name of the sensor
# remove "" and trim it (xargs)
thingId=$(curl -X GET -H "Authorization: apikey $MONGOOSE_OS_DASH_API_KEY" https://dash.mongoose-os.com/api/v1/devices | jq '.[][] | select(.name=="'$thingName'") | .id' | tr -d '"' | xargs)

if [ -z "$thingId" ]
    then
        echo "ERROR: thing [$thingName] is not registered in mongoose dash"
        exit
fi


echo "========================================="
echo "preparing sensor for ota deployment via mongoose dash"
echo "========================================="

# make configuration ready for ota deployments
sudo mos config-set dash.enable=true dash.token=$thingId


#sudo mos console

echo "FINISHED"
