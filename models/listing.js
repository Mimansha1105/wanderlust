const { ref, string } = require("joi");
const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema; 

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
    url: { type: String },
    filename: { type: String }
  },

    price: Number,
    location: String,
    country: String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"review"
      },
    ],
    owner:{
    type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    category:{
  type:String,
  enum:["mountains","arctic","trending","rooms","iconic cities","castles","beaches","lakefronts","surfing","bloosoms","camping","farms"],
    }
});

listingSchema.post("findOneAndDelete",async(Listing)=>{
  if (Listing){
 await review.deleteMany({_id:{$in:Listing.reviews}});
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
