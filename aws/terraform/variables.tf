



# time-to-live in hours for motion events in the dynamodb table
variable "iot_motions_ttl" {
  default = "24"
}

# the IP from where the ELK cluster is accessible
variable "elasticsearch_policy_open_ip" {
  default = "109.109.204.162"
}

variable "region" {
  default = "eu-central-1"
}

# polling interval in which the occupation matcher is triggered
variable "occupation_matcher_polling_interval" {
  default = "rate(5 minutes)"
}

# webhook URL for slack integration
variable "slack_webhook_url" {
  default = "http://"

}

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
    "attachedInRoom": {"S": "00000000-0000-0000-0000-000000000000"}
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