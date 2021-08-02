const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const camp=require('../controllers/campgrounds');
const {storage}=require('../cloudinary');

const multer  = require('multer');
const upload=multer({storage});


const campground=require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');

router.route('/')
    .get(catchAsync(camp.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(camp.createCampground))
    /*.post(upload.array('image'),(req,res)=>{
        console.log(req.body,req.files);
        res.send('it worked');
    })*/


 router.get('/new',isLoggedIn,camp.renderNewForm);
 router.route('/:id')
    .get(catchAsync(camp.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(camp.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(camp.deleteCampground))


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(camp.renderEditForm));



module.exports=router;
