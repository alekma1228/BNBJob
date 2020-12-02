var mongoose = require("mongoose");
    config = require('../config'),
    db = require('./db');

db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({       
    from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: "Group",
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

module.exports = mongoose.model('Group_Story', Schema)