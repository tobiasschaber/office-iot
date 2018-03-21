

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






# the API lambda to work with rooms
resource "aws_lambda_function" "create_room_lambda" {
  description = "create a new room"
  filename = "../lambda/build/lambda.zip"
  function_name = "createRoom"
  handler = "api/createRoom.createRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to attach an existing sensor to a room
resource "aws_lambda_function" "attach_sensor_to_room_lambda" {
  description = "attach an existing sensor to a room"
  filename = "../lambda/build/lambda.zip"
  function_name = "attachSensorToRoom"
  handler = "api/attachSensorToRoom.attachSensorToRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to detach a sensor from a room
resource "aws_lambda_function" "detach_sensor_from_room_lambda" {
  description = "detach a sensor from a room"
  filename = "../lambda/build/lambda.zip"
  function_name = "detachSensorFromRoom"
  handler = "api/detachSensorFromRoom.detachSensorFromRoom"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}

# the API lambda to list all rooms
resource "aws_lambda_function" "list_rooms_lambda" {
  description = "list all existing rooms"
  filename = "../lambda/build/lambda.zip"
  function_name = "listRooms"
  handler = "api/listRooms.listRooms"
  role = "${aws_iam_role.lambda_execution_role.arn}"
  runtime = "nodejs6.10"
  source_code_hash = "${base64sha256(file("../lambda/build/lambda.zip"))}"
  timeout = "10"
}



# the API gateway for the whole office iot project
resource "aws_api_gateway_rest_api" "officeiot_api" {
  name        = "OfficeIOTAPI"
  description = "API for Office IOT services"
}





resource "aws_api_gateway_resource" "room_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.officeiot_api.root_resource_id}"
  path_part   = "room"
}

resource "aws_api_gateway_resource" "sensor_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.officeiot_api.root_resource_id}"
  path_part   = "sensorAttachment"
}





resource "aws_api_gateway_method" "room_method_post" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.room_resource.id}"
  http_method   = "POST"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_method" "room_method_get" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.room_resource.id}"
  http_method   = "GET"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_method" "sensors_method_post" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.sensor_resource.id}"
  http_method   = "POST"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_method" "sensors_method_delete" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.sensor_resource.id}"
  http_method   = "DELETE"
  authorization = "AWS_IAM"
}




resource "aws_api_gateway_integration" "room_post_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.room_resource.id}"
  http_method             = "${aws_api_gateway_method.room_method_post.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.create_room_lambda.invoke_arn}"
}

resource "aws_api_gateway_integration" "room_get_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.room_resource.id}"
  http_method             = "${aws_api_gateway_method.room_method_get.http_method}"
  integration_http_method = "POST" /* attention: always use POST for lambda invocation internally! */
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.list_rooms_lambda.invoke_arn}"
}

resource "aws_api_gateway_integration" "sensor_post_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.sensor_resource.id}"
  http_method             = "${aws_api_gateway_method.sensors_method_post.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.attach_sensor_to_room_lambda.invoke_arn}"
}

resource "aws_api_gateway_integration" "sensor_delete_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.sensor_resource.id}"
  http_method             = "${aws_api_gateway_method.sensors_method_delete.http_method}"
  integration_http_method = "POST" /* attention: always use POST for lambda invocation internally! */
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.detach_sensor_from_room_lambda.invoke_arn}"
}




resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    "aws_api_gateway_integration.room_post_integration",
    "aws_api_gateway_integration.room_get_integration",
    "aws_api_gateway_integration.sensor_post_integration",
    "aws_api_gateway_integration.sensor_delete_integration"
  ]

  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  stage_name  = "prod"
}




resource "aws_lambda_permission" "create_room_permission" {
  statement_id  = "AllowAPIGatewayInvoke1"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.create_room_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
}




resource "aws_lambda_permission" "list_rooms_permission" {
  statement_id  = "AllowAPIGatewayInvoke2"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.list_rooms_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
}

resource "aws_lambda_permission" "attach_sensor_permission" {
  statement_id  = "AllowAPIGatewayInvoke3"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.attach_sensor_to_room_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
}

resource "aws_lambda_permission" "detach_sensor_permission" {
  statement_id  = "AllowAPIGatewayInvoke4"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.detach_sensor_from_room_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
}



