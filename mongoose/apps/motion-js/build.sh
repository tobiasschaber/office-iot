#!/bin/bash


# this script is used to build the firmware and optionally upload it to mongoose dashboard
#
# prequisites:
#
# please provide a secrets file in root project folder setting these variables:
# - MONGOOSE_OS_DASH_API_KEY

# read the secrets file containing the API key
source ../../../secrets


echo "========================================="
echo "building firmware"
echo "========================================="
sudo mos build --arch esp8266 #--local

read -p "would you like to upload the firmware to mongoose dash? ([yes]/no)" performUpload

# check if user pushed [enter] for default value
if [ -z "$performUpload" ]
        then
            performUpload="yes"
fi

if [ $performUpload == "yes" ]
    then
        echo "uploading firmware to mongoose dash"
        firmwareFileName=fw-$(date +"%Y-%m-%d-%H.%M").zip
        echo https://dash.mongoose-os.com/api/v1/firmware/$firmwareFileName
        curl -X POST -H "Authorization: apikey $MONGOOSE_OS_DASH_API_KEY" 'https://dash.mongoose-os.com/api/v1/firmware/$firmwareFileName' -d @build/fw.zip
    else
        echo "upload skipped"
fi

echo "FINISHED"