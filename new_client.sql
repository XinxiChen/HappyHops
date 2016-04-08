/* Insert data for bars.*/
INSERT INTO salesforce.product2 (name, bartender__ids, image__c, location, location__latitude__s, location__longitude__s, open__hours, description)  VALUES
	-- ('Cooper''s Craft & Kitchen', '{1}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar1.jpg', '169 8th Ave, New York, NY 10011', '40.7426947', '-74.0029736', '11AM-2AM', 'Hip, airy hangout with exposed-brick walls pairing craft beer with innovative bar fare.'),
	-- ('Flight 151', '{2}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar2.jpg', '151 8th Ave #1, New York, NY 10011', '40.742112', '-74.0034047', '11AM-4AM', 'Neighborhood watering hole with aviation theme, drink specials, happy hour & pub food.'),
	-- ('Wood and Ale''s', '{3}', 'https://s3-us-west-2.amazonaws.com/happyhops/bars/bar3.jpg', '234 W 14th St, New York, NY 10011', '40.7391167', '-74.0037621', '11AM-4AM', 'Low-key site for pints & pitchers with burgers, wings & nachos amid dark digs with sports on TVs.');


/* Insert data for bartenders.*/
INSERT INTO salesforce.bartender (email, password__c, bar_id, nickName, pictureURL__c, description, barName) VALUES
       -- ('js3259@cornell.edu', '$2a$10$ee5.jveXlczkFi3ue4Z9iu/XW8VHvhTBf4U/MudBYUnVrLw2B1e8y', 1, 'Emil', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender1.jpg', 'Swede enlightening NYC with my killer Martini!', 'Cooper''s Craft & Kitchen'),
       -- ('kb623@cornell.edu', '$2a$10$t7jn.CrZTkG60wSJyd3rjexR6VHQ7jO/nbTkm1TgKMF/DjNOj/LIu', 2, 'Niklas', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender2.jpg', 'Swede who knows his Manhattan(s)', 'Flight 151'),
       -- ('xc336@cornell.edu', '$2a$10$ee5.jveXlczkFi3ue4Z9iu/XW8VHvhTBf4U/MudBYUnVrLw2B1e8y', 3, 'Xinxi', 'https://s3-us-west-2.amazonaws.com/happyhops/bartenders/bartender3.jpg', 'Try', 'Wood and Ale''s');
