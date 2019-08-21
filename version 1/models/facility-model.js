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
// var campgrounds=[
//     {name: "salmon Creek", image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014459df1c979a2e9b5_340.jpg"},
//     {name: "hello ", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f8c071a7e8b1b8_340.jpg"},
//     {name: "hello ", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f8c071a7e8b1b8_340.jpg"},
//
// Campground.create(
// {
//     name: "Wadi rum",
//     image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014459df1c979a2e9b5_340.jpg",
//     description: "This is a huge desert camp,no bathrooms. No water. Beautiful scenes"
//     price: 5JD
//
// },
// function (err,campground) {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(campground);
//     }
// }
// );