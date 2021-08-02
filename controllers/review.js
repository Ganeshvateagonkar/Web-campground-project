const Review=require('../models/review');
const campground=require('../models/campground');

module.exports.createReview=async(req,res)=>{
    const {id}=req.params;
    const campgrounds=await campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campgrounds.reviews.push(review);
    await review.save();
    await campgrounds.save();
    req.flash('success','successfuly added campground')
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfuly deleted  review')
    res.redirect(`/campgrounds/${id}`);
}

