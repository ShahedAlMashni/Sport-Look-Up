var express = require('express');
var router = express.Router();
var Facility=require('../models/facility-model');
var middleware=require('../middleware/middle.js');
//var seedDB=require('../seeds');
var multer = require('multer');

var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'docfhowvv',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

});
router.get('/', function(req, res, next) {
//get all facilities from db
    Facility.find({},function (err,facilities) {
        if(err){
            console.log('error in get');
            console.log(err);
        }
        else{
            res.render('facilities.ejs', { facilities: facilities });
        }
    });
});
// router.get('/try',function (req,res) {
//     res.render('try2.ejs');
// });

// add new facility
router.post('/',middleware.isLoggedIn, upload.single('image'),function (req,res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the facility object under image property
        req.body.facility.image=result.secure_url;
        // add image's public_id to campground object
        req.body.facility.imageId = result.public_id;
        req.body.facility.author = {
            id: req.user._id,
            username: req.user.username,
        };
        Facility.create(req.body.facility, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(newlyCreated);
                res.redirect('/facilities/'+newlyCreated._id);
            }
        });
    });
});
router.get('/new',middleware.isLoggedIn,function (req,res) {
    res.render('newFacility.ejs');
});


//show more info about one facility
router.get('/:id',function (req,res) {
    //find the facility with ID
    Facility.findById(req.params.id).populate("comments").exec(function (err,foundFacility) {
        if(err || !foundFacility){
            req.flash("error","Facility not found");
            res.redirect("back");
        }
        else{
            console.log(foundFacility);
            res.render("showFacility.ejs.ejs",{facility: foundFacility});
        }
    });
});

// edit facilities
router.get('/:id/edit',middleware.checkFacilityOwnership,function (req,res) {
    Facility.findById(req.params.id,function (err,foundFacility) {
        if(err){
            res.redirect('/facilities');
        }
        else{
            req.flash("success","facility edited successfully");
            res.render('editFacility.ejs.ejs',{facility: foundFacility});
        }
    });
});


//update facilities
router.put('/:id',middleware.checkFacilityOwnership,upload.single('image'),function (req,res) {
    Facility.findById(req.params.id, async function(err, facility){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(facility.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    facility.imageId = result.public_id;
                    facility.image = result.secure_url;
                } catch(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            facility.name = req.body.name;
            facility.description = req.body.description;
            facility.price=req.body.price;
            facility.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/facilities/" + facility._id);
        }
    });

});


// destroy facility route
router.delete('/:id',middleware.checkFacilityOwnership,function (req,res) {
    Facility.findById(req.params.id, async function(err, facility) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(facility.imageId);
            facility.remove();
            req.flash('success', 'Facility deleted successfully!');
            res.redirect('/facilities');
        } catch(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
    });
});

module.exports = router;
