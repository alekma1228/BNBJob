var express = require('express'),
    router = express.Router()

var activityTypeModel = require('../../../models/common/Activity_Type'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    activityTypeModel
    .find({})
    .exec()
    .then(activity_types => {
        console.log(activity_types)
        res.json({success: true, data: activity_types})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router