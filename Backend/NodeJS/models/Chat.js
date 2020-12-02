var mongoose = require("mongoose");
    config = require('../config'),
    db = require('./db');

db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({       
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    reciever: {
        type: mongoose.Schema.ObjectId,
        ref: "Offer",
    },
    message: {
        type: String
    },
    status: {
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
        type: Boolean
    }
})

module.exports = mongoose.model('Chat', Schema)