exports.getlogin = (req, res, next) => {
    res.render('auth/login', { pageTitle: 'Login',
        currentpage: 'Login',isLoggedIn:false});
}

exports.postlogin = (req, res, next) => {
    console.log(req.body);
    // res.cookie("isLoggedIn", true);
    req.session.isLoggedIn = true;
    res.redirect('/');
}
exports.postlogout = (req, res, next) => {
    req.session.destroy(()=>{
        res.redirect('/login');
    })
}
