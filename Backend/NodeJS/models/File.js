var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db')

db.connection(mongoose, config.dbUrl)

var Schema = new mongoose.Schema({
    file_type: {
        type: Number
    },
    own: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    url: {
        type: String
    },
    is_published: {
        type: Boolean,
        "default": false
    },
    file_category: {
        type: Number
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
})

module.exports = mongoose.model('File', Schema)