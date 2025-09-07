const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expresserror.js");
const {listingschema,reviewschema}=require("../schema.js");
const listings = require("../models/listing.js"); 
const {isloggedin}=require("../models/middleware.js");
const listingcontroller=require("../controller/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");

const upload = multer({ storage});

const validatelisting=(req,res,next)=>{
  const result = listingschema.validate(req.body.listings);
  console.log("Joi result:", result); 

     let{error} = listingschema.validate(req.body.listings);
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};
 router.route("/")
 .get( wrapasync(listingcontroller.index))
.post(
  isloggedin,
  upload.single('listings[image]'),
  validatelisting,
  wrapasync(listingcontroller.createlisting));


router.get("/new",isloggedin, listingcontroller.rendernewform);
router.route("/:id")
.put( wrapasync(upload.single('listings[image]'),listingcontroller.updatelisting))
.get( wrapasync(listingcontroller.showlisting))
.delete(isloggedin,validatelisting, wrapasync(listingcontroller.deletelisting));


router.get("/:id/edit", wrapasync(listingcontroller.editlisting));

  module.exports=router;