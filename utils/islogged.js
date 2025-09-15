const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');
const ExpressError = require('../utils/expressError.js');
const { reviewSchema, schema } = require("../joi.js");

// ---------------- CREATE REVIEW ----------------
module.exports.createReview = async (req, res) => {
    let listingId = await Listing.findById(req.params.id);
    if (!listingId) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listingId.reviews.push(newReview);

    await newReview.save();
    await listingId.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listing/${listingId._id}`);
};

// ---------------- DELETE REVIEW ----------------
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
};

// ---------------- LOGIN CHECK ----------------
module.exports.islogged = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login"); // ✅ better to redirect to login
    }
    next();
};

// ---------------- SAVE REDIRECT URL ----------------
module.exports.redirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

// ---------------- OWNER CHECK ----------------
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let editlisting = await Listing.findById(id);

    if (!editlisting) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    if (!editlisting.owner.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }

    next();
};

// ---------------- REVIEW AUTHOR CHECK ----------------
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listing/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }

    next();
};

// ---------------- SCHEMA VALIDATION ----------------
module.exports.validateSchema = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.validateReviewSchema = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);
    }
    next();
};
