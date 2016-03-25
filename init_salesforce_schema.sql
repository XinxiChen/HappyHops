DROP TABLE IF EXISTS salesforce.contact;
DROP TABLE IF EXISTS salesforce.interaction__c;
DROP TABLE IF EXISTS salesforce.campaign;
DROP TABLE IF EXISTS salesforce.bartender;
DROP TABLE IF EXISTS salesforce.product2;
DROP TABLE IF EXISTS salesforce.contact;
DROP TABLE IF EXISTS salesforce.store__c;

DROP SCHEMA IF EXISTS salesforce;

CREATE SCHEMA IF NOT EXISTS salesforce;



CREATE TABLE IF NOT EXISTS salesforce.contact (
    id              BIGSERIAL,
    firstName       TEXT,
    lastName        TEXT,
    email           TEXT,
    mobilePhone     TEXT,
    leadsource      TEXT,
    accountid       TEXT,
    pictureURL__c   TEXT,
    preference__c   TEXT,
    size__c         TEXT,
    loyaltyid__c    TEXT,
    password__c     TEXT,
    fbuserid__c     TEXT,
    gender__c       TEXT,
    createddate     timestamp
  );

CREATE TABLE IF NOT EXISTS salesforce.interaction__c (
    id                      BIGSERIAL,
    contact__r__loyaltyid__c   TEXT,
    campaign__c             TEXT,
    product__c              TEXT,
    type__c                 TEXT,
    name__c                 TEXT,
    picture__c              TEXT,
    points__c               double precision,
    createddate             timestamp
  );


  
/* For bars*/
/*DROP TABLE IF EXISTS salesforce.product2;*/
CREATE TABLE IF NOT EXISTS salesforce.product2 (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT,
    description     TEXT,
    image__c        TEXT,
    productpage__c  TEXT,
    publishdate__c  DATE,
    family          TEXT,
    /* customized items*/
    bar__id         BIGSERIAL,
    location        TEXT,
    location__latitude__s   TEXT,
    location__longitude__s  TEXT,
    open__hours     TEXT,
    amentities      integer[6],
    bartender__ids  integer[],
    flag            integer[6]
  );

/*DROP TABLE IF EXISTS salesforce.store__c;*/
CREATE TABLE IF NOT EXISTS salesforce.store__c (
    id                      BIGSERIAL PRIMARY KEY,
    name                    TEXT,
    location__latitude__s   TEXT,
    location__longitude__s  TEXT
  );

 /* For bartenders*/
/*DROP TABLE IF EXISTS salesforce.bartender;*/
CREATE TABLE IF NOT EXISTS salesforce.bartender (
    id              BIGSERIAL PRIMARY KEY,
    firstName       TEXT,
    lastName        TEXT,
    email           TEXT,
    mobilePhone     TEXT,
    leadsource      TEXT,
    accountid       TEXT,
    pictureURL__c   TEXT,
    preference__c   TEXT,
    size__c         TEXT,
    loyaltyid__c    TEXT,
    password__c     TEXT,
    fbuserid__c     TEXT,
    gender__c       TEXT,
    createddate     timestamp,

    /* customized items*/
    bar_id          BIGSERIAL REFERENCES salesforce.product2 (id),
    nickName        TEXT,
    barName         TEXT,
    description     TEXT
  ); 
/* For feeds*/
/*DROP TABLE IF EXISTS salesforce.campaign;*/
CREATE TABLE IF NOT EXISTS salesforce.campaign (
    id              BIGSERIAL PRIMARY KEY,
    sfId            TEXT,
    name            TEXT,
    startdate       DATE,
    enddate         DATE,
    description     TEXT,
    image__c        TEXT,
    campaignpage__c TEXT,
    publishdate__c  DATE,
    type            TEXT,
    status          TEXT,

    /* customized items*/
    deal__valid__duration TEXT,
    createdTime     timestamp,
    bartender__id   BIGSERIAL REFERENCES salesforce.bartender(id),
    barName         TEXT,
    bartenderName   TEXT,
    location        TEXT,
    location__latitude__s  TEXT,
    location__longitude__s TEXT,
    bartenderPic    TEXT
   
  );
