const express = require('express');
const router = express.Router();
const passport = require('passport');
const { redirectUrl } = require('../utils/islogged.js');
const { signupForm, renderLogin, updateLogin, logout } = require('../controller/user.js');
const { reviewSchema } = require("../joi.js");

router.route("/signup")
.get((req,res)=>{
    res.render("user/user.ejs");
})
.post(signupForm);

router.route("/login")
.get(renderLogin)
.post(redirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),updateLogin)

// logout route
router.get("/logout",logout);



module.exports = router;