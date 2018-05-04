

variable "region" {
  default = "eu-central-1"
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