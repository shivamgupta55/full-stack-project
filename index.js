if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const ExpressError = require('./utils/expressError.js');
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const { reviewSchema } = require("./joi.js");
const userRoutes = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require('passport-local');
const User = require('./models/user.js');
const MongoStore = require('connect-mongo');
const dburl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connection success");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600
})

app.use(flash());
app.use(session({
    store,
    secret:process.env.SECRET,
    saveUninitialized:true,
    resave:false,
    cookie: {
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        hhtpOnly:true
    },
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successmsg = req.flash("success");
     res.locals.errormsg = req.flash("error");
     res.locals.curUser = req.user;
    next();
})



app.listen(5500,(req,res)=>{
    console.log("server is running");
})

app.use("/listing",listingRoutes);
app.use("/listing/:id/review",reviewRoutes);
app.use("/",userRoutes);


app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});

// Central error-handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs",{message}); // ✅ Safe with default fallback
});


app.get("/",(req,res)=>{
res.send("working");    
})
