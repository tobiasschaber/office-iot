resource "aws_dynamodb_table" "room_table" {
  hash_key = "roomId"
  name = "rooms"
  read_capacity = 5
  write_capacity = 5

  "attribute" {
    name = "roomId"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled = false
  }

}


resource "aws_dynamodb_table" "sensors_table" {
  hash_key = "sensorId"
  name = "sensors"
  read_capacity = 5
  write_capacity = 5

  "attribute" {
    name = "sensorId"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled = false
  }

}




# TODO MOTIONS TABELLE:
# name: motions
# partition key: sensorId (String)
# sort key: timestamp (number)

resource "aws_dynamodb_table" "motions_table" {
  hash_key = "sensorId"
  range_key = "timestamp"
  name ="motions"
  read_capacity = 5
  write_capacity = 5

  "attribute" {
    name = "sensorId"
    type = "S"
  }

  "attribute" {
    name = "timestamp"
    type = "N"
  }

}


resource "aws_dynamodb_table_item" "jakku_preset" {
  table_name = "${aws_dynamodb_table.room_table.name}"
  hash_key = "${aws_dynamodb_table.room_table.hash_key}"
  item = "${var.default_room}"
}

resource "aws_dynamodb_table_item" "sensor_preset" {
  table_name = "${aws_dynamodb_table.sensors_table.name}"
  hash_key = "${aws_dynamodb_table.sensors_table.hash_key}"
  item = "${var.default_sensor}"
}
