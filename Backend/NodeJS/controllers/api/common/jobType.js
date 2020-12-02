var express = require('express'),
    router = express.Router()

var jobTypeModel = require('../../../models/common/Job_Type'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    jobTypeModel
    .find({})
    .exec()
    .then(jobTypes => {
        console.log(jobTypes)
        res.json({success: true, data: jobTypes})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router