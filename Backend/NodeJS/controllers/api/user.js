var express = require('express'),
    router = express.Router(),
    async = require('async'),

    userModel = require('../../models/User'),
    friendModel = require('../../models/Friend'),
    geolocation = require('../../helpers/geolocation'),
    groupModel = require('../../models/Group'),
    advertisementModel = require('../../models/Advertisement');

router.get(':id/profile', function(req, res, next) {
    userModel
    .findOne({_id: req.params.id})
    .exec()
    .then(doc => {
        res.json({success: true, data: doc})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})   
    })
})

router.get('/candidate_count', function(req, res, next) {
    userModel
    .find({is_candidate: true})
    .exec(function(err, users) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            res.json({success: true, data: users.length})
        }
    })
})

router.post(':id/update', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                userModel
                .findByIdAndUpdate(req.params.id, {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name, 
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

router.get('/:id/offers', function(req, res, next) {
    offerModel
    .find({own: req.params.id})
    .exec(function(err, offers) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            console.log(offers)
            res.json({success: true, data: offers})
        }
    })
})

router.get('/:id/groups', function(req, res, next) {
    groupModel
    .find({own: req.params.id})
    .exec(function(err, offers) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            console.log(offers)
            res.json({success: true, data: offers})
        }
    })
})

router.get('/:id/advertisements', function(req, res, next) {
    advertisementModel
    .find({own: req.params.id})
    .exec(function(err, offers) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            console.log(offers)
            res.json({success: true, data: offers})
        }
    })
})



router.get('/search', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                userModel
                .find({})
                .exec(function (err, users) {
                    if (err) {
                        console.error(err)
                        res.json({success: false, error: err})
                    } else {
                        var filteredUsers = []
                        console.log(users.length)
                        async.forEach(users, function (user, callback) {
                            var userCoord  = {
                                latitude: currentUser.location.toObject()[0],
                                longitude: currentUser.location.toObject()[1]
                            }
    
                            var offerCoord = {
                                latitude: user.location.toObject()[0],
                                longitude: user.location.toObject()[1]
                            }    

                            var dist = geolocation.distance(userCoord, offerCoord)

                            var status
                            if (req.query.user_type == 0) {
                                status = true;
                            }                            
                            
                            if ((user.is_candidate == status) || (dist < req.query.distance)) {
                                filteredUsers.push(user)
                            }
                        })
                        res.json({success: true, data: filteredUsers})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }            
        }
    })
})

router.get('/filter_params', function(req, res, next) {
    console.log(req.query.price, req.query.experience, req.query.job_category_id, req.query.latitude, req.query.longitude, req.query.distance, req.query.country_code)

    userModel
    .find({ $and:  [
        { price: req.query.price },
        { job_category: req.query.job_category},
        { country_code: req.query.country_code},
    ]})
    .exec(function (err, users) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            var userObjs = []
            async.forEach(users, function (user, callback) {
                var userCoord  = {
                    latitude: user.location.toObject()[0],
                    longitude: user.location.toObject()[1]
                }

                var otherCoord = {
                    latitude: parseFloat(req.query.latitude),
                    longitude: parseFloat(req.query.longitude)
                }

                var dist = geolocation.distance(userCoord, otherCoord)
                if (dist < req.query.distance) {
                    filteredOffers.push(otherOffer)
                }
            }, function (err) {
            })
            res.json({success: true, data: userObjs})
        }
    })
})

router.post('/job_category', function(req, res, next) {
    console.log(req.body.job_category_id, req.body.job_category_group_id)

    userModel
    .findOneAndUpdate({remember_token: req.body.token}, {job_category: req.body.job_category_id, job_category_group: req.body.job_category_group_id})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                res.json({success: true, data: 'updated in successfully'})
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.get('/', function(req, res, next) {
    console.log(req.query.token)
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {

                userModel
                .find({_id: {$ne : currentUser._id}})
                .exec(function(err, users) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        var objects = []
                        console.log(users)
                        async.forEach(users, function (user, callback) {
                            var friendObjects = user.friends
                            user = user.toObject()
                            user.is_friend = false

                            async.forEach(friendObjects, function(friendObject, callback) {
                                if (friendObject.toString() == currentUser._id) {
                                    user.is_friend = true
                                }
                            })

                            objects.push(user)
                        })
                        res.json({success: true, data: objects})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

module.exports = router