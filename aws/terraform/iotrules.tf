
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

# role which will be used to update the dynamodb motions table
resource "aws_iam_role" "elasticsearch_update_role" {
  name = "elasticsearch_table_update_role"
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


# policy for the role which will be used for updating motions table
resource "aws_iam_role_policy_attachment" "attach_motions_table_update_role" {
  role       = "${aws_iam_role.motions_table_update_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# policy for the role which will be used for updating elasticsearch
resource "aws_iam_role_policy_attachment" "elasticsearch_update_role" {
  role       = "${aws_iam_role.elasticsearch_update_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}




# iot rule to move detection events to elasticsearch and dynamodb.
# TODO not yet working with dynamodb v2
resource "aws_iot_topic_rule" "motion_detection_forwarder_rule" {
  name = "motionEventForwarder"
  description = "Rule which listens on all thing shadow updates and writes motion updates into a motion dynamodb table"
  enabled = false
  sql = "SELECT *, timestamp() AS creationTimestamp, clientToken as sensorId, state.reported.motionDetected as motionDetected FROM '$aws/things/+/shadow/update' "
  sql_version = "2016-03-23"

  # TODO HIER FEHLT EINE ACTION FÜR DYNAMODB V2 (SPLIT MESSAGE TO DIFFERENT COLUMNS) habe ich in tf noch nicht gefunden..



  elasticsearch {
    endpoint = "https://${aws_elasticsearch_domain.elasticsearch_cluster.endpoint}"
    id = "$${newuuid()}"  # escape $ sign
    index = "motions"
    role_arn = "${aws_iam_role.elasticsearch_update_role.arn}"
    type = "motion"
  }


    #role_arn = "${aws_iam_role.motions_table_update_role.arn}"
    #table_name = "motions"
}
