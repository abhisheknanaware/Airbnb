//external modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dbpath="mongodb+srv://root:7499631188@airbnbproject.nvhats3.mongodb.net/airbnb?appName=airbnbproject";

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

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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