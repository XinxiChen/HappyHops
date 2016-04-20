// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set your region for future requests.
AWS.config.region = 'us-west-2';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  //
  // accessKeyId: "AKIAIRMB6JXHG5C3AQBQ",
  // secretAccessKey: "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"
});

function upload(req, res, next) {
  console.log(req);
  console.log(req.file);
  console.log(req.body);
  // console.log(req.file.path);
  // Create a bucket using bound parameters and put something in it.
  // Make sure to change the bucket name from "myBucket" to something unique.
  var s3bucket = new AWS.S3({params: {Bucket: 'happyhops/bartenders'}});
  s3bucket.createBucket(function() {
    var params = {Key: req.file.path, Body: 'Hello!'};
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("Error uploading data: ", err);
      } else {
        console.log("Successfully uploaded data to happyhops/bartenders");
      }
    });
  });

};



function get_signed_request(file){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                upload_file(file, response.signed_request, response.url);
            }
            else{
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}

function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("preview").src = url;
            document.getElementById("avatar_url").value = url;
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
}

exports.upload = upload;
