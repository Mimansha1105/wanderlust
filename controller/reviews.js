const listing=require("../models/listing");
const review=require("../models/review");


module.exports.createreview= async (req, res) => {
  const foundListing = await listing.findById(req.params.id); 

  const newReview = new review(req.body.review);
  newReview.author=req.user._id;
  foundListing.reviews.push(newReview);
  await newReview.save();
  await foundListing.save();

  console.log("NEW REVIEW SAVE",newReview);
 req.flash("success","new review created!");
    res.redirect(`/listings/${foundListing._id}`); 
};
module.exports.deletereview=async(req,res)=>{
 let{id,reviewID}=req.params;
  await listing.findByIdAndUpdate (id,{$pull:{reviews:reviewID}});
  await review.findByIdAndDelete(reviewID);
  req.flash("success","review deleted!");
  res.redirect(`/listings/${id}`);
};