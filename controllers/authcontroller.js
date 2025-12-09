const { validationResult } = require("express-validator");
const { check } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getlogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        currentpage: 'Login', isLoggedIn: false,
        errors: [],
        oldInput: { email:''},
        user:{}
    });
}

exports.postlogin = async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user=await User.findOne({email});
    if (!user) {
        return res.status(401).render('auth/login', {
            pageTitle: 'Login',
            currentpage: 'Login',
            isLoggedIn: false,
            errors: ['User does not exit'],
            oldInput: { email },
            user:{}
        });
    }

    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).render('auth/login', {
            pageTitle: 'Login',
            currentpage: 'Login',
            isLoggedIn: false,
            errors: ['Invalid password'],
            oldInput: { email },
            user:{}
        });
    }

    // res.cookie("isLoggedIn", true);
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect('/');
}
exports.postlogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
}
exports.getsignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        currentpage: 'SignUp', isLoggedIn: false, erros: []
        , oldInput: {
            firstname: '',
            lastname: '',
            email: '',
            Usertype: '',
        },
        user:{}
    });
}
exports.postsignup = [
    check('firstname')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long.')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('First name must contain only letters.'),

    check('lastname')
        .matches(/^[A-Za-z\s]*$/)
        .withMessage('last name must contain only alphabets.'),

    check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),

    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number.')
        .matches(/[\W_]/)
        .withMessage('Password must contain at least one special character.')
        .trim(),

    //custom validator to confirm password
    check('Confirmpassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    check('Usertype')
        .notEmpty()
        .withMessage('User type is required.')
        .isIn(['guest', 'host'])
        .withMessage('Please select a valid user type.'),

    check('terms')
        .notEmpty()
        .withMessage('You must accept the terms and conditions.')
        .isIn(['on'])
        .custom((value) => {
            if (value !== 'on') {
                throw new Error('You must accept the terms and conditions.');
            }
            return true;
        }),

    //final middleqare to handle the request
    (req, res, next) => {
        const { firstname, lastname, email, password, Usertype } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                pageTitle: 'Sign Up',
                currentpage: 'SignUp',
                isLoggedIn: false,
                errors: errors.array().map(err => err.msg),
                oldInput: { firstname, lastname, email, Usertype },
                user:{}
            });
        }

        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new User({ firstname, lastname, email, password: hashedPassword, Usertype });
            return user.save();
        })
            .then(() => {
                res.redirect('/login');
            }).catch((err) => {
                return res.status(422).render('auth/signup', {
                    pageTitle: 'Sign Up',
                    currentpage: 'SignUp',
                    isLoggedIn: false,
                    errors: errors.array().map(err => err.msg),
                    oldInput: { firstname, lastname, email, Usertype },
                    user:{}
                });
            });
    }]