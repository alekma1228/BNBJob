var express = require('express'),
    router = express.Router()

var jobCategoryGroupModel = require('../../../models/common/Job_Category_Group'),
    jobCategoryModel = require('../../../models/common/Job_Category'),
    userModel = require('../../../models/User')

router.get('/', function(req, res, next) {
    jobCategoryGroupModel
    .find({})
    .exec()
    .then(jobCategoryGroups => {
        console.log(jobCategoryGroups)
        res.json({success: true, data: jobCategoryGroups})
    })
    .catch(err => {
        console.error(err)
        res.json({success: false, error: err})
    })
})

router.get('/:id/job_categories', function(req, res, next) {
    jobCategoryModel
    .find({job_category_group: req.params.id})
    .exec()
    .then(jobCategories => {
        console.log(jobCategories)
                res.json({success: true, data: jobCategories})
            })
            .catch(err => {
                console.error(err)
                res.json({success: false, error: err})
            })
})

module.exports = router