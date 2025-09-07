const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapasync = require("../utils/wrapasync");
const LocalStrategy=require("passport-local");
const passport = require("passport");
const {saveredirectUrl}=require("../models/middleware");
const usercontroller=require("../controller/users");

router.route("/signup")
.get(usercontroller.rendersignup)
.post(usercontroller.signup);

router.route("/login")
.get(usercontroller.loginsignup)
.post(
 saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  usercontroller.welcomeback
);


router.get("/logout",usercontroller.logout);


module.exports=router;