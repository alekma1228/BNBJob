var express = require('express'),
    router = express.Router()

var articleCategoryModel = require('../../../models/common/Article_Category'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    articleCategoryModel
    .find({})
    .exec()
    .then(articleCategories => {
        console.log(articleCategories)
        res.json({success: true, data: articleCategories})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

module.exports = router