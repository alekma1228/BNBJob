var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db'),
    Float = require('mongoose-float').loadType(mongoose)

db.connection(mongoose, config.dbUrl)

var Schema = new mongoose.Schema({       
    title: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: [Float]
    },
    own: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    activity_type: {
        type: mongoose.Schema.ObjectId,
        ref: "Activity_Type"
    },  
    number_of_participants: {
        type: Number
    },
    participants: {
        type: [mongoose.Schema.ObjectId],
        ref: 'User'
    },
    start_time : {
        type: Date,
        "default": Date.now
    },
    end_time : {
        type: Date,
        "default": Date.now
    },
    avatar: {
        type: String
    },
    video: {
        type: String
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
    },
})

module.exports = mongoose.model('Group', Schema)