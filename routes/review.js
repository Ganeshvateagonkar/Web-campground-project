const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const reviews=require('../controllers/review');

const campground=require('../models/campground');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');


const Review=require('../models/review');





router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));


module.exports=router;