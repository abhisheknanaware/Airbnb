const mongoose = require("mongoose");
const favourite = require("./favourite");

const homeSchema=new mongoose.Schema({
    housename:{type:String , required:true},
    price:{type:Number , required:true},
    location:{type:String , required:true},
    image_url:{type:String , required:true},
    rating:{type:Number , required:true}
});
homeSchema.pre('findOneAndDelete',async function(next){
    console.log("come to pre hook while deleting home")
    const homeid=this.getQuery()._id;
    await favourite.deleteMany({houseid:homeid});
    next();
});

module.exports=mongoose.model("Home",homeSchema);