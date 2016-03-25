var db = require('./pghelper'),
    winston = require('winston');

/* For Bartender Profile */
/**
 * Get user profile
 * @param req
 * @param res
 * @param next
 */
function getBartenderProfile(req, res, next) {
    var userId = req.userId,
        externalUserId = req.externalUserId;

    db.query(
        'SELECT id, nickname, bar_id, barname, firstName, lastName, email, mobilePhone, pictureURL__c as pictureURL, createddate, preference__c AS preference, size__c AS size FROM salesforce.bartender WHERE id=$1',
        [userId], true)
    .then(function (user) {
        // user.points = activity.points;
        // user.status = activities.getStatus(activity.points);
        res.send(JSON.stringify(user));
    })
    .catch(next);
}

/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 */
function updateBartenderProfile(req, res, next) {

    var user = req.body,
        userId = req.userId;

    console.log('updating: ' + JSON.stringify(user));

    db.query('update salesforce.bartender SET firstName=$1, lastName=$2, mobilePhone=$3, pictureURL__c=$4, preference__c=$5, size__c=$6 WHERE id=$7',
            [user.firstname, user.lastname, user.mobilephone, user.pictureurl, user.preference, user.size, userId])
        .then(function () {
            res.send(user);
        })
        .catch(next);
}

function post(req, res, next) {

    var user = req.body;

    console.log('Create a new post: ' + JSON.stringify(user));
    var barinfo = [];

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

            db.query('INSERT INTO salesforce.campaign (description, bartenderName, barName, bartenderPic, bartender__id, image__c, location, location__latitude__s, location__longitude__s, createdTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    [user.text, user.nickname, user.barname, user.pictureurl, user.id, bartext.image__c, bartext.location, bartext.location__latitude__s, bartext.location__longitude__s, new Date()], true)
                .then(function () {
                    res.send(barinfo);
                })
                .catch(next);
    })
    .catch(next);

};

exports.getBartenderProfile = getBartenderProfile;
exports.updateBartenderProfile = updateBartenderProfile;
exports.post = post;

