const home = require('../models/home');
const Home = require('../models/home');

exports.getaddhome = (req, res, next) => {
    res.render('host/edithome', { currentpage: 'Add Home', editing: false,isLoggedIn:req.isLoggedIn});
};

exports.postaddhome = (req, res, next) => {

    const { id, housename, price, location, image_url, rating } = req.body;
    const home = new Home({ housename, price, location, image_url, rating });

    home.save().then(() => {
        console.log("New Home Details Received:", home);
        res.render('host/registered', { home, currentpage: 'registered',isLoggedIn:req.isLoggedIn});
    })
        .catch(err => {
            console.log("Error while adding home:", err);
        });

};
exports.hostgethome = (req, res, next) => {
    Home.find().then(arr =>
        res.render('host/host_home_list',
            { arr: arr, currentpage: 'Host Home',isLoggedIn:req.isLoggedIn }
        ));
};
exports.getEditHome = (req, res, next) => {
    const homeid = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeid).then(home => {
        if (!home) {
            return res.redirect('/host/host-home-list');
        }
        res.render('host/edithome', { home: home, currentpage: 'Host Home', editing: editing,isLoggedIn:req.isLoggedIn});
    })
};

exports.postEditHome = (req, res, next) => {
    const { _id, housename, price, location, image_url, rating } = req.body;
    Home.findById(_id).then(home => {
        home.housename = housename;
        home.price = price;
        home.location = location;
        home.image_url = image_url;
        home.rating = rating;
        home.save().then(result => {
            console.log("UPDATED HOME!", result);
        }).catch(err => {
            console.log("Error while updating home:", err);
        });
        res.redirect('/host/host-home-list');
    }).catch(err => {
        console.log("Error while finding home for edit:", err);
    });

}
exports.postDelethome = (req, res, next) => {
    const homeid = req.params.homeId;
    Home.findByIdAndDelete(homeid).then(() => {
        res.redirect('/host/host-home-list');
    }).catch(err => {
        console.log("Error while deleting home:", err);
    });
}