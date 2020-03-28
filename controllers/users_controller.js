module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

module.exports.signUp = function(req,res){
    return res.render('user_sign_up', {
        title: "Codial | Sign Up"
    })
}

module.exports.signIn = function(req,res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = function(req,res){
    //TODO Later
}