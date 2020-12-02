var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db'),
    Float = require('mongoose-float').loadType(mongoose);

db.connection(mongoose, config.dbUrl);

var Schema = new mongoose.Schema({
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    remember_token: {
        type: String,
        default: ''
    },
    offer_category: {
        type: mongoose.Schema.ObjectId,
        ref: "Offer_Category",
    },
    phone_region: {
        type: Number,
        default: 0
    },
    phone_number: {
        type: Number,
        default: 0
    },
    country_code: {
        type: String    
    },
    recruiter_type: {
        type: Number,
        default: 0
    },
    institution_name: {
        type: String,
        default: ''
    },
    siret_number: {
        type: Number,
        default: 0
    },
    is_candidate: {
        type: Boolean,
    },
    is_online: {
        type: Boolean,
        default: false
    },
    location: {
        type: [Float]
    },
    device: {
        type: String,
        default: ''
    },
    email_verified : {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String
    },
    video: {
        type: String
    },
    purchas: {
        type: mongoose.Schema.ObjectId,
        ref: 'Purchas'
    },
    job_category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job_Category'
    },  
    job_category_group: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job_Category_Group'
    },
    friends: {
        type: [mongoose.Schema.ObjectId],
        ref: 'User'
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
        type: Boolean,
        "default": false
    },
    status: { 
        type: Boolean,
        "default": false
    }
})

module.exports = mongoose.model('User', Schema)