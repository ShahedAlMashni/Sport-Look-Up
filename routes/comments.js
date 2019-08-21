var express = require('express');
var router = express.Router({mergeParams: true});
var middleware=require('../middleware/middle');
var Facility=require('../models/facility-model');
var Comment=require('../models/comment-model');
//var seedDB=require('../seeds');

//seedDB();

router.post('/',middleware.isLoggedIn,function (req,res) {
    Facility.findById(req.params.id,function(err,facility){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    // add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //  console.log(req.user.username);
                    comment.save();
                    facility.comments.push(comment);
                    facility.save();
                    var url="/facilities/"+req.params.id;
                    res.redirect(url);
                }
            });
        }
    });
});
//edit commnet route

router.get('/:comment_id/edit',middleware.checkCommentOwnership,function (req,res) {
    Facility.findById(req.params.id,function (err, foundFacility) {
        if(err || !foundFacility){
            req.flash("error","No facility found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id,function (err,foundComment) {
            if(err){
                res.redirect("back");
            }
            else{
                res.render('editComment.ejs',{facility_id: req.params.id,comment: foundComment});
            }
        });
    });
});

//update comment route
router.put('/:comment_id',middleware.checkCommentOwnership,function (req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedComment) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/facilities/" + req.params.id );
        }
    }) ;
});

//destroy comment route
router.delete('/:comment_id',middleware.checkCommentOwnership,function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id,function (err) {
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted");
            res.redirect("/facilities/" + req.params.id);
        }
    })
});

module.exports = router;
