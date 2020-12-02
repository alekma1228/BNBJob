var express = require('express'),
    router = express.Router()

var jobCategoryModel = require('../../../models/common/Job_Category'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec()
    .then(currentUser => {
        console.log(currentUser)
        if (currentUser) {
            jobCategoryModel
            .find({})
            .exec()
            .then(jobCategories => {
                console.log(jobCategories)
                res.json({success: true, data: jobCategories})
            })
            .catch(err => {
                console.error(err)
                res.json({success: false, error: err})
            })
        } else {
            res.json({success: true, error: "Unauthorized User"})
        }
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router