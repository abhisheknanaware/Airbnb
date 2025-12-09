const express = require('express');
const authrouter = express.Router();
const  rootdir= require('../utils/path_util');
const  authcontroller= require('../controllers/authcontroller');

authrouter.get("/login",authcontroller.getlogin);
authrouter.post("/login",authcontroller.postlogin);
authrouter.post("/logout",authcontroller.postlogout);
authrouter.get("/signup",authcontroller.getsignup);
authrouter.post("/signup",authcontroller.postsignup);
exports.authrouter = authrouter;