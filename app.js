if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");

const dburl=process.env.ATLAS_DB_URL;
const listing = require("./models/listing.js");  
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const path=require("path");
const ejsmate= require("ejs-mate");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const methodOverride=require("method-override");


const ExpressError=require("./utils/expresserror.js");
const {listingschema,reviewschema}=require("./schema.js");
const review=require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const { cookie } = require("express/lib/response.js");



app.set("view engine","ejs")  ;
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("connected to database");
}).catch(err=>{
    console.log(err);
});
async function main() {
   
    await mongoose.connect(dburl);
   
}


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo session store",err);
});

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//one week time period
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

//app.get("/",(req,res)=>{
  //  res.send("hi i am root !!");
//});


app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currentuser=req.user;
    console.log(res.locals.success);
    next();
});



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userrouter);

//Home/Index ROUTE
app.get("/",(req,res)=>{
    res.render("index.ejs");
}













//Error handling middleware
app.use((err,req,res,next)=>{
  const {statusCode=500,message="something went wrong"} = err;
  res.status(statusCode).render("error.ejs", { message });


});


app.listen(8080,()=>{
    console.log("server is listening to port");
});