var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db')

db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({
    users: {
        type: [{
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }]
    },
    type: {
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

module.exports = mongoose.model('Chat_Room', Schema)