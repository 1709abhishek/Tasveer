const express = require('express');
const flash   = require('req-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(express.urlencoded());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

// Setup an express session for flash messages.
app.use(session({
    secret: 'Abhishek Jain',
    resave: false,
    saveUninitialized: true
}));

// Set up flash middleware.
app.use(flash());

app.use(requestIp.mw())
 
// app.use(function(req, res) {
//     const ip = req.clientIp;
//     res.end(ip);
// });

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.post('/captcha', function(req,res) {
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
      }
      // Put your secret key here.
      var secretKey = "6LeF5uQUAAAAAEtRTFX-qhfVTi2h9BgoLFN2xnNx";
      // req.connection.remoteAddress will provide IP address of connected user.
      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
      // Hitting GET request to the URL, Google will respond with success or error scenario.
      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }
        res.json({"responseCode" : 0,"responseDesc" : "Success"});
      });
});
app.use("*",function(req,res) {
    res.status(404).send("404");
})

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
