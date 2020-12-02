var express = require('express'),
    router = express.Router(),
    chatRoomModel = require('../models/Chat_Room'),
    bodyParser = require('body-parser'),
    hash = require('../helpers/hash')

var purchasModel = require('../models/Purchas')
   

router.get('/', function(req, res, next) {
    
    chatRoomModel    
    .findOneAndDelete({users: ['5cc4d3f7ccaf5b2ea45f9df9', '5cc4d381ccaf5b2ea45f9df8']})
    .exec(function(err, deletedRoom) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (deletedRoom) {
                // console.log(deletedRoom, 'deletedroom====================')

                // messageModel
                // .deleteMany({chat_room: deletedRoom._id})
                // .exec(function(err, deletedMessages) {
                //     if (err) {
                //         res.json({success: false, error: err})
                //     } else {
                //         res.json({success: true})
                //     }
                // })
            } else {
                res.json({success: true})
            }
        }
    })                                              
                                                
})

module.exports = router