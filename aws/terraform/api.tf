



# the API gateway for the whole office iot project
resource "aws_api_gateway_rest_api" "officeiot_api" {
  name        = "OfficeIOTAPI"
  description = "API for Office IOT services"
}



# -------------------------------------------------------
# resources
# -------------------------------------------------------

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

resource "aws_api_gateway_resource" "occupation_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.officeiot_api.root_resource_id}"
  path_part   = "occupation"
}



# -------------------------------------------------------
# methods
# -------------------------------------------------------

resource "aws_api_gateway_method" "room_method_post" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.room_resource.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "room_method_get" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.room_resource.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "sensors_method_post" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.sensor_resource.id}"
  http_method   = "POST"
  authorization = "NONE"
  # authorization was AWS_IAM
}

resource "aws_api_gateway_method" "sensors_method_delete" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.sensor_resource.id}"
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "occupation_method_get" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.occupation_resource.id}"
  http_method   = "GET"
  authorization = "NONE"
}


# for CORS HTTP "OPTIONS" calls
resource "aws_api_gateway_method" "occupation_method_options" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.occupation_resource.id}"
  http_method   = "OPTIONS"
  authorization = "NONE"
}


resource "aws_api_gateway_integration" "occupation_options_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.occupation_resource.id}"
  http_method             = "${aws_api_gateway_method.occupation_method_options.http_method}"
  type                    = "MOCK"
}



# configuration for CORS
resource "aws_api_gateway_method_response" "occupation_options_200" {
  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id = "${aws_api_gateway_resource.occupation_resource.id}"
  http_method = "${aws_api_gateway_method.occupation_method_options.http_method}"
  status_code = "200"

  response_models {
    "application/json" = "Empty"
  }

  # CORS headers
  response_parameters {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Origin" = true,
    "method.response.header.Access-Control-Allow-Credentials" = true,
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}


resource "aws_api_gateway_integration_response" "occupation_options_integration_response" {
  rest_api_id   = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id   = "${aws_api_gateway_resource.occupation_resource.id}"
  http_method   = "${aws_api_gateway_method.occupation_method_options.http_method}"
  status_code   = "${aws_api_gateway_method_response.occupation_options_200.status_code}"

  # CORS response headers
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Origin" = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
  }
}


# -------------------------------------------------------
# integrations
# -------------------------------------------------------

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

resource "aws_api_gateway_integration" "occupation_get_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.officeiot_api.id}"
  resource_id             = "${aws_api_gateway_resource.occupation_resource.id}"
  http_method             = "${aws_api_gateway_method.occupation_method_get.http_method}"
  integration_http_method = "POST" /* attention: always use POST for lambda invocation internally! */
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.get_current_room_occupation.invoke_arn}"
}




resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    "aws_api_gateway_integration.room_post_integration",
    "aws_api_gateway_integration.room_get_integration",
    "aws_api_gateway_integration.sensor_post_integration",
    "aws_api_gateway_integration.sensor_delete_integration",
    "aws_api_gateway_integration.occupation_get_integration",
    "aws_api_gateway_integration.occupation_options_integration"
  ]

  rest_api_id = "${aws_api_gateway_rest_api.officeiot_api.id}"
  stage_name  = "prod"
}


# -------------------------------------------------------
# permissions
# -------------------------------------------------------

resource "aws_lambda_permission" "occupation_matcher_permission" {
  statement_id  = "AllowCloudWatchTriggerInvoke1"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.occupation_matcher_lambda.arn}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.time_based_occupation_matcher_trigger_event_rule.arn}"
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

resource "aws_lambda_permission" "get_current_room_occupation_permission" {
  statement_id  = "AllowAPIGatewayInvoke4"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.get_current_room_occupation.arn}"
  principal     = "apigateway.amazonaws.com"
}


