var express = require('express'),
    router = express.Router()

var skillModel = require('../../../models/Skill'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    skillModel
    .find({})
    .exec()
    .then(skills => {
        console.log(skills)
        res.json({success: true, data: skills})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router