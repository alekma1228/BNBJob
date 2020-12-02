var express = require('express'),
    router = express.Router()

var advantageModel = require('../../../models/common/Advantage'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    advantageModel
    .find({})
    .exec()
    .then(doc => {
        console.log(doc)
        res.json({success: true, data: doc})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router