

resource "aws_cloudwatch_event_rule" "time_based_occupation_matcher_trigger_event_rule" {
  name        = "timeBasedOccupationMatcherTrigger"
  description = "Trigger the occupation matcher lambda on a recurring interval"
  schedule_expression = "${var.occupation_matcher_polling_interval}"
}

resource "aws_cloudwatch_event_target" "occupation_matcher_lambda" {
  rule      = "${aws_cloudwatch_event_rule.time_based_occupation_matcher_trigger_event_rule.name}"
  arn       = "${aws_lambda_function.occupation_matcher_lambda.arn}"
}