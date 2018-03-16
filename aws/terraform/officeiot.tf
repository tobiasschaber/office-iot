

provider "aws" {
  region = "${var.region}"
  profile = "officeiot"
}


# create a master user for setup
resource "aws_iam_user" "iot_master" {
  name = "iot_master"
}

# for the beginning, assign admin rights to the iot master user
resource "aws_iam_user_policy_attachment" "iot_master_attachment" {
  user = "${aws_iam_user.iot_master.name}"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}



resource "aws_dynamodb_table" "room_table" {
  hash_key = "roomId"
  name = "rooms"
  read_capacity = 5
  write_capacity = 5

  "attribute" {
    name = "roomId"
    type = "N"
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
