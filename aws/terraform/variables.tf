

# time-to-live in hours for motion events in the dynamodb table
variable "iot_motions_ttl"                                {  default = "24" }

# the IP from where the ELK cluster is accessible
variable "elasticsearch_policy_open_ip"                   {  default = "0.0.0.0" }
variable "region"                                         {  default = "eu-central-1" }

# polling interval in which the occupation matcher is triggered
variable "occupation_matcher_polling_interval"            {  default = "rate(5 minutes)" }

# webhook URL for slack integration
variable "slack_webhook_url"                              {  default = "http://" }

# read capacities for dynamodb tables
variable "dynamodb_table_read_capacity_rooms"             {  default = 2 }
variable "dynamodb_table_read_capacity_sensors"           {  default = 2 }
variable "dynamodb_table_read_capacity_motions"           {  default = 7 }
variable "dynamodb_table_read_capacity_occ_alert_hist"    {  default = 2 }
variable "dynamodb_table_read_capacity_current_room_occ"  {  default = 5 }

# write capacities for dynamodb tables
variable "dynamodb_table_write_capacity_rooms"            {  default = 1 }
variable "dynamodb_table_write_capacity_sensors"          {  default = 1 }
variable "dynamodb_table_write_capacity_motions"          {  default = 2 }
variable "dynamodb_table_write_capacity_occ_alert_hist"   {  default = 2 }
variable "dynamodb_table_write_capacity_current_room_occ" {  default = 2 }




# template for creating a default example room. undefined values will be overwritten
variable "default_room" {
  default = <<ITEM
  {
    "roomId": {"N": "00000000-0000-0000-0000-000000000000"},
    "roomName": {"S": "roomName"},
    "calendarServiceAccountId": {"S": "undefined"},
    "calendarServiceAccountPrivateKey": {"S": "undefined"},
    "calendarId": {"S": "undefined"}
  }
  ITEM
}


# template for creating a default sensor which is located in the default room created above
variable "default_sensor" {
  default = <<ITEM
  {
    "sensorId": {"S": "26e98cf9"},
    "description": {"S": "Sensor auf dem Tisch im Jakku"},
    "attachedInRoom": {"S": "00000000-0000-0000-0000-000000000000"},
    "lastUpdated": {"N": "0"}
  }
  ITEM
}


# template for creating a default current occupation for jakku. undefined values will be overwritten
variable "default_current_occupation" {
  default = <<ITEM
  {
    "roomId": {"S": "00000000-0000-0000-0000-000000000000"},
    "occupationStatus": {"S": "free"},
    "lastUpdatedTimestamp": {"N": "0"}
  }
  ITEM
}


# cors template mapping in integration responses
variable "cors_integration_response_template" {
  default = <<EOF
#set($inputRoot = $input.path('$'))
EOF
}

variable "cors_options_integration_request_template" {
  default = <<EOF
#set($inputRoot = $input.path('$'))
 { statusCode: 200 }
EOF
}


variable "cors_method_response_parameters" {
  type = "map"
  default = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Origin" = true,
    "method.response.header.Access-Control-Allow-Credentials" = true,
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

variable "cors_integration_response_response_parameters" {
  type = "map"
  default = {
      "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      "method.response.header.Access-Control-Allow-Origin" = "'*'",
      "method.response.header.Access-Control-Allow-Credentials" = "'true'",
      "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
  }
}