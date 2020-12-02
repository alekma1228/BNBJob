var express = require('express'),
    router = express.Router()

var languageModel = require('../../../models/common/Language'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    languageModel
    .find({})
    .exec()
    .then(languages => {
        console.log(languages)
        res.json({success: true, data: languages})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router