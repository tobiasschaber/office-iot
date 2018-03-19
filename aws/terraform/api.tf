

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



# the API lambda to create a new room
resource "aws_lambda_function" "create_room_lambda" {
  description = "create a new room"
  filename = "../lambda/api/api.zip"
  function_name = "createRoom"
  handler = "createRoom.createRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/api/api.zip"))}"
  timeout = "10"
}


# the API lambda to attach an existing sensor to a room
resource "aws_lambda_function" "attach_sensor_to_room_lambda" {
  description = "attach an existing sensor to a room"
  filename = "../lambda/api/api.zip"
  function_name = "attachSensorToRoom"
  handler = "attachSensorToRoom.attachSensorToRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/api/api.zip"))}"
  timeout = "10"
}


# the API lambda to detach a sensor from a room
resource "aws_lambda_function" "detach_sensor_from_room_lambda" {
  description = "detach a sensor from a room"
  filename = "../lambda/api/api.zip"
  function_name = "detachSensorFromRoom"
  handler = "detachSensorFromRoom.detachSensorFromRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/api/api.zip"))}"
  timeout = "10"
}


# the API lambda to list all rooms
resource "aws_lambda_function" "list_rooms_lambda" {
  description = "list all existing rooms"
  filename = "../lambda/api/api.zip"
  function_name = "listRooms"
  handler = "listRooms.listRooms"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/api/api.zip"))}"
  timeout = "10"
}


resource "aws_api_gateway_rest_api" "officeiot_api" {
  name        = "OfficeIOTAPI"
  description = "API for Office IOT services"
}


resource "aws_api_gateway_resource" "room_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.officeiot_api.root_resource_id}"
  path_part   = "room"
}


resource "aws_api_gateway_method" "room_method_any" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.room_resource.id}"
  http_method   = "ANY"
  authorization = "NONE"
}


resource "aws_api_gateway_integration" "room_post_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.room_resource.id}"
  http_method             = "${aws_api_gateway_method.room_method_any.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.create_room_lambda.invoke_arn}"
}


resource "aws_api_gateway_deployment" "room" {
  depends_on = [
    "aws_api_gateway_integration.room_post_integration"
  ]

  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  stage_name  = "prod"
}




resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.create_room_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.room.execution_arn}/*/room"
}



//output "base_url" {
//  value = "${aws_api_gateway_deployment.room.invoke_url}"
//}




