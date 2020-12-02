var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db'),
    Float = require('mongoose-float').loadType(mongoose)
    
db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({
    purchas_type: {
        type: Number,
    },
    price: {
        type: Float,
    },
    profile_pictures_number: {
        type: Number,
    },
    group_story_video_size: {
        type: Number,
    },
    group_story_video_duration: {
        type: Number,
    },
    video_cv_size: {
        type: Number,
    },
    video_cv_duration: {
        type: Number,
    },
    allowed_company_details: {
        type: Boolean,
    },
    allowed_chat_with_Employer_begining: {
        type: Boolean,
    },
    is_candidate: {
        type: Boolean,
    },
    offer_video_size: {
        type: Number,
    },
    offer_video_duration: {
        type: Number,
    },
    offer_duration: {
        type: Number,
    },
    offer_pictures_number: {
        type: Number,
    },
    created_at : {
        type: Date,
        "default": Date.now
    },
    updated_at : {
        type: Date,
        "default": Date.now
    },
    del_flg : {
        type: Boolean
    }
})

module.exports = mongoose.model('Purchase', Schema)