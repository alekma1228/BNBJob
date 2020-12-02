var express = require('express'),
    router = express.Router()

var degreeModel = require('../../../models/common/Degree'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    degreeModel
    .find({})
    .exec()
    .then(degrees => {
        console.log(degrees)
        res.json({success: true, data: degrees})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router