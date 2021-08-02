const mongoose = require('mongoose');
const campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedshelper');


mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error '));
db.once('open',()=>{
  console.log("database connected");
})
const sample=array =>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random100=Math.floor(Math.random()*100);
        const price=Math.floor(Math.random()*100)+10;
        const camp=new campground({
          //your user ID
            author:'60fd0289d83d554020ec3d34',
            location :`${cities[random100].city} , ${cities[random100].state}`,

            title : `${sample(descriptors)} ${sample(places)}`,
         
            description:'this is a good place to visit ',
            price,
            geometry:{
                  type:'Point',
                  coordinates:[
                    cities[random100].longitude,
                    cities[random100].latitude
                  ]
            },
            
            images:[
                    {
                      //https://res.cloudinary.com/dxjnusnyd/image/upload/v1627405645/yelpCamp/hjjzh0xbbh8byho5vcns.jpg
                      //https://res.cloudinary.com/dxjnusnyd/image/upload/v1627790428/yelpCamp/ewcd9mz2ekm1oblgakkx.jpg
                   
                      url: 'https://res.cloudinary.com/dxjnusnyd/image/upload/v1627790428/yelpCamp/ewcd9mz2ekm1oblgakkx.jpg',
                      filename: 'yelpCamp/ewcd9mz2ekm1oblgakkx'
                    },
                    {
                     
                      url: 'https://res.cloudinary.com/dxjnusnyd/image/upload/v1627405646/yelpCamp/qvkgszjzczdojwfodjah.jpg',
                      filename: 'yelpCamp/qvkgszjzczdojwfodjah'
                    },
                    {
                      
                      url: 'https://res.cloudinary.com/dxjnusnyd/image/upload/v1627405647/yelpCamp/dfybhu1jbc0cwa19mcsz.jpg',
                      filename: 'yelpCamp/dfybhu1jbc0cwa19mcsz'
                    }
                  
            ]
        })
        await camp.save();
    }
}

seedDB();
