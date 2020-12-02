var express = require('express'),
    router = express.Router()

var recruitreCategoryModel = require('../../../models/common/Recruiter_Category'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    recruitreCategoryModel
    .find({})
    .exec()
    .then(docs => {
        res.json({success: true, data: docs})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router