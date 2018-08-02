


# Introduction
This project is about processing sensor data of IoT devices on Amazon Web Services.

Please visit https://blog.codecentric.de/2018/07/iot-raumbelegung-mongoose-aws/ for detailed information (german only)

The following technologies are used in the project:

- Terraform for automated setup of required AWS infrastructure
- NodeJS for AWS Lambdas and Mocha for Unit Testing
- Mongoose-OS as firmware for IoT Devices
- AngularJS for a Web Dashboard Interface
- Slack API for notifications
- Google Calendar API to read room bookings


The following AWS Resources are used in the project:

- API Gateway to provide external services
- S3 to host the AngularJS Dashboard
- DynamoDB for sensor data and configuration storage
- IoT Core to connect IoT devices
- Cloudwatch for Logging and time base triggers
- Elasticsearch Service (optional)
 


# AWS Lambdas
All AWS Lambdas used in this project are stored under

aws/lambda/src

## api directory
The "api" directory contains all lambdas which are called via the AWS API gateway - They basically are wrappers.

## services directory 
The "services" directory contains services holding the logic. API calls are redirected to these. 
Not all services are published via the API gateway.


# Running Tests
Please run tests as follows:

Go to aws/lambda/
Run mocha like this:
mocha --ui tdd --recursive test/services


# Run on AWS

Please note that without specific hardware IoT devices you won't have much fun running this project!
If you nevertheless want to run it, please use terraform. The files are located under:

aws/terraform

! Please note that you need to pay for Amazon Web Services !

## Manual steps

Currently there is a resource type missing in terraform, thus you need to adjust the IOT rule which is created.

Under "IOT Core" -> "Act" -> motionEventForwarder, you need to
    - enable the rule
    - add a new action "DynamoDB / Split message into multiple columns of a database table (DynamoDB Version 2)" with
      the following parameters:
        - Tabel name: motions
        - IAM Role: motions_table_update_role (click apply)


# Special instructions and use cases

## Use Kibana with Elasticsearch
If you want to use kibana, ensure that terraform elasticsearch files are executed. After terraform finished, ensure that
your elasticsearch cluster is up and running and perform the following steps:


go to aws/kibana
./postSetupElasticsearch.sh (you need to adjust the endpoint url at 2 places)
import the three export_* files into kibana via kibana UI



