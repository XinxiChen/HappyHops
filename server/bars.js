var db = require('./pghelper'),
    winston = require('winston');

// function getBarName(){
//     document.write("get name is running!!")
//     return db.query('SELECT name FROM salesforce.product2');
//
// };
//

function timeSince(date) {
    if(!date) {
        return "";
    }

    var seconds = Math.floor((new Date() - date) / 1000);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (seconds < 5){
        return "just now";
    }else if (seconds < 60){
        return seconds + " seconds ago";
    }
    else if (seconds < 3600) {
        minutes = Math.floor(seconds/60)
        if(minutes > 1)
            return minutes + " minutes ago";
        else
            return "1 minute ago";
    }
    else if (seconds < 86400) {
        hours = Math.floor(seconds/3600)
        if(hours > 1)
            return hours + " hours ago";
        else
            return "1 hour ago";
    }
    //2 days and no more
    else if (seconds < 172800) {
        days = Math.floor(seconds/86400)
        if(days > 1)
            return days + " days ago";
        else
            return "1 day ago";
    }
    else{

        //return new Date(time).toLocaleDateString();
        return date.getDate().toString() + " " + months[date.getMonth()] + ", " + date.getFullYear();
    }
}

function getTime() {
      var d = new Date();
      // var x = offer-detail.getElementById("demo");
      // var m = d.getMinutes();
      // x.innerHTML =  ":123123123" + m + ":" ;
      return d;
    };

function findAll(limit) {
    //return db.query("SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign WHERE type='Offer' AND status='In Progress' ORDER BY publishDate DESC LIMIT $1", [limit]);
    return db.query('SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign ORDER BY id DESC LIMIT $1', [limit]);

};

function findById(id) {
    // Retrieve offer either by Salesforce id or Postgress id
    return db.query('SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
};

// function findById(id) {
//     // Retrieve offer either by Salesforce id or Postgress id
//     offer = db.query('SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
//     return offer;
// };

function getAll(req, res, next) {
    findAll(20)
        .then(function (offers) {
            console.log(JSON.stringify(offers));
            // update timeago
            console.log("length:" + offers.length);
            for(i = 0; i < offers.length; ++i)  {
                console.log("i:" +i+"," + JSON.stringify(offers[i].createdtime));

                offers[i].timeago = timeSince(offers[i].createdtime);
            }

            console.log("i:" +i+"," + JSON.stringify(offers));

            return res.send(JSON.stringify(offers));
        })
        .catch(next);
};

function getById(req, res, next) {
    var id = req.params.id;
    findById(id)
        .then(function (offer) {
            offer.timeago = timeSince(offer.createdtime);
            console.log(JSON.stringify(offer));
            return res.send(JSON.stringify(offer));
        })
        .catch(next);
};



/* Feed Function

function addFeed(id, text) {
    db.query("INSERT")
}
*/

exports.findAll = findAll;
exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
exports.getTime = getTime;
// exports.getBarName = getBarName
// exports.getTime = getTime
