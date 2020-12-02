var express = require('express'),
    router = express.Router(),
    async = require("async")

var offerModel = require('../../models/Offer'),
    userModel = require('../../models/User'),
    geolocation = require('../../helpers/geolocation'),
    fileModel = require('../../models/File'),
    contractModel = require('../../models/Contract')

// router.get('/search', function(req, res, next) {
//     userModel
//     .findOne({remember_token: req.query.token})
//     .exec(function(err, user) {
//         if (err) {
//             console.error(err)
//             res.json({success: false, error: err})
//         } else {
//             var date = new Date();
//             date.setDate(date.getDate() - 1)
//             offerModel
//             .find(
//                 {
//                     $or: [{"created_at": {$gt: yesterday}}]
//                 }
//             )
//             .populate('own')
//             .exec(function (err, otherOffers) {
//                 if (err) {
//                     console.error(err)
//                     res.json({success: false, error: err})
//                 } else {
//                     var filteredOffers = []
//                     async.forEach(otherOffers, function (otherOffer, callback) {
//                         var userCoord  = {
//                             latitude: user.location.toObject()[0],
//                             longitude: user.location.toObject()[1]
//                         }

//                         var offerCoord = {
//                             latitude: otherOffer.own.location.toObject()[0],
//                             longitude: otherOffer.own.location.toObject()[1]
//                         }

//                         var dist = geolocation.distance(userCoord, offerCoord)

//                         if (req.query.distance) {
//                             if ((dist < req.query.distance) || (otherOffer.own.country_code == req.query.country_code)) {
//                                 filteredOffers.push(otherOffer)
//                             }
//                         } else {
//                             filteredOffers.push(otherOffer)
//                         }
//                     }, function (err) {
//                         cb(err, offerObjs)
//                     })
//                     res.json({success: true, data: filteredOffers})
//                 }
//             })
//         }
//     })
// })

router.get('/around', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                offerModel
                .findOne({})
                .populate('own')
                .exec(function (err, otherOffers) {
                    if (err) {
                        console.error(err)
                        res.json({success: false, error: err})
                    } else {
                        var filteredOffers = []
                        async.forEach(otherOffers, function (otherOffer, callback) {
                            var userCoord  = {
                                latitude: currentUser.location.toObject()[0],
                                longitude: currentUser.location.toObject()[1]
                            }
    
                            var offerCoord = {
                                latitude: otherOffer.own.location.toObject()[0],
                                longitude: otherOffer.own.location.toObject()[1]
                            }

                            console.log(userCoord, offerCoord)
    
                            var dist = geolocation.distance(userCoord, offerCoord)
    
                            if (req.query.distance) {
                                if (dist < req.query.distance) {
                                    filteredOffers.push(otherOffer)
                                }
                            }
                        }, function (err) {
                            cb(err, offerObjs)
                        })
                        res.json({success: true, data: filteredOffers})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }            
        }
    })
})

router.get('/today', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                var date = new Date();
                yesterday = date.setDate(date.getDate() - 1)
                offerModel
                .find({created_at: { $gt: yesterday}})
                .exec(function(err, docs) {
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

// router.get('/live', function(req, res, next) {
//     userModel
//     .findOne({remember_token: req.query.token})
//     .exec(function(err, currentUser) {
//         if (err) {
//             console.error(err)
//             res.json({success: false, error: err})
//         } else {
//             if (currentUser) {
//                 offerModel
//                 .find({})
//                 .populate('to')
//                 .exec(function(err, docs) {
//                     if (err) {
//                         res.json({success: false, error: err})
//                     } else {
//                         res.json({success: true, data: docs})
//                     }
//                 })
//             } else {
//                 res.json({success: false, error: 'unauthorized request'})
//             }
//         }
//     })
// })

router.get('/country', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                offerModel
                .find({country_code: req.query.country_code})
                .populate('own')
                .exec(function(err, docs) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        var filteredOffers = []
                        async.forEach(docs, function (doc, callback) {                          
                            if (req.query.country_code == doc.country_code) {
                                filteredOffers.push(otherOffer)
                            }
                        }, function (err) {
                            cb(err, filteredOffers)
                        })
                        res.json({success: true, data: filteredOffers})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.get('/filter_params', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                offerModel
                .find({})
                .populate('own')
                .exec(function (err, offers) {
                    if (err) {
                        console.error(err)
                        res.json({success: false, error: err})
                    } else {
                        var offerObjs = []
                        async.forEach(offers, function (offer, callback) {
                            var offerCoord  = {
                                latitude: offer.own.location.toObject()[0],
                                longitude: offer.own.location.toObject()[1]
                            }
            
                            var otherCoord = {
                                latitude: parseFloat(req.query.latitude),
                                longitude: parseFloat(req.query.latitude)
                            }
            
                            var dist = geolocation.distance(otherCoord, offerCoord)
            
                            if ((offer.own.country_code == req.query.country_code) && (offer.own.job_type == req.query.job_type) && (offer.own.job_category == req.query.job_category) && (dist < req.query.distance)) {
                                offerObjs.push(offer)
                            }
                        }, function (err) {
                            cb(err, offerObjs)
                        })
                        res.json({success: true, data: offerObjs})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })    
})

router.post('/', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec()
    .then(currentUser => {
        offerModel({
            description: req.body.description,
            job_minute: req.body.job_minute,
            job_type: req.body.job_type,
            price: req.body.price,
            experience: req.body.experience,
            advantage: req.body.advantage,
            skill: req.body.skill,
            degree: req.body.degree,
            language: req.body.language,
            others: req.body.others,
            own: currentUser._id,
            title: req.body.title,
            avatar: req.body.avatar,
            video: req.body.video
        })
        .save()
        .then(doc => {
            console.log(doc)

            //file check, save, premium
            
            res.json({success: true, data: doc})
        })
        .catch(err => {
            console.error(err)
            res.json({success: false, error: err})
        })
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

router.get('/count', function(req, res, next) {
    offerModel
    .find({})
    .exec(function(err, offers) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            res.json({success: true, data: offers.length})
        }
    })
})

/* 0: applied */
router.post('/:id/apply', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                contractModel
                .findOne( {$and: [ { from: currentUser._id }, { to: req.params.id } ]})
                .exec(function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        if (doc) {
                            console.log(doc)
                            res.json({success: false, error: "already applied"})                           
                        } else {
                            contractModel(
                                {
                                    from: currentUser._id,
                                    to: req.params.id,
                                    status: 0
                                }
                            )
                            .save(function(err, doc) {
                                if (err) {
                                    res.json({success: false, error: err})
                                } else {
                                    console.log(doc)
                                    res.json({success: true})
                                }
                            })                 
                        }
                    }
                })            
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }            
        }
    })
})

router.post('/:id/accept', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                contractModel
                .findOneAndUpdate( {$and: [ { from: currentUser._id }, { toOffer: req.params.id } ]}, {status: 1})
                .exec(function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        res.json({success: true})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/:id/decline', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                contractModel
                .findOneAndUpdate( {$and: [ { from: currentUser._id }, { toOffer: req.params.id } ]}, {status: 2})
                .exec(function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        res.json({success: true})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

module.exports = router