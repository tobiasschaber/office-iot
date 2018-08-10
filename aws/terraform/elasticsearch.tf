//
//
//resource "aws_elasticsearch_domain" "elasticsearch_cluster" {
//
//
//  domain_name = "officeiot"
//  elasticsearch_version = "6.2"
//  cluster_config {
//    instance_type = "m4.large.elasticsearch"
//  }
//
//  advanced_options {
//    "rest.action.multi.allow_explicit_index" = "true"
//  }
//
//  ebs_options {
//    ebs_enabled = true
//    volume_size = "20"
//  }
//
//  access_policies = <<CONFIG
//  {
//    "Version": "2012-10-17",
//    "Statement": [
//      {
//        "Effect": "Allow",
//        "Principal": {
//          "AWS": "*"
//        },
//        "Action": "es:*",
//        "Resource": "arn:aws:es:eu-central-1:848011078209:domain/*",
//        "Condition": {
//          "IpAddress": {
//            "aws:SourceIp": "${var.elasticsearch_policy_open_ip}"
//          }
//        }
//      }
//    ]
//  }
//CONFIG
//
//}