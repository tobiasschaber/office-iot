

# workaround to ensure that archive_file creation is triggered
resource "random_id" "id" {
  byte_length = 8
  keepers {
    timestamp = "${timestamp()}" # force change on every execution
  }
}


# zip the source archive
# please note that we are using random_id.id (above) to ensure that file creation is triggered on every run!
data "archive_file" "lambda_archive_file" {
  # zip -r ../build/lambda.zip .
  type = "zip"
  source_dir = "../lambda/src"
  output_path = "../lambda/build/lambda-${random_id.id.dec}.zip"

}


# role which will be used for lambda execution
resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# policy for the role which will be used for lambda execution
resource "aws_iam_role_policy_attachment" "attach_lambda_execution_role" {
  role       = "${aws_iam_role.lambda_execution_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}



# the lambda function for the occupation matcher
resource "aws_lambda_function" "occupation_matcher_lambda" {
  description = "match motion events with occupation of rooms"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "matchOccupations"
  handler = "occupationMatcher/occupationMatcher.matchOccupations"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "30"
  memory_size = "256"
}


# the API lambda to work with rooms
resource "aws_lambda_function" "create_room_lambda" {
  description = "create a new room"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "createRoom"
  handler = "api/createRoom.createRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to attach an existing sensor to a room
resource "aws_lambda_function" "attach_sensor_to_room_lambda" {
  description = "attach an existing sensor to a room"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "attachSensorToRoom"
  handler = "api/attachSensorToRoom.attachSensorToRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to detach a sensor from a room
resource "aws_lambda_function" "detach_sensor_from_room_lambda" {
  description = "detach a sensor from a room"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "detachSensorFromRoom"
  handler = "api/detachSensorFromRoom.detachSensorFromRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to list all rooms
resource "aws_lambda_function" "list_rooms_lambda" {
  description = "list all existing rooms"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "listRooms"
  handler = "api/listRooms.listRooms"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to show occupation state for all rooms
resource "aws_lambda_function" "get_current_room_occupation" {
  description = "get current occupation state for all rooms"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "getCurrentRoomOccupation"
  handler = "api/getCurrentRoomOccupation.getCurrentRoomOccupation"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to refresh the current room occupation table
resource "aws_lambda_function" "update_current_room_occupation" {
  description = "update current occupation based on new sensor data"
  filename = "${data.archive_file.lambda_archive_file.output_path}"
  function_name = "updateCurrentRoomOccupation"
  handler = "api/updateCurrentRoomOccupation.updateCurrentRoomOccupation"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs8.10"
  source_code_hash = "${data.archive_file.lambda_archive_file.output_base64sha256}"
  #source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}
