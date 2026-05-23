const listing=require("../models/listing");
module.exports.index=async (req,res)=>{
  const { q, category } = req.query;
  const searchQuery = q ? q.trim() : "";
  const categoryQuery = category ? category.trim().toLowerCase() : "";
  let alllistings = await listing.find({});

  if (categoryQuery) {
    const categoryOrder = [
      "trending",
      "rooms",
      "iconic cities",
      "mountains",
      "castles",
      "beaches",
      "lakefronts",
      "surfing",
      "bloosoms",
      "camping",
      "farms",
      "arctic",
    ];
    const categoryIndex = categoryOrder.indexOf(categoryQuery);

    alllistings = alllistings.filter((item, index) => {
      if (item.category === categoryQuery) return true;
      if (categoryIndex === -1) return false;

      return index % 4 === categoryIndex % 4 || index % 6 === categoryIndex % 6;
    });
  }

  if (searchQuery) {
    alllistings = alllistings.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  res.render("listings/index", { alllistings, searchQuery, categoryQuery })
};


module.exports.rendernewform=async (req,res)=>{
 res.render("listings/new");
};

module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  const foundListing = await listing.findById(id).populate("reviews");

  if (!foundListing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalimageurl = foundListing.image.url.replace("/upload", "/upload/h_150,w_120,c_fill");

  res.render("listings/edit", { listing: foundListing, originalimageurl });
};


module.exports.createlisting=async (req,res,next)=>{
let url=  req.file.path;
let filename=req.file.filename;
const newlisting=new listing(req.body.listings);
newlisting.owner=req.user._id;
newlisting.image={filename,url};
await newlisting.save();
console.log(newlisting);
req.flash("success","new listing created!");
res.redirect("/listings");
};

module.exports.showlisting=async (req,res)=>{
let {id}=req.params;
const foundlisting = await listing.findById(req.params.id)
  .populate("owner")
  .populate({path:"reviews", populate:{path:"author",}});

//  console.log(foundlisting);

 res.render("listings/show",{foundlisting});
};

module.exports.updatelisting=async (req,res)=>{
let {id}=req.params;
let listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
if( typeof req.file!=="undefined"){
let url=  req.file.path;
let filename=req.file.filename;
listing.image={url,filename};
await listing.save();
}
 req.flash("success","listing updated!");
 res.redirect("/listings");
};

module.exports.deletelisting=async (req,res)=>{
let{id}=req.params;
let deletedlisting= await listing.findByIdAndDelete(id);
console.log(deletedlisting);
req.flash("success","listing deleted!");
res.redirect("/listings");
};
