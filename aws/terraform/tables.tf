
# create the DynamoDB table for rooms
resource "aws_dynamodb_table" "room_table" {
  hash_key = "roomId"
  name = "rooms"
  read_capacity = 2
  write_capacity = 1

  "attribute" {
    name = "roomId"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled = false
  }

}


# create the DynamoDB table for sensors
resource "aws_dynamodb_table" "sensors_table" {
  hash_key = "sensorId"
  name = "sensors"
  read_capacity = 2
  write_capacity = 1

  "attribute" {
    name = "sensorId"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled = false
  }

}


# create the DynamoDB table for motions
resource "aws_dynamodb_table" "motions_table" {
  hash_key = "sensorId"
  range_key = "creationTimestamp"
  name ="motions"
  read_capacity = 15
  write_capacity = 5

  "attribute" {
    name = "sensorId"
    type = "S"
  }

  "attribute" {
    name = "creationTimestamp"
    type = "N"
  }

  ttl {
    attribute_name = "ttl"
    enabled = true
  }


}


# create the DynamoDB table for already published occupation warnings
resource "aws_dynamodb_table" "occupation_alert_history_table" {
  hash_key = "eventName"
  range_key = "eventStartTimestamp"
  name ="occupationAlertHistory"
  read_capacity = 2
  write_capacity = 2

  "attribute" {
    name = "eventName"
    type = "S"
  }

  "attribute" {
    name = "eventStartTimestamp"
    type = "N"
  }
}


# create a default example value for a room named "jakku"
resource "aws_dynamodb_table_item" "jakku_preset" {
  table_name = "${aws_dynamodb_table.room_table.name}"
  hash_key = "${aws_dynamodb_table.room_table.hash_key}"
  item = "${var.default_room}"
}


# create a default example value for a motion sensor
resource "aws_dynamodb_table_item" "sensor_preset" {
  table_name = "${aws_dynamodb_table.sensors_table.name}"
  hash_key = "${aws_dynamodb_table.sensors_table.hash_key}"
  item = "${var.default_sensor}"
}
