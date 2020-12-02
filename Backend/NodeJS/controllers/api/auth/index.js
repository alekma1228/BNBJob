var express = require('express'),
    router = express.Router(),
    Nexmo = require('nexmo'),
    config = require('../../../config'),
    hash = require('../../../helpers/hash')

var userModel = require('../../../models/User'),
    fileModel = require('../../../models/File'),
    purchasModel = require('../../../models/Purchas')

var nexmo = new Nexmo({
    apiKey: config.nexmoAPIKey,
    apiSecret: config.nexmoAPISecret
  })

var verificationCode = 1234

router.post('/signin', function(req, res, next) {
    userModel
    .findOne( {$and: [ { email: req.body.email }, { password: hash.random(req.body.password) } ]} )
    .exec()
    .then(user => {
        console.log(user)
        res.json({success: true, data: user})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

router.post('/signout', function(req, res, next) {
    userModel
    .findOneAndUpdate({remember_token: req.body.token}, {remember_token: hash.uuid()})
    .exec()
    .then(user => {
        if (user == null) {
            res.json({success: false, error: "Signout Failed"})
        } {
            res.json({success: true, message: "Device Token is removed successfully"})
        }
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

router.post('/signup', function(req, res, next) {
    if (verificationCode == req.body.verification_code) {
        userModel
        .find({email: req.body.email})
        .exec()
        .then(users => {
            if (users.length == 0) {                
                userModel({
                    email: req.body.email,
                    password: hash.random(req.body.password),
                    phone_region: req.body.phone_region,
                    phone_number: req.body.phone_number,
                    is_candidate: req.body.is_candidate,
                    institution_name: req.body.institution_name,
                    siret_number: req.body.siret_number,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    remember_token: hash.uuid(),
                    recruiter_type: req.body.recruiter_type
                }).save()
                .then(newUser => {
                    console.log(newUser)                
                    purchasModel
                    .findOne({ $and: [{is_candidate: req.body.is_candidate}, {purchas_type: 0}]})
                    .exec(function(err, doc) {
                        if (err) {
                            res.json({success: false, error:err})
                        } else {
                            console.log(doc)
                            userModel
                            .findOneAndUpdate({email: newUser.email}, {purchas: doc._id}, function(err, doc) {
                                if (err) {
                                    res.json({success: false, error:err})
                                } else {
                                    res.json({success: true, data: doc})
                                }
                            })
                        }
                    })
                })
                .catch(err => {
                    console.error(err)
                    res.json({success: false, error: err})
                })
            } else {
                res.json({success: false, error: "The email address is already in use by another user."})
            }
        })
        .catch(err => {
            console.error(err)
            res.json({success: false, error: err})
        })
    } else {
        res.json({success: false, error: 'Verification code is invalid'})
    }
})

router.post('/request_phone_verification', function(req, res, next) {
    verificationCode = Math.floor(1000 + Math.random() * 9000)
    var phone = req.body.phone_region + req.body.phone_number

    var options = {type: 'unicode'}
    var from = 'BNB'
    var to = phone
    var text = verificationCode
    
    console.log(phone, verificationCode);
    nexmo.message.sendSms(from, to, text, options, (err, data) => {
        if (err) {
            console.error(err)
            res.json({success: false, error: err})
        } else {
            console.log(data)
            if (data.status == '0') {
            res.json({success: true, data: data})
            } else {
                res.json({success: false, data: data})
            }
        }
    })

    // nexmo.verify.request({number: phone, brand: from}, (err, result) => {
    //     if(err) {
    //       //res.sendStatus(500);
    //       res.json({success: false, error: err})
    //     } else {
    //       console.log(result);
    //       let requestId = result.request_id;
    //       if(result.status == '0') {
    //         res.json({requestId: requestId});
    //       } else {
    //         //res.status(401).send(result.error_text);
    //         res.json({message: result.error_text, requestId: requestId});
    //       }
    //     }
    //   });
})

router.post('/facebook_user', function(req, res, next) {
    userModel
    .find({email: req.body.email})
    .exec()
    .then(users => {
        if (users.length == 0) {
            res.json({registered_user: false})
        } else {
            res.json({registered_user: true})
        }
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router