/*
INSERT INTO salesforce.campaign (id, name, description, image__c, type, status) VALUES
    (1, '10% of Eco Bar Happy Hour', 'Twice as much Eco!', 'http://www.stiridemontreal.com/wp-content/uploads/2016/02/Drink_Bar_Alcool_Pub_Dom.jpg', 'Offer', 'In Progress'),
    (2, '10% off EcoChocolate: Fair Trade and Organic Chocolates', '0% off chocolate that makes you feel as good as they tastes! Fair Trade and Organic chocolates assortment...', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/ritual2.jpg', 'Offer', 'In Progress'),
    (3, 'Buy 2 Get 1 Free: Dandelion Chocolate for Connoisseurs', 'Purists, Foodies and Afficionados: Buy 2 Bars Get 1 Free', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/Purists+Campaign+.png', 'Offer', 'In Progress'),
    (4, 'Buy 4 Get 6: Best of San Francisco', 'Buy 4, get 6 of of the city''s finest native chocolatiers, old and new: Tcho, Dandelion, Recchiutti, Ghirardelli, Sharffenburger, Guittard.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/Best+of+San+Francisco+Campaign.png', 'Offer', 'In Progress'),
    (5, 'Free Shipping on Truffles for Mother''s Day', 'Free Shipping for all Mother’s Day gifts places >72 hours before Sunday, May 11', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/soma1.jpg', 'Offer', 'In Progress'),
    (6, 'Free Shipping on Wine & Chocolate Pairings', 'Free Shipping on all wine, champagne, and chocolate pairings.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/dandelion2.jpg', 'Offer', 'In Progress'),
    (7, 'Nuts about nuts: 30% off mixed chocolate covered nuts', 'Are you nuts for nuts?', 'http://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/nuts.jpg', 'Offer', 'In Progress'),
    (8, '10% of Eco Bar Happy Hour', 'Twice as much Eco!', 'http://www.stiridemontreal.com/wp-content/uploads/2016/02/Drink_Bar_Alcool_Pub_Dom.jpg', 'Offer', 'In Progress');

INSERT INTO salesforce.product2 (id, name, description, image__c, family) VALUES
    (1, 'Caramelized Almonds', 'Addictive treats from the popular new boutique chocolatier in San Francisco''s Mission District.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/feve1.jpg', 'Nibs'),
    (2, 'Dandelion Assortment', 'Bring the flavor of San Francisco boutique chocolate into your home, or present as a gift to the foodie in your life.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/dandelion2.jpg', 'Nibs'),
    (3, 'Dandelion Small Batch', 'Experience the buzz around San Francisco''s newest boutique chocolatier. These beans are slow roasted whole for unparalleled flavor depth.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/dandelion1.jpg', 'Nibs'),
    (4, 'Matzo Crunch', 'A uniquely crunchy treat. So good we had to offer it all year round.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/matzo.jpg', 'Nibs'),
    (5, 'Patric IN-NIB-ITABLE', 'For the Nibs lovers in your life: a bar of 72% cacao, dark, sweet and strewn with crunchy nibs.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/patric2.jpg', 'Nibs'),
    (6, 'Patric Limited Edition', 'Salt and chocolate meet in a single bar. For sophisticated palettes.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/patric3.jpg', 'Nibs'),
    (7, 'Patric Mizzou Crunch', 'Some love smooth, some love crunch. This is a crunch! Lively on the palette.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/patric1.jpg', 'Nibs');

INSERT INTO salesforce.store__c (id, name, location__latitude__s, location__longitude__s) VALUES
    (1, 'Marquis', 37.785143, -122.403405),
    (2, 'Hilton', 37.786164, -122.410137),
    (3, 'Hyatt', 37.794157, -122.396311)
*/

/* Insert data for bars.*/
INSERT INTO salesforce.product2 (name, bartender__ids, image__c, location, location__latitude__s, location__longitude__s, open__hours, description)  VALUES
	('Cooper''s Craft & Kitchen', '{1}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar1.jpg', '169 8th Ave, New York, NY 10011', '40.7426947', '-74.0029736', '11AM-2AM', 'Hip, airy hangout with exposed-brick walls pairing craft beer with innovative bar fare.'),
	('Flight 151', '{2}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar2.jpg', '151 8th Ave #1, New York, NY 10011', '40.742112', '-74.0034047', '11AM-4AM', 'Neighborhood watering hole with aviation theme, drink specials, happy hour & pub food.'),
	('Wood and Ale''s', '{3}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar3.jpg', '234 W 14th St, New York, NY 10011', '40.7391167', '-74.0037621', '11AM-4AM', 'Low-key site for pints & pitchers with burgers, wings & nachos amid dark digs with sports on TVs.');		
