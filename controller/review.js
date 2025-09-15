const Review = require('../models/reviews.js');
const { reviewSchema } = require("../joi.js");
const listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
   let listingId = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author  = req.user._id;
    listingId.reviews.push(newReview);

    await newReview.save();
    await listingId.save();
      req.flash("success"," New Review Created");
    res.redirect(`/listing/${listingId._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
    res.redirect(`/listing/${id}`);
}