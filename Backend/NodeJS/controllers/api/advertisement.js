var express = require('express'),
    router = express.Router(),
    async = require("async")

var advertisementModel = require('../../models/Advertisement'),
    userModel = require('../../models/User'),
    geolocation = require('../../helpers/geolocation'),
    marketplaceModel = require('../../models/Marketplace')

router.post('/', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                advertisementModel(
                    {
                        title: req.body.title,
                        price: req.body.price,
                        article_category: req.body.article_category,
                        description: req.body.description,
                        own: currentUser._id,
                        type: req.body.type,    // 0: article, 1: rent_house
                        rent_house_type: req.body.rent_house_type,
                        number_of_rooms: req.body.number_of_rooms,
                        house_of_squares: req.body.house_of_squares,
                        accepted_animals: req.body.accepted_animals,
                        avatar: req.body.avatar,
                        video: req.body.video
                    }
                )
                .save(function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        res.json({success: true, data: doc})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }            
        }
    })
})

router.get('/', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                advertisementModel
                .find({}, function(err, docs) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        res.json({success: true, data: docs})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }            
        }
    })
})

router.post('/:id/like', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                marketplaceModel
                .find({$and: [{to: req.params.id}, {from: currentUser._id}, {status: 0}]}, function(err, docs) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        if (docs.length == 0) {
                            likeModel(
                                {
                                    from: currentUser._id,
                                    to: req.params.id,
                                    status: 0    // 0: like, 1: dislike
                                }
                            )
                            .save(function(err, doc) {
                                if (err) {
                                    res.json({success: false, error: err})
                                } else {
                                    res.json({success: true, data: doc})
                                }
                            })
                        } else {
                            res.json({success: false, error: 'already liked'})
                        }
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/:id/dislike', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                marketplaceModel
                .findOneAndUpdate({$and: [{to: req.params.id}, {from: currentUser._id}]}, {status: 1}, function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                       res.json({success: true, data: doc})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
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
                advertisementModel
                .findByIdAndUpdate(req.params.id, {
                    type: req.body.first_name,
                    title: req.body.last_name, 
                    description: req.body.avatar,
                    price: req.body.video,
                    article_category: req.article_category,
                    rent_house_type: req.body.rent_house_type,
                    number_of_rooms: req.body.number_of_rooms,
                    house_of_squares: req.body.house_of_squares,                    
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