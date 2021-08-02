const ExpressError=require('./utils/ExpressError');
const {campgroundSchema}=require('./schemas.js');
const campground=require('./models/campground');
const {reviewSchema}=require('./schemas.js');
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must signed in first');
        return res.redirect('/login')
    }
    next();
}

 module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(er=>er.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }

}
 module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campgrounds=await campground.findById(id);
    if(!campgrounds.author.equals(req.user._id)){
        req.flash('error','you do not have permissin to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

 module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(er=>er.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','you do not have permissin to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}