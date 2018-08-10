
# the se bucket for the live occupation dashboard
resource "aws_s3_bucket" "occupation_dashboard_bucket" {
  bucket = "occupation-dashboard"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  cors_rule {

    allowed_methods = ["GET", "PUT", "POST"],
    allowed_origins = ["*"],
    max_age_seconds = 300000,
    allowed_headers = ["*"]

  }
}


# the se bucket for the administration UI
resource "aws_s3_bucket" "occupation_admin_ui_bucket" {
  bucket = "office-iot-admin-ui"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  cors_rule {

    allowed_methods = ["GET", "PUT", "POST"],
    allowed_origins = ["*"],
    max_age_seconds = 300000,
    allowed_headers = ["*"]

  }
}


resource "aws_s3_bucket_object" "live_occupation_dashboard_file_index_html" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "index.html"
  source = "../ui/room-status/dist/room-status/index.html"
  acl = "public-read"
  content_type = "text/html"
  etag   = "${md5(file("../ui/room-status/dist/room-status/index.html"))}"

}

resource "aws_s3_bucket_object" "live_occupation_dashboard_file_main_js" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "main.js"
  source = "../ui/room-status/dist/room-status/main.js"
  acl = "public-read"
  content_type = "application/javascript"
  etag   = "${md5(file("../ui/room-status/dist/room-status/main.js"))}"
}

resource "aws_s3_bucket_object" "live_occupation_dashboard_file_main_js_map" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "main.js.map"
  source = "../ui/room-status/dist/room-status/main.js.map"
  acl = "public-read"
  content_type = "binary/octet-stream"
  etag   = "${md5(file("../ui/room-status/dist/room-status/main.js.map"))}"
}


resource "aws_s3_bucket_object" "live_occupation_dashboard_file_polyfills_js" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "polyfills.js"
  source = "../ui/room-status/dist/room-status/polyfills.js"
  acl = "public-read"
  content_type = "application/javascript"
  etag   = "${md5(file("../ui/room-status/dist/room-status/polyfills.js"))}"
}

resource "aws_s3_bucket_object" "live_occupation_dashboard_file_polyfills_js_map" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "polyfills.js.map"
  source = "../ui/room-status/dist/room-status/polyfills.js.map"
  acl = "public-read"
  content_type = "binary/octet-stream"
  etag   = "${md5(file("../ui/room-status/dist/room-status/polyfills.js.map"))}"
}




resource "aws_s3_bucket_object" "live_occupation_dashboard_file_runtime_js" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "runtime.js"
  source = "../ui/room-status/dist/room-status/runtime.js"
  acl = "public-read"
  content_type = "application/javascript"
  etag   = "${md5(file("../ui/room-status/dist/room-status/runtime.js"))}"
}

resource "aws_s3_bucket_object" "live_occupation_dashboard_file_runtime_js_map" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "runtime.js.map"
  source = "../ui/room-status/dist/room-status/runtime.js.map"
  acl = "public-read"
  content_type = "binary/octet-stream"
  etag   = "${md5(file("../ui/room-status/dist/room-status/runtime.js.map"))}"
}




resource "aws_s3_bucket_object" "live_occupation_dashboard_file_styles_js" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "styles.js"
  source = "../ui/room-status/dist/room-status/styles.js"
  acl = "public-read"
  content_type = "application/javascript"
  etag   = "${md5(file("../ui/room-status/dist/room-status/styles.js"))}"
}

resource "aws_s3_bucket_object" "live_occupation_dashboard_file_styles_js_map" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "styles.js.map"
  source = "../ui/room-status/dist/room-status/styles.js.map"
  acl = "public-read"
  content_type = "binary/octet-stream"
  etag   = "${md5(file("../ui/room-status/dist/room-status/styles.js.map"))}"
}



resource "aws_s3_bucket_object" "live_occupation_dashboard_file_vendor_js" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "vendor.js"
  source = "../ui/room-status/dist/room-status/vendor.js"
  acl = "public-read"
  content_type = "application/javascript"
  etag   = "${md5(file("../ui/room-status/dist/room-status/vendor.js"))}"
}

resource "aws_s3_bucket_object" "live_occupation_dashboard_file_vendor_js_map" {
  bucket = "${aws_s3_bucket.occupation_dashboard_bucket.bucket}"
  key = "vendor.js.map"
  source = "../ui/room-status/dist/room-status/vendor.js.map"
  acl = "public-read"
  content_type = "binary/octet-stream"
  etag   = "${md5(file("../ui/room-status/dist/room-status/vendor.js.map"))}"
}




