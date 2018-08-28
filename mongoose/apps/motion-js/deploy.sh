#!/bin/bash

# this script is used to flash a thing device with a given firmware and configure it
#
# prequisites:
#
# please provide a secrets file in root project folder setting these variables:
# - MONGOOSE_OS_DASH_API_KEY
# - WLAN_NAME
# - WLAN_PASSWORD


# set the port. default = auto
export PORT="/dev/ttyUSB1"


# please notice that the default port will be used (see mos --helpfull -> "--port" parameter)

# read the secrets file containing the API key
source ../../../secrets

echo "========================================="
echo "flashing and configuring sensor device"
echo "========================================="
sudo mos flash --port $PORT
sudo mos wifi $WLAN_NAME $WLAN_PASSWORD --port $PORT
sudo mos aws-iot-setup --aws-region eu-central-1 --aws-iot-policy mos-default --port $PORT




echo "========================================="
echo "get the thing name out of the sensor"
echo "========================================="

# read the name from the sensor via mos config tool, remove "" and trim it (xargs)
thingName=$(sudo mos --port $PORT config-get | grep thing_name | cut -d: -f2 | tr -d '"' | xargs)

if [ -z "$thingName" ]
    then
        echo "ERROR: could not read thing_name from device"
        exit
fi

echo "thing name: $thingName"





echo "========================================="
echo "reading api key for sensor from mongoose dash"
echo "========================================="

# get the "id" (which is the api key) by the known name of the sensor
# remove "" and trim it (xargs)
thingId=$(curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $MONGOOSE_OS_DASH_API_KEY" https://dash.mongoose-os.com/api/v2/devices | jq '.[] | select(.name=="'$thingName'") | .id' | tr -d '"' | xargs)

echo "FOUND THING: $thingId"

if [ -z "$thingId" ]
    then
        echo "Thing [$thingName] is not registered in mongoose dash. Will register it now"

        # register on dash
        thingId=$(curl -XPOST -H "Content-Type: application/json" -H "Authorization: Bearer $MONGOOSE_OS_DASH_API_KEY" -d "{\"name\": \"$thingName\"}" https://dash.mongoose-os.com/api/v2/devices | jq '.id' | tr -d '"')
        echo "Registered with the ID $thingId"
fi


echo "========================================="
echo "reading thing token from mongoose dash"
echo "========================================="
thingToken=$(curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $MONGOOSE_OS_DASH_API_KEY" https://dash.mongoose-os.com/api/v2/devices | jq '.[] | select(.name=="'$thingName'") | .token' | tr -d '"' | xargs)

echo "THING TOKEN: $thingToken"

echo "========================================="
echo "preparing sensor for ota deployment via mongoose dash"
echo "========================================="

# make configuration ready for ota deployments
sudo mos --port $PORT config-set dash.enable=true dash.token=$thingToken


#sudo mos console

echo "FINISHED"
