
# role which will be used to update the dynamodb motions table
resource "aws_iam_role" "motions_table_update_role" {
  name = "motions_table_update_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "iot.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# policy for the role which will be used for lambda execution
resource "aws_iam_role_policy_attachment" "attach_motions_table_update_role" {
  role       = "${aws_iam_role.motions_table_update_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}


//
//
//resource "aws_iot_topic_rule" "motion_detection_forwarder_rule" {
//  name = "motionEventForwarder"
//  description = "Rule which listens on all thing shadow updates and writes motion updates into a motion dynamodb table"
//  enabled = true
//  sql = "SELECT *, timestamp() AS timestamp, clientToken as sensorId, state.reported.motionDetected as motionDetected FROM '$aws/things/+/shadow/update' "
//  sql_version = "2016-03-23"
//
  # HIER FEHLT EINE ACTION FÜR DYNAMODB V2 (SPLIT MESSAGE TO DIFFERENT COLUMNS) habe ich in tf noch nicht gefunden..
//
//
//    role_arn = "${aws_iam_role.motions_table_update_role.arn}"
//    table_name = "motions"
//  }
//}