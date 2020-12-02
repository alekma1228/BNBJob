var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db')

db.connection(mongoose, config.dbUrl)

var Schema = new mongoose.Schema({       
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    own: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    job_minute: {
        type: Boolean
    },
    job_type: {
        type: mongoose.Schema.ObjectId,
        ref: "Job_Type"
    },
    experience: {
        type: mongoose.Schema.ObjectId,
        ref: "Experience"
    },
    advantage: {
        type: mongoose.Schema.ObjectId,
        ref: 'Advantage'
    },
    skill: {
        type: mongoose.Schema.ObjectId,
        ref: "Skill"
    },
    degree: {
        type: mongoose.Schema.ObjectId,
        ref: "Degree"
    },
    language: {
        type: mongoose.Schema.ObjectId,
        ref: "Language"
    },
    other: {
        type: String
    },
    status: {
        type: Number,
        default: 0     //default/created: 0, applied: 1, decline: 2, close: 3, accepted: 4
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

module.exports = mongoose.model('Offer', Schema)