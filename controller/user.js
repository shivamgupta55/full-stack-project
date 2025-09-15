const User = require('../models/user.js');
const { reviewSchema } = require("../joi.js");


module.exports.signupForm = async(req,res,next)=>{
    try{
let { username, email, password } = req.body;
    let newUser = new User({
        username:username,
        email:email
    })
   let regiteredUser = await User.register(newUser, password);
//    console.log(regiteredUser);
   req.login(regiteredUser,(err)=>{
    if(err){
        next(err);
    }
  req.flash("success","Congrat's your account has been created");    
   res.redirect("/listing");
   })
 
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLogin = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.updateLogin = (req,res)=>{
    req.flash("success","Welcome In WonderLust");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        } else {
            req.flash("success","you logout successfully");
            res.redirect("/login");
        }
})};