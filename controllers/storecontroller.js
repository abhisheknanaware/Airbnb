const Home = require('../models/home');
const User = require('../models/user');
exports.gethome = (req, res, next) => {
    
    Home.find().then(arr=>
        res.render('store/home_list',
            { arr: arr, currentpage: 'Home',isLoggedIn:req.isLoggedIn,user:req.session.user}
        ));
};
exports.getindex = (req, res, next) => {
    console.log("session :",req.session);
    Home.find().then(arr=>
        res.render('store/index',
            { arr: arr, currentpage: 'index',isLoggedIn:req.isLoggedIn,user:req.session.user}
        )
    )
};
exports.getbookings = (req, res, next) => {
    res.render('store/bookings',
        { currentpage: 'Bookings',isLoggedIn:req.isLoggedIn,user:req.session.user}
    );
}
exports.getfavouritelist = async (req, res, next) => {

    const userid=req.session.user._id;
    const user=await User.findById(userid).populate('favourites')

    res.render('store/favourite_list',
        { favhome: user.favourites, currentpage: 'Favourite List',isLoggedIn:req.isLoggedIn,user:req.session.user}
    );  
}

exports.gethomebyid = (req, res, next) => {
    const homeid = req.params.homeid;
    Home.findById(homeid).then(home => { 
        if (!home) {
            console.log("No home found");
            res.redirect('/homes');
        } else {
            res.render('store/home_detail',
                {home:home, homeid: homeid, currentpage: 'Home Details',isLoggedIn:req.isLoggedIn,user:req.session.user});
        }
    });

}

exports.postfavouritelist = async (req, res, next) => {
    const houseid = req.body.id;

    const userid=req.session.user._id;
    const user=await User.findById(userid);
    if(!user.favourites.includes(houseid)){
        user.favourites.push(houseid);
        await user.save();
    }
    res.redirect("/favourite_list");
};

exports.postdeletefavourite = async (req, res, next) => {
    const homeid=req.params.homeId;
    const userid=req.session.user._id;
    const user=await User.findById(userid);

    if(user.favourites.includes(homeid)){
        user.favourites=user.favourites.filter(fav=>fav!=homeid);
        await user.save();
    }
    res.redirect("/favourite_list");
}