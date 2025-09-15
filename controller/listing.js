const listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
  let alllisting = await listing.find({});
  res.render("listing/index.ejs",{alllisting});
};

module.exports.newListing = (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.showRoute = async(req,res)=>{
    let {id} = req.params;
    let showlisting = await listing.findById(id)   .populate({
      path: "reviews",        // populate reviews
      populate: { path: "author" }  // inside each review, populate author
    }).populate("owner");
     if(!showlisting){
    req.flash("error","Listing You Requested That Doest Not Exist");
    return res.redirect("/listing");
     }
    res.render("listing/show.ejs",{showlisting});
};

module.exports.createNewlisting = async(req,res)=>{

  let url = req.file.path;
  let fileName = req.file.filename;

  let newlisting =  new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = {url, fileName};

  await newlisting.save();
    req.flash("success","New Listing Created");
  res.redirect("/listing");
};

module.exports.editRoute = async(req,res,next)=>{

     let {id} = req.params;
    let editlisting = await listing.findById(id);
     if(!editlisting){
     req.flash("error","Listing You Requested That Doest Not Exist");
      return res.redirect("/listing");
     };
     let origianlimage = editlisting.image.url;
     origianlimage.replace("/uploads","/uploads/f_auto,q_auto/"); 
    res.render("listing/edit.ejs",{editlisting});
};

module.exports.updateRoute = async(req,res)=>{
    let {id} = req.params;
   let editlisting = await listing.findByIdAndUpdate(id,{...req.body.listing});
     if(req.file){
      let url = req.file.path;
  let fileName = req.file.filename;
  editlisting.image = {url, fileName}
 await editlisting.save();
};
 
      req.flash("success","Listing  Is Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyRoute = async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
      req.flash("success","Listing Deleted");
    res.redirect("/listing");
};

// search

module.exports.searchRoute = async (req, res) => {
  const { q } = req.query;
  let query = {};

  if (q) {
    query = {
      $or: [
        { title: { $regex: q, $options: "i" } }, // case-insensitive
        { location: { $regex: q, $options: "i" } }
      ]
    };
  }

  const listings = await Listing.find(query);
  res.render("listings/index", { listings, q });
};
