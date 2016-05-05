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
      // var x = bar-detail.getElementById("demo");
      // var m = d.getMinutes();
      // x.innerHTML =  ":123123123" + m + ":" ;
      return d;
    };

function findAll(limit) {
    //return db.query("SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign WHERE type='Offer' AND status='In Progress' ORDER BY publishDate DESC LIMIT $1", [limit]);
    return db.query('SELECT id, name, description, image__c, productpage__c, publishDate__c, family, bar__id, location, location__latitude__s, location__longitude__s, open__hours, amentities, bartender__ids, flag FROM salesforce.product2 ORDER BY id DESC LIMIT $1', [limit]);

};

function findById(id) {
    // Retrieve offer either by Salesforce id or Postgress id
    // return db.query('SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
    return db.query('SELECT id, name, description, image__c, productpage__c, publishDate__c, family, bar__id, location, location__latitude__s, location__longitude__s, open__hours, amentities, bartender__ids, flag FROM salesforce.product2 WHERE id=$1', [id], true);
};

// function findById(id) {
//     // Retrieve offer either by Salesforce id or Postgress id
//     offer = db.query('SELECT id, sfId, name, startDate, endDate, description, image__c AS image, campaignPage__c AS campaignPage, publishDate__c AS publishDate, deal__valid__duration, createdTime, bartender__id, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic FROM salesforce.campaign WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
//     return offer;
// };

function getAll(req, res, next) {
    findAll(20)
        .then(function (bars) {
            console.log(JSON.stringify(bars));
            // update timeago
            console.log("length:" + bars.length);
            for(i = 0; i < bars.length; ++i)  {
                console.log("i:" +i+"," + JSON.stringify(bars[i].createdtime));
                // gonna be deleted
                // bars[i].timeago = timeSince(bars[i].createdtime);
            }

            console.log("i:" +i+"," + JSON.stringify(bars));
            console.log(JSON.stringify(bars));
            return res.send(JSON.stringify(bars));
        })
        .catch(next);
};

function getById(req, res, next) {
    var id = req.params.id;
    findById(id)
        .then(function (bar) {
            // offer.timeago = timeSince(offer.createdtime);
            console.log(JSON.stringify(bar));
            return res.send(JSON.stringify(bar));
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
