var mongoose=require('mongoose');
var facilitySchema=   new mongoose.Schema({
    name: String,
    price: String,
    image:String,
    imageId: String,
    description : String,
    location: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var Campground= mongoose.model('Facility',facilitySchema);
module.exports=Campground;
