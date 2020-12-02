var mongoose = require("mongoose"),
    config = require('../../config'),
    db = require('../db')

db.connection(mongoose, config.dbUrl);

var Schema = mongoose.Schema({       
    title: {
        type: String
    },    
    discription: {
        type: String,
        default: ''
    },
    job_category_group: {
        type: mongoose.Schema.ObjectId,
        ref: "Job_Category_Group"
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

module.exports = mongoose.model('Job_Category', Schema)