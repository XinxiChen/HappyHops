var multer = require('multer');

var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    http = require('http'),
    path = require('path'),
    winston = require('winston'),
    sqlinit = require('./server/sqlinit'),

    // App modules
    offers = require('./server/offers'),
    bars = require('./server/bars'),
    products = require('./server/products'),
    users = require('./server/users'),
    bartenderusers = require('./server/bartenderusers'),

//    cases = require('./server/cases'),
    wallet = require('./server/wallet'),
    wishlist = require('./server/wishlist'),
    stores = require('./server/stores'),
    pictures = require('./server/pictures'),
    auth = require('./server/auth'),
    facebook = require('./server/facebook'),
    s3signing = require('./server/s3signing'),
    activities = require('./server/activities'),
    uploadimg = require('./server/uploads3'),
    app = express();

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
   cb(null, './public/uploads/')
 },
 filename: function(req, file, cb) {
   cb(null, file.fieldname + '-' + Date.now() + '.jpg')
 }
});

var upload = multer({
 storage: storage
});

app.set('port', process.env.PORT || 5000);

app.use(compression());
app.use(bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true
}));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, './client')));

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.send(500, err.message);
});

app.post('/login', auth.login);
app.post('/bartenderlogin', auth.bartenderlogin);
app.post('/bartendersignup', auth.bartendersignup);
app.post('/bartenderlogout', auth.validateToken, auth.logout);


app.post('/logout', auth.validateToken, auth.logout);
app.post('/signup', auth.signup);
app.post('/fblogin', facebook.login);

app.get('/users/me', users.getProfile);
app.put('/users/me', users.updateProfile);
app.get('/bartenderusers/bartender', auth.validateToken, bartenderusers.getBartenderProfile);
app.put('/bartenderusers/bartender', auth.validateToken, bartenderusers.updateBartenderProfile);
app.post('/bartenderusers/post', auth.validateToken, bartenderusers.post);

app.get('/offers', offers.getAll);
// app.get('/offers', auth.validateToken, offers.getAll);


app.get('/offers/:id', offers.getById);
//for bars
app.get('/bars/:id', bars.getById);
app.get('/bars', bars.getAll);
app.get('/products', products.getAll);
app.get('/products/:id', products.getById);
app.get('/stores', stores.findAll);

app.get('/wallet', auth.validateToken, wallet.getItems);
app.post('/wallet', auth.validateToken, wallet.addItem);
app.delete('/wallet/:id', auth.validateToken, wallet.deleteItem);

app.get('/wishlist', auth.validateToken, wishlist.getItems);
app.post('/wishlist', auth.validateToken, wishlist.addItem);
app.delete('/wishlist/:id', auth.validateToken, wishlist.deleteItem);

app.get('/pictures', auth.validateToken, pictures.getItems);
app.post('/pictures', auth.validateToken, pictures.addItem);
app.delete('/pictures', auth.validateToken, pictures.deleteItems);

app.get('/activities', auth.validateToken, activities.getItems);
app.post('/activities', auth.validateToken, activities.addItem);
app.delete('/activities', auth.validateToken, activities.deleteAll);

//app.post('/cases', auth.validateToken, cases.createCase);
//app.get('/nfrevoke', cases.revokeToken);

app.post('/upload', upload.single("upload"), uploadimg.upload);

app.post('/s3signing', auth.validateToken, s3signing.sign);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
