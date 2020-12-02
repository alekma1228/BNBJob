var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db'),
    Float = require('mongoose-float').loadType(mongoose)


db.connection(mongoose, config.dbUrl)

var Schema = new mongoose.Schema({       
    title: {
        type: String
    },
    price: {
        type: Float
    },
    description: {
        type: String
    },
    own: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },   
    rent_house_type: {
        type: mongoose.Schema.ObjectId,
        ref: "Rent_House_Type"
    },
    article_category: {
        type: mongoose.Schema.ObjectId,
        ref: "Article_Category"
    },
    type: {
        type: Number
    },
    number_of_rooms: {
        type: Number
    },
    house_squares: {
        type: Float
    },
    accepted_animals: {
        type: Boolean
    },
    status: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Advertisement', Schema)