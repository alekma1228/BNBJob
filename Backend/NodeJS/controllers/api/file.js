var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    multer  =   require('multer'),
    fileModel = require('../../models/File'),
    userModel = require('../../models/User'),
    purchasModel = require('../../models/Purchas')

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/assets/')
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString().replace(':', '-').replace(':', '-') + file.originalname)
    }
})

var upload = multer({ storage : storage}).single('file')

router.post('/upload', function(req, res) {
    userModel
    .findOne({remember_token: req.body.token})
    .populate('purchas')
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                if (req.body.file_category == 0) {
                    fileModel
                    .find({$and: [{own: currentUser._id}, {file_category: req.body.file_category}]})
                    .exec(function(err, docs) {
                        if (err) {
                            res.json({success: false, error: err})
                        } else {
                            if (docs.length > currentUser.purchas.profile_pictures_number) {
                                res.json({success: false, data: "can't upload photos."})
                            } else {
                                upload(req, res, function(err) {
                                    if(err) {
                                        return res.end("Error uploading file.")
                                    }

                                    fileModel
                                    .findOne({})
                                    .limit(1)
                                    .sort({ $natural : -1 })
                                    .exec(function(err, doc) {
                                        if (err) {
                                            res.json({success: false, error: err})
                                        } else {
                                            res.json({success: true, data: doc})
                                        }
                                    })                                    
                                })
                            }
                        }
                    })
                }

                if (req.body.file_category == 1) {

                }

                if (req.body.file_category == 2) {

                }

                if (req.body.file_category == 3) {

                }                
                
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

module.exports = router