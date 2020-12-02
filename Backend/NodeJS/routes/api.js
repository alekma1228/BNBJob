var authController = require('../controllers/api/auth'),
    userController = require('../controllers/api/user'),
    offerController = require('../controllers/api/offer'),
    testController = require('../controllers'),
    fileController = require('../controllers/api/file'),
    chatController = require('../controllers/api/chat'),
    groupController = require('../controllers/api/group'),
    friendController = require('../controllers/api/friend'),

    advertisementController = require('../controllers/api/advertisement'),
    jobCategoryController = require('../controllers/api/common/jobCategory'),
    jobCategoryGroupController = require('../controllers/api/common/jobCategoryGroup'),
    jobTypeController = require('../controllers/api/common/jobType'),
    degreeController = require('../controllers/api/common/degree'),
    languageController = require('../controllers/api/common/language'),
    experienceController = require('../controllers/api/common/experience'),
    skillController = require('../controllers/api/common/skill'),
    activityTypeController = require('../controllers/api/common/activityType'),
    articleCategoryController = require('../controllers/api/common/articleCategory'),
    rentHouseTypeController = require('../controllers/api/common/rentHouseType'),
    advantageController = require('../controllers/api/common/advantage'),
    recruiterCategoryController = require('../controllers/api/common/recruiterCategory')

module.exports.init = function (app) {
    app.use('/api/test', testController)
    app.use('/api', authController)
    app.use('/api/users', userController)
    app.use('/api/offers', offerController)
    app.use('/api/groups', groupController)
    app.use('/api/advertisements', advertisementController)
    app.use('/api/files', fileController)
    app.use('/api/chats', chatController)
    app.use('/api/friends', friendController)

    app.use('/api/job_types', fileController)
    app.use('/api/job_categories', jobCategoryController)
    app.use('/api/job_category_groups', jobCategoryGroupController)
    app.use('/api/job_types', jobTypeController)
    app.use('/api/degrees', degreeController)
    app.use('/api/languages', languageController)
    app.use('/api/skills', skillController)
    app.use('/api/experiences', experienceController)
    app.use('/api/activity_types', activityTypeController)
    app.use('/api/article_categories', articleCategoryController)
    app.use('/api/rent_house_types', rentHouseTypeController)
    app.use('/api/advantages', advantageController)
    app.use('/api/recruiterCategories', recruiterCategoryController)
}