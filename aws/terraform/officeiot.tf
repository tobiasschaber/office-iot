

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



