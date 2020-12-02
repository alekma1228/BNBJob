var mongoose = require("mongoose"),
    config = require('../config'),
    db = require('./db');

db.connection(mongoose, config.dbUrl);

var Schema = new mongoose.Schema({    
    from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    toUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    toGroup: {
        type: mongoose.Schema.ObjectId,
        ref: "Group",
    },
    toAdvertisement: {
        type: mongoose.Schema.ObjectId,
        ref: "Advertisement"  
    },
    toOffer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Offer'
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

module.exports = mongoose.model('Like', Schema)