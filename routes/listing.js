const express = require('express');
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const {islogged, isOwner,validateSchema} = require('../utils/islogged.js');
const {index, newListing, showRoute, createNewlisting, editRoute, updateRoute, destroyRoute, searchRoute} = require('../controller/listing.js');
const multer  = require('multer')
const { storage} = require("../cloudinary.js");
const upload = multer({ storage })

router.route("/")
.get(wrapasync(index))
.post(islogged,upload.single("listing[image]"),validateSchema,wrapasync(createNewlisting))
.get(wrapasync(searchRoute));


router.get("/new",islogged,newListing);

router.route("/:id")
.get(wrapasync(showRoute))
.put(islogged,isOwner,upload.single("listing[image]"),validateSchema,wrapasync(updateRoute))
.delete(isOwner,islogged,wrapasync(destroyRoute))

router.get("/:id/edit",islogged,isOwner,wrapasync(editRoute));


module.exports = router;