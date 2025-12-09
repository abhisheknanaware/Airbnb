const mongoose = require("mongoose");
const Home = require("./home");

const userSchema=new mongoose.Schema({
    firstname:{type:String , required:true},
    lastname:{type:String , required:false},
    email:{type:String , required:true , unique:true},
    password:{type:String , required:true},
    Usertype:{type:String , required:true , enum:['guest','host'],default:'guest'},
    favourites:[{type:mongoose.Schema.Types.ObjectId,
        ref:'Home'}]
});

module.exports=mongoose.model("User",userSchema);