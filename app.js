//path
const dirname=__dirname;

//external modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dbpath="mongodb+srv://root:kk@airbnbproject.nvhats3.mongodb.net/airbnb?appName=airbnbproject";
const multer=require("multer")

//local router
const storerouter = require('./routes/storerouter');
const { hostRouter } = require('./routes/hostrouter');
const { default: mongoose } = require('mongoose');
const { authrouter } = require('./routes/authrouter');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views')

const store = new MongoDBStore({
    uri: dbpath,
    collection: 'sessions'
});

const randomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "uploads/");
    },
    filename:(req, file, cb)=>{
        cb(null, randomString(10) + '-' + file.originalname)
    }
})

const filefilter=(req,file,ch)=>{
    if(file.mimetype ==='image/png' ||file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg' ){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const multeroptions={
    storage,filefilter
};

app.use(express.urlencoded({ extended: true }));
app.use(multer(multeroptions).single('image'))
app.use(express.static(path.join(dirname, 'public')));
app.use("/uploads",express.static(path.join(dirname, 'uploads')))
app.use("/host/uploads",express.static(path.join(dirname, 'uploads')))
app.use(session({
    secret:"airbnb",
    resave:false,
    saveUninitialized:true,
    store:store
}));

app.use((req,res,next)=>{
    req.isLoggedIn=req.session.isLoggedIn;
    //for one cookie->
    // req.isLoggedIn = req.get("Cookie").split("=")[1] === "true" ? true : false;
    next()
})

app.use(storerouter);

app.use("/host",(req,res,next)=>{
    if(!req.isLoggedIn){
       return res.redirect('/login');
    }
    next();
});
app.use("/host", hostRouter);

app.use(authrouter);

app.use((req, res, next) => {
    res.status(404).send("<h1>404 page not found</h1>")
})


mongoose.connect(dbpath).then(()=>{
    console.log("connected to mongodb");
     app.listen(port, () => {
        console.log(`Example app listening on port: http://localhost:${port}`);
    });
})
.catch(err=>{
    console.log("failed to connect to mongodb",err);

});
