const User = require('../models/user');
const request = require('request');
const requestIp = require('request-ip');

module.exports.profile = function(req, res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){
            if(user){
                return res.render('user_profile', {
                    title: "User Profile",
                    user: user
                })
            }else{
                return res.redirect('/users/sign-in');
            }
        });
    }else{
        return res.redirect('/users/sign-in');
    }
}

module.exports.signIn = function(req,res){
    return res.render('user_sign_in', {
        title: "Tasveer | Sign In"
    })
}

module.exports.signUp = function(req,res){
    // Getting IP address.
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Getting today's date.
    var today = new Date();

    // today's midnight
    var midToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Get all the docs created today with this IP.
    User.countDocuments({ip: ip, createdAt: {$gte: midToday}}, function (err, count) { 
        console.log(count, "Count", "IP", ip);

        if (count >= 3) { // Show captcha.
            return res.render('user_sign_up', { 
                title: 'Sign Up', 
                showCaptcha  : true, 
                recaptcha    : res.recaptcha,
                success      : req.flash('success'),
                captchaError : req.flash('captchaError'),
                passwordErr  : req.flash('passwordError'),
                dbError      : req.flash('dbError')
            });
        } else { // Hide captcha.
            return res.render('user_sign_up', { 
                title: 'Sign Up', 
                showCaptcha  : false, 
                recaptcha    : res.recaptcha,
                success      : req.flash('success'),
                captchaError : req.flash('captchaError'),
                passwordErr  : req.flash('passwordError'),
                dbError      : req.flash('databaseError')
            });
        }
    });
}

//get the sign up data
module.exports.create = function(req,res){
    if(!req.recaptcha.error){
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if(isValidPassword(req.body.password)){
            if(req.body.password==req.body.confirm_password){
                let entry = req.body;
                entry.ip = ip;
                let document = new User(entry);
                document.save(function(err, resp){
                    if(err){
                        req.flash("databaseError", "Error in database");
                        return res.redirect('/');
                    }else{
                        req.flash("success","Saved data successfully");
                        return res.redirect('/users/profile');
                    }
                });
            } else {
                req.flash("passwordError", "password doesn't match");
                return res.redirect('/');
            }
        }else{
            req.flash("passwordError", "Invalid password");
            return res.redirect('/');
        }
    }else{

        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // Getting today's date.
        var today = new Date();

        // today's midnight
        var midToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Get all the docs created today with this IP.
        User.countDocuments({ip: ip, createdAt: {$gte: midToday}}, function (err, count) { 
            console.log(count, "Count", "IP", ip);

            if (count < 3) {
                
                if(req.body){
                    if(isValidPassword(req.body.password)){
                        if(req.body.password==req.body.confirm_password){
                            let entry = req.body;
                            entry.ip = ip;
                            let document = new User(entry);
                            document.save(function(err, resp){
                                if(err){
                                    req.flash("databaseError", "Error in database");
                                    return res.redirect('/');
                                }else{
                                    req.flash("success","Saved data successfully");
                                    return res.redirect('/users/profile');
                                }
                            });
                        }else {
                            req.flash("passwordError", "password doesn't match");
                            return res.redirect('/');
                        }
                    }else{
                        req.flash("passwordError", "Invalid password");
                        return res.redirect('/');
                    }
                }
            } else { // Case 2.
                req.flash("captchaError", req.recaptcha.error + " Invalid captcha");
                return res.redirect('/');
            }
        });
        }
    }
    // if(isValidPassword(req.body.password) && req.body.password != req.body.confirm_password){
    //     return res.redirect('back');
    // }

    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err){console.log('error in finding user in signing up'); return}

    //     if(!user){
    //         User.countDocuments({ip: requestIp.getClientIp(req)}, function(err, c){
    //             if(err){console.log('error in creating user while counting ip'); return}
    //             console.log(requestIp.getClientIp(req));
    //             console.log('Count is ' + c);
    //         });
    //         if(c>=3){
    //             return res.redirect('/captcha');
    //         }else{
    //             User.create(req.body, function(err, user){
    //                 if(err){console.log('error in creating user while signing up'); return}
    //                 user.ip = requestIp.getClientIp(req).toString();
    //                 // user.ip = '' + ip;
    //                 return res.redirect('/users/profile');
    //             })
    //         }
    //         }else{
    //             return res.redirect('back');
    //         }
    // });

//sign-In and create a session
module.exports.createSession = function(req,res){
    
    //steps to authenticate
    //find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing in'); return}

        //handle user found
        if(user){


            //handle password which don't match
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');

        }else{
            //handle user not found
            return res.redirect('back');

        }


    });
}

// Password validation.
function isValidPassword(password) {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/;
    return password.match(regex);
}

