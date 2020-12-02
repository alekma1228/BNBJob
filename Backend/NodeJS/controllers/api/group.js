var express = require('express'),
    router = express.Router(),
    async = require("async")

    groupModel = require('../../models/Group'),
    groupStoryModel = require('../../models/Group_Story')
    userModel = require('../../models/User'),
    likeModel = require('../../models/Like'),
    geolocation = require('../../helpers/geolocation')

router.post('/', function (req, res, next) {
    userModel
    .findOne({ remember_token: req.body.token })
    .exec()
    .then(currentUser => {
        if (currentUser) {
            groupModel({
                title: req.body.title,
                description: req.body.description,
                location: [req.body.latitude, req.body.longitude],
                activity_type: req.body.activity_type,
                number_of_participants: req.body.number_of_participants,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                own: currentUser._id,
                avatar: req.body.avatar,
                video: req.body.video
            })
            .save()
            .then(newGroup => {
                console.log(newGroup)
                res.json({ success: true, data: newGroup })
            })
            .catch(err => {
                console.error(err)
                res.json({ success: false, error: err })
            })                
        } else {
            res.json({success: false, error: 'unauthorized request'})
        }        
    })
    .catch(err => {
        console.error(err)
        res.json({ success: false, error: err })
    })
})

/* apply: 1 */
router.post('/:id/apply', function (req, res, next) {
    userModel
    .findOne({ remember_token: req.body.token })
    .exec()
    .then(currentUser => {
        if (currentUser) {
            likeModel
            .find({ $and: [{ from: currentUser._id }, { toGroup: req.params.id }] }, function(err, docs) {
                if (err) {
                    res.json({success: false, error: err})
                } else {
                    if (docs.length == 0) {
                        groupStoryModel
                        (
                            {
                                from: currentUser._id, toGroup: req.params.id, status: 0
                            }
                        )
                        .save()
                        .then(groupStory => {
                            console.log(groupStory)
                            res.json({ success: true })
                        })
                        .catch(err => {
                            console.error(err)
                            res.json({ success: false, error: err })
                        })                        
                    } else {
                        res.json({success: false, error: 'already applied'})
                    }
                }
            })           
        } else {
            res.json({success: false, error: 'unauthorized request'})
        }        
    })
    .catch(err => {
        console.error(err)
        res.json({ success: false, error: err })
    })
})

router.get('/filter_params', function (req, res, next) {

    if (req.query.is_participant === 'true') {
        userModel
        .findOne({remember_token: req.query.token})
        .exec(function(err, currentUser) {
            if (err) {
                res.json({success: false, error: err})
            } else {
                if (currentUser) {
                    groupModel
                    .find({own: {$ne : currentUser._id}})
                    .exec(function (err, groups) {
                        if (err) {
                            console.error(err)
                            res.json({ success: false, error: err });
                        } else {
                            res.json({ success: true, data: groups })
                        }
                    })
                } else {
                    res.json({success: false, error: 'unauthorized request'})
                }
            }
        })
    } else {
        userModel
        .findOne({remember_token: req.query.token})
        .exec(function(err, currentUser) {
            if (err) {
                res.json({success: false, error: err})
            } else {
                if (currentUser) {
                    groupModel
                    .find({own: currentUser._id})
                    .exec(function (err, groups) {
                        if (err) {
                            console.error(err)
                            res.json({ success: false, error: err });
                        } else {
                            res.json({ success: true, data: groups })
                        }
                    })
                } else {
                    res.json({success: false, error: 'unauthorized request'})
                }            
            }
        })
    }
})

router.post('/:id/update', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                groupModel
                .findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    activity_type: req.body.activity_type,
                    description: req.body.description,
                    start_time: req.body.start_time,
                    end_time: req.end_time,
                    number_of_participants: req.body.number_of_participants,
                    avatar: req.body.avatar, 
                    video: req.body.video                   
                })
                .exec(function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        req.json({success: true, data: doc})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }            
        }
    })
})

module.exports = router