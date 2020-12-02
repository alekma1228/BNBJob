var express = require('express'),
    router = express.Router()

var rentHouseTypeModel = require('../../../models/common/Rent_House_Type'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    rentHouseTypeModel
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