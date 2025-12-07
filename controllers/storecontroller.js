const Favourite = require('../models/favourite');
const Home = require('../models/home');

exports.gethome = (req, res, next) => {
    
    Home.find().then(arr=>
        res.render('store/home_list',
            { arr: arr, currentpage: 'Home',isLoggedIn:req.isLoggedIn}
        ));
};
exports.getindex = (req, res, next) => {
    console.log("session :",req.session);
    Home.find().then(arr=>
        res.render('store/index',
            { arr: arr, currentpage: 'index',isLoggedIn:req.isLoggedIn}
        )
    )
};
exports.getbookings = (req, res, next) => {
    res.render('store/bookings',
        { currentpage: 'Bookings',isLoggedIn:req.isLoggedIn}
    );
}
exports.getfavouritelist = (req, res, next) => {
    Favourite.find()
    .populate('houseid')
    .then(favourites=>{
        const favhome=favourites.map(fav=>fav.houseid);

        res.render('store/favourite_list',
            { favhome: favhome, currentpage: 'Favourite List',isLoggedIn:req.isLoggedIn}
        );
        
    });
}

exports.gethomebyid = (req, res, next) => {
    const homeid = req.params.homeid;
    Home.findById(homeid).then(home => { 
        if (!home) {
            console.log("No home found");
            res.redirect('/homes');
        } else {
            res.render('store/home_detail',
                {home:home, homeid: homeid, currentpage: 'Home Details',isLoggedIn:req.isLoggedIn});
        }
    });

}

exports.postfavouritelist = (req, res, next) => {
    const houseid = req.body.id;
    Favourite.findOne({houseid:houseid})
    .then(existingFav=>{
        if(existingFav){
            return res.redirect("/favourite_list");
        }
        const fav=new Favourite({houseid:houseid});
        return fav.save();
    })
    .then(fav=>{
        console.log("Home added to favourite list:", fav);
        res.redirect("/favourite_list");
    })
    .catch(err=>{
        console.log("Error while adding to favourite list:",err);
    })
};

exports.postdeletefavourite = (req, res, next) => {
    const homeid=req.params.homeId;
    Favourite.findOneAndDelete({houseid:homeid}).then(()=>{
      console.log("Home deleted from favourite list:", homeid);
    })
    .catch(err=>{
        console.log("Error while deleteing to favourite list:",err);
    }).finally(()=>{
        res.redirect("/favourite_list");
    });
}