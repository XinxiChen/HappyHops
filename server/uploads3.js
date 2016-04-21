// Load the AWS SDK for Node.js
var db = require('./pghelper');
var AWS = require('aws-sdk');
var fs = require('fs');

// Set your region for future requests.
AWS.config.region = 'us-west-2';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 */
function updateimg(id, url) {
    console.log('updating: bartender' + id + ', img ' + url);

    db.query('update salesforce.bartender SET pictureURL__c=$1 WHERE id=$2',
            [url, parseInt(id)]);
}


function upload(req, res, next) {
  // console.log(req);
  // console.log(req.file);
  console.log("Req.body:");

  // The following is the bartender id
  console.log(Object.keys(req.body)[0]);
  var bartenderid = Object.keys(req.body)[0];
  // console.log(req.file.path);
  // Create a bucket using bound parameters and put something in it.
  // Make sure to change the bucket name from "myBucket" to something unique.
  var bodyStream = fs.createReadStream(req.file.path);

  var s3bucket = new AWS.S3({params: {Bucket: 'happyhops/bartenders'}});
  s3bucket.createBucket(function() {
    var params = {
      Key: req.file.filename,
      ACL: 'public-read',
      Body: bodyStream
    };
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("Error uploading data: ", err);
      } else {
        var return_data = {
          signed_request: data,
          url: 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/' + req.file.filename
        };

        //update the url in database
        var imgurl = 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/' + req.file.filename;
        updateimg(bartenderid, imgurl);

        console.log("Successfully uploaded data to happyhops/bartenders");
        console.log("Going to delete an existing file");
        fs.unlink(req.file.path, function(err) {
           if (err) {
               return console.error(err);
           }
           console.log("File deleted successfully!");
        });
        console.log(return_data);
        res.write(JSON.stringify(return_data));
        res.end();
      }
    });
  });

};



exports.upload = upload;
exports.updateImg = updateimg;
