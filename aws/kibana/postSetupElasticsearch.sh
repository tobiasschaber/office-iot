

#!/bin/bash

# post setup script to setup elasticsearch

# delete the already created motion index
curl -i -X DELETE 'https://search-officeiot-mqsiqgsudydzij2tu3nhriqp2y.eu-central-1.es.amazonaws.com/motions'

# re-create the motion index
curl -i -X PUT -d '{    "mappings": {        "motion": {            "properties": {                "clientToken": {                    "type": "text"                },                "datetime": {                    "store": true,                    "type": "date"                },                "creationTimestamp": {					"copy_to": "datetime",					"type": "long"				},                "motionDetected": {					"type": "long"				},                "sensorId": {					"type": "text"				},				"state": {					"properties": {						"reported": {							"properties": {								"motionDetected": {									"type": "long"								}							}						}					}				}            }        }    }}'  'https://search-officeiot-mqsiqgsudydzij2tu3nhriqp2y.eu-central-1.es.amazonaws.com/motions' -H "Content-Type:application/json"