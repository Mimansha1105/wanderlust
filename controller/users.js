const User = require("../models/user.js");

module.exports.rendersignup=(req,res)=>{
 res.render("users/signup.ejs");
};
module.exports.loginsignup=(req,res)=>{
 res.render("users/login.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
let {username,email,password}=req.body;
const newuser=new User({username,email});
const registereduser= await User.register(newuser,password);
console.log(registereduser);
req.login(registereduser,(err)=>{
  if(err){
   
    next(err);
  }
req.flash("success","welcome to wanderlust");
res.redirect("/listings");
});

    }
    catch(e){
req.flash("error", e.message);

  res.redirect("/signup");
    }

};
module.exports.welcomeback=(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
  res.redirect(req.session.redirectUrl || "/listings");
 // Redirect to a working page
  };
  module.exports.logout=(req,res,next)=>{
req.logOut((err)=>{
  if(err){
   return next(err);
  }
  req.flash("success","you are logged out now!");
  res.redirect("/listings");
})
};