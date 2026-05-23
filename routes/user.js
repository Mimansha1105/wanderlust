const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapasync = require("../utils/wrapasync");
const LocalStrategy=require("passport-local");
const passport = require("passport");
const {saveredirectUrl}=require("../models/middleware");
const usercontroller=require("../controller/users");

const ensureGoogleAuthConfigured = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    req.flash("error", "Google login is not configured yet.");
    return res.redirect("/user/login");
  }
  next();
};

router.route("/signup")
.get(usercontroller.rendersignup)
.post(usercontroller.signup);

router.route("/login")
.get(usercontroller.loginsignup)
.post(
 saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true
  }),
  usercontroller.welcomeback
);

router.get(
  "/auth/google",
  ensureGoogleAuthConfigured,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  ensureGoogleAuthConfigured,
  passport.authenticate("google", {
    failureRedirect: "/user/login",
    failureFlash: true
  }),
  usercontroller.googlecallback
);

router.get("/logout",usercontroller.logout);


module.exports=router;