-- INSERT INTO salesforce.product2 (id, name, bartender__ids, image__c, location, location__latitude__s, location__longitude__s, open__hours, description)  VALUES
--     (1, 'Cooper''s Craft & Kitchen', '{1}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar1.jpg', '169 8th Ave, New York, NY 10011', '40.7426947', '-74.0029736', '11AM-2AM', 'Hip, airy hangout with exposed-brick walls pairing craft beer with innovative bar fare.'),
--     (2, 'Flight 151', '{2}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar2.jpg', '151 8th Ave #1, New York, NY 10011', '40.742112', '-74.0034047', '11AM-4AM', 'Neighborhood watering hole with aviation theme, drink specials, happy hour & pub food.'),
--     (3, 'Wood and Ale''s', '{3}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar3.jpg', '234 W 14th St, New York, NY 10011', '40.7391167', '-74.0037621', '11AM-4AM', 'Low-key site for pints & pitchers with burgers, wings & nachos amid dark digs with sports on TVs.');     


/* Insert data for bartenders.*/
INSERT INTO salesforce.bartender (email, password__c, bar_id, nickName, pictureURL__c, description, barName) VALUES
       ('js3259@cornell.edu', '$2a$10$ee5.jveXlczkFi3ue4Z9iu/XW8VHvhTBf4U/MudBYUnVrLw2B1e8y', 1, 'Emil', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender1.jpg', 'Swede enlightening NYC with my killer Martini!', 'Cooper''s Craft & Kitchen'),
       ('kb623@cornell.edu', '$2a$10$t7jn.CrZTkG60wSJyd3rjexR6VHQ7jO/nbTkm1TgKMF/DjNOj/LIu', 2, 'Niklas', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender2.jpg', 'Swede who knows his Manhattan(s)', 'Flight 151'),
       ('xc336@cornell.edu', '$2a$10$ee5.jveXlczkFi3ue4Z9iu/XW8VHvhTBf4U/MudBYUnVrLw2B1e8y', 3, 'Xinxi', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender3.jpg', 'Try', 'Wood and Ale''s');

-- INSERT INTO salesforce.bartender (id, email, password__c, bar_id, nickName, pictureURL__c, description) VALUES
--        (1, 'js3259@cornell.edu', 'test123', 1, 'Emil', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender1.jpg', 'Swede enlightening NYC with my killer Martini!'),
--        (2, 'kb623@cornell.edu', 'test321', 2, 'Niklas', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender2.jpg', 'Swede who knows his Manhattan(s)'),
--        (3, 'xc336@cornell.edu', 'test123', 3, 'Xinxi', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender3.jpg', 'Try');
             
/* Insert data for feeds.*/
-- INSERT INTO salesforce.campaign (id, bartender__id, name, description, image__c, type, status, createdTime, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic) VALUES
--        (1, 1, 'Free Text 1', 'Free Text 2', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar1.jpg', 'Offer', 'In Progress', '2016-03-17 12:00 EDT', 'Cooper''s Craft & Kitchen', 'Emil', '169 8th Ave, New York, NY 10011', '40.7426947', '-74.0029736', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender1.jpg'),
--        (2, 2, 'Free Text 1', 'Free Text 2', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar2.jpg', 'Offer', 'In Progress', '2016-03-17 11:00 EDT', 'Flight 151', 'Niklas', '151 8th Ave #1, New York, NY 10011', '40.742112', '-74.0034047', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender2.jpg'),
--        (3, 3, 'Free Text 1', 'Free Text 2', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar3.jpg', 'Offer', 'In Progress', '2016-03-17 10:00 EDT', 'Wood and Ale''s', 'Xinxi', '234 W 14th St, New York, NY 10011', '40.7391167', '-74.0037621', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender3.jpg');
INSERT INTO salesforce.campaign (bartender__id, name, description, image__c, type, status, createdTime, barName, bartenderName, location, location__latitude__s, location__longitude__s, bartenderPic) VALUES
       (1, 'Free Text 1', 'Free Text 2', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar1.jpg', 'Offer', 'In Progress', '2016-03-17 12:00 EDT', 'Cooper''s Craft & Kitchen', 'Emil', '169 8th Ave, New York, NY 10011', '40.7426947', '-74.0029736', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender1.jpg'),
       (2, 'Free Text 1', 'Free Text 2', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar2.jpg', 'Offer', 'In Progress', '2016-03-17 11:00 EDT', 'Flight 151', 'Niklas', '151 8th Ave #1, New York, NY 10011', '40.742112', '-74.0034047', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender2.jpg'),
       (3, 'Free Text 1', 'Free Text 2', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar3.jpg', 'Offer', 'In Progress', '2016-03-17 10:00 EDT', 'Wood and Ale''s', 'Xinxi', '234 W 14th St, New York, NY 10011', '40.7391167', '-74.0037621', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender3.jpg');


