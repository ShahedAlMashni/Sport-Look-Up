// all middleware
var Facility=require('../models/facility-model');
var Comment=require('../models/comment-model');
var middlewareObj={};
middlewareObj.checkFacilityOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Facility.findById(req.params.id,function (err,foundFacility) {
            if(err || !foundFacility){
                req.flash("error","Facility not found")
                res.redirect("back");
            }
            else{
                if(foundFacility.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function (err,foundComment) {
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first");
    res.redirect('/login');
}

module.exports = middlewareObj;