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

function post(bartenderid, url, text) {
    console.log('Posting: bartender' + bartenderid + ', img ' + url);

    console.log('Create a new post: ' + JSON.stringify(user));
    var barinfo = [];
    var userinfo = [];
    var user;
    db.query(
      'SELECT id, nickname, bar_id, barname, firstName, lastName, email,       mobilePhone, pictureURL__c as pictureURL, createddate, preference__c AS preference, size__c AS size, description FROM salesforce.bartender WHERE id=$1',
    [bartenderid], true)
    .then(function(bartender) {
      userinfo = JSON.stringify(bartender);
      user = JSON.parse(userinfo);

      console.log("user info:");
      console.log(user);
      var errorCallback;
      db.query(
          'SELECT image__c, location, location__latitude__s, location__longitude__s FROM salesforce.product2 WHERE id=$1',
          [user.bar_id], true)
      .then(function (bar) {
          // user.points = activity.points;
          // user.status = activities.getStatus(activity.points);
          console.log('Bar info 1: ' + JSON.stringify(bar));

          barinfo = JSON.stringify(bar);
          var bartext = JSON.parse(barinfo);

             console.log('Bar info: ' + barinfo);
             // if (!Date.now) {
             //      Date.now = function() { return new Date().getTime(); }
             //  }

              db.query('INSERT INTO salesforce.campaign (description, bartenderName, barName, bartenderPic, bartender__id, campaignpage__c, image__c, location, location__latitude__s, location__longitude__s, createdTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                      [text, user.nickname, user.barname, user.pictureurl, user.id, url, bartext.image__c, bartext.location, bartext.location__latitude__s, bartext.location__longitude__s, new Date()], true);
      })
      .catch();
    })
    .catch();


}


function upload(req, res, next) {
  // console.log(req);
  // console.log(req.file);
  console.log("Req.body:");

  console.log(req.body);
  // The following is the bartender id
  console.log(Object.keys(req.body)[0]);
  var bartenderid = Object.keys(req.body)[0];
  // var barid = Object.keys(req.body)[1];
  // output free text
  console.log("Req.body Free Text:");
  console.log(req.body["text"]);
  var text = req.body["text"];
  // console.log(req.file.path);
  // Create a bucket using bound parameters and put something in it.
  // Make sure to change the bucket name from "myBucket" to something unique.
  var bodyStream = fs.createReadStream(req.file.path);

  var s3bucket = new AWS.S3({params: {Bucket: 'happyhops/posts'}});
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
          url: 'https://s3-us-west-2.amazonaws.com/happyhops/posts/' + req.file.filename
        };

        //update the url in database
        var imgurl = 'https://s3-us-west-2.amazonaws.com/happyhops/posts/' + req.file.filename;
        post(bartenderid, imgurl, text)
        // updateimg(bartenderid, imgurl);

        console.log("Successfully uploaded data to happyhops/posts");
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
