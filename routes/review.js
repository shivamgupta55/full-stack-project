const express = require('express');
const router = express.Router({mergeParams:true});

const wrapasync = require("../utils/wrapasync.js");
const { islogged, isReviewAuthor } = require('../utils/islogged.js');
const {validateReviewSchema} = require('../utils/islogged.js');
const {createReview, destroyReview } = require('../controller/review.js');


//Reviews

// reviews route
router.post("/",islogged,validateReviewSchema,wrapasync(createReview));

// delete review route

router.delete("/:reviewId",islogged,isReviewAuthor,destroyReview);

module.exports = router;
