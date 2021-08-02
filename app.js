if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}



const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');

const ExpressError=require('./utils/ExpressError');
const userRoutes=require('./routes/user');
const campgrounds=require('./routes/campgrounds');
const review=require('./routes/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
const localStragey=require('passport-local');
const User=require('./models/user');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');  //for security purpose we use this package





const mongoose = require('mongoose');

const methodeOverride=require('method-override');

const {transcode}=require('buffer');
const Review=require('./models/review');


const MongoStore = require('connect-mongo');

//const dbUrl=process.env.DBURL;
const dbUrl= 'mongodb://localhost:27017/test';



mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error ;'));
db.once('open',()=>{
  console.log("database connected");
})
app.use(methodeOverride('_method'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));


app.use(express.static(path.join(__dirname,'public')));



app.use(mongoSanitize());

/*const store= new MongoDBStore({
    url:dbUrl,
    secret:'thisissecret',
    touchAfter:24*60*60   //this is in second
});

store.on("error",function(e){
    console.log('session store error',e)
})*/

const secret=process.env.SECRET || 'thisissecret';

app.use(session({
    secret,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      ttl: 14 * 24 * 60 * 60,
     
    })
  }));

const sessionConfig={

    name:'session',
    secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
      httpOnly:true,
      expires:Date.now() +1000*60*60*24*7, //this convertinfg in weak
      maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxjnusnyd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStragey(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





 app.use((req,res,next)=>{
     res.locals.currentUser=req.user;
     res.locals.success=req.flash('success');
     res.locals.error=req.flash('error');
     next();

 })
 app.use('/',userRoutes);
 app.use('/campgrounds',campgrounds);
 app.use('/campgrounds/:id/reviews',review);
 




 app.get('/', (req, res) => {
    res.render('home')
});





app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404));
})

app.use((err,req,res,next)=>{
    const { status=500}=err;
    if(!err.message)err.message="oh no ,something went wrong";
    res.status(status).render('campgrounds/error',{err});
    
})
const port=3000;
app.listen(port,()=>{
    console.log(`serving on port ${port}`);
})


//C8eLdimDeri0W95x