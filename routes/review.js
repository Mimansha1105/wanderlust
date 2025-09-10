const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expresserror.js");
const {listingschema,reviewschema}=require("../schema.js");
const review=require("../models/review.js");
const listing = require("../models/listing.js");  
const {isloggedin,isreviewauthor}=require("../models/middleware.js");
const validatereview=(req,res,next)=>{
  const result = reviewschema.validate(req.body.listings);
  console.log("Joi result:", result); 

     let{error} = listingschema.validate(req.body.listings);
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};
const reviewcontroller=require("../controller/reviews.js");
router.post("/",isloggedin,validatereview, wrapasync(reviewcontroller.createreview));

// app.use("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });
router.delete("/:reviewID",isloggedin,isreviewauthor,wrapasync(reviewcontroller.deletereview));
module.exports=router;
