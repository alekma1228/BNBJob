var mongoose = require("mongoose");
    config = require('../config'),
    db = require('./db');

db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({       
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    chat_room: {
        type: mongoose.Schema.ObjectId,
        ref: "Chat_Room",
    },
    message: {
        type: String
    },
    status: {
        type: [{
            is_read: Boolean,
            user : {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        }]
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
    msgType: { // chat message: M, file: F
        type: String,
        "default": 'M'
    },
    fileName: { // attached file name
        type: String
    },
    filePath: { // saved file path
        type: String
    }
})

module.exports = mongoose.model('Message', Schema)