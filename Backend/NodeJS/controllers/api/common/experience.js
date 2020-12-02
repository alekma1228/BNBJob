var express = require('express'),
    router = express.Router()

var experienceModel = require('../../../models/common/Experience'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    experienceModel
    .find({})
    .exec()
    .then(experiences => {
        console.log(experiences)
        res.json({success: true, data: experiences})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router