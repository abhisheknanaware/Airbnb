const moongoose = require('mongoose');

const FavouriteSchema=new moongoose.Schema({
    houseid:{type:moongoose.Schema.Types.ObjectId,
        ref:'Home',
        required:true,
        unique:true
    }
});
module.exports=moongoose.model('Favourite',FavouriteSchema);