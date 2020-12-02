var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db');

db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({       
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    friend: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    status: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Friend', Schema)