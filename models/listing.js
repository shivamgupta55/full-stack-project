const mongoose = require('mongoose');
const Review = require('./reviews.js');

let listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
        filename:String,
        url:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }
],
owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
}
})

listingSchema.post("findOneAndDelete",async (listings)=>{
    if(listings){
  await Review.deleteMany({_id: {$in: listings.reviews}})
    }
  
});

let listing = mongoose.model("listing",listingSchema);
module.exports = listing;