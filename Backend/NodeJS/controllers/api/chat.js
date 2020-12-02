var express = require('express'),
    router = express.Router(),
    async = require("async")

    messageModel = require('../../models/Message'),
    userModel = require('../../models/User'),
    geolocation = require('../../helpers/geolocation'),
    friendModel = require('../../models/Friend'),
    chatRoomModel = require('../../models/Chat_Room'),
    groupModel = require('../../models/Group'),

    mongoose = require('mongoose')

router.post('/:user_id/messages', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})    
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {            
            if (currentUser) {                
                chatRoomModel
                .findOne({users: {$all: [currentUser._id, req.params.user_id]}})
                .exec(function(err, chatRoom) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        var message = {
                                sender: currentUser._id,
                                chat_room: chatRoom._id,                                
                                message: req.body.message,
                                status: {
                                    is_read: false,
                                    user : req.params.user_id
                                }
                            }

                        // if chat message is attached file, save file and add to message
                        if (('msgType' in req.body) && req.body.msgType == 'F') {
                            var file = req.files.file
                            var filePath = file.name + '-' + Date.now()
                            file.mv('./public/upload/' + filePath)
                            message.msgType = 'F'
                            message.fileName = file.name                            
                            message.filePath = 'upload/' + filePath
                        }

                        messageModel(message).save(function(err, message) {
                            if (err) {
                                res.json({success: false, error: err})
                            } else {
                                res.json({success: true, data: message})
                            }
                        })                        
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/messages/:id/update', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                messageModel
                .findById(req.params.id)
                .exec(function(err, message) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        console.log(message)
                        if (message) {                            
                            var statusList = message.status
                            async.forEach(statusList, function (item, callback) {
                                console.log('user==>', item.user, 'currentUser.id==>', currentUser._id)
                                if (item.user.toString() == currentUser._id.toString()) {  
                                    item.is_read = true
                                }
                            })

                            console.log('updated after status', statusList)
    
                            messageModel
                            .findByIdAndUpdate(req.params.id, {status: statusList})
                            .exec(function(err, message) {
                                if (err) {
                                    res.json({success: false, error: err})
                                } else {
                                    res.json({success: true})
                                }
                            })
                        } else {
                            res.json({success: false, error: 'nothing message'})
                        }
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.get('/:user_id/messages', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {

                chatRoomModel
                .findOne({$or: [{users: {$all: [currentUser._id, req.params.user_id]}}, {group: mongoose.Types.ObjectId(req.params.user_id)}]})
                .exec(function(err, chatRoom) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        console.log(chatRoom)             
                        if (chatRoom) {                            
                            messageModel
                            .find({chat_room: chatRoom._id})
                            // .limit(1)
                            // .limit(-1)
                            .sort({ $natural : 1 })
                            .exec(function(err, messages) {
                                if (err) {
                                    res.json({success: false, error: err})
                                } else {
                                    console.log(messages)
                                    var messageObjects = []
                                    for (var i = 0; i < messages.length; i++) {
                                        var messageObject = messages[i].toObject()
                                        var date = messages[i].created_at
                                        messageObject.created_at = date.getHours() + ':' + date.getMinutes()
                                        messageObjects.push(messageObject)
                                    }
                                    res.json({success: true, data: messageObjects})
                                }
                            })
                        } else {
                            res.json({success: false, error: 'not found chat room'})
                        }
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/:group_id/group_messages', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                // {group: mongoose.Types.ObjectId(req.params.user_id)}

                chatRoomModel
                .findOne({group: mongoose.Types.ObjectId(req.params.group_id)})
                .exec(function(err, chatRoom) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        console.log(chatRoom, '==============chatroom')
                        
                        var statusObjects = []
                        async.forEach(chatRoom.users, function(user, callback) {      
                            if (user.toString() != currentUser._id.toString()) {
                                statusObjects.push({
                                    is_read: false,
                                    user: user
                                })
                            }
                        })
                        
                        console.log(statusObjects, '===============statusObjects')

                        var message = {
                            sender: currentUser._id,
                            chat_room: chatRoom._id,
                            message: req.body.message,
                            status: statusObjects,
                        }

                        // if chat message is attached file, save file and add to message
                        if (('msgType' in req.body) && req.body.msgType == 'F') {
                            var file = req.files.file
                            var filePath = file.name + '-' + Date.now()
                            file.mv('./public/upload/' + filePath)
                            message.msgType = 'F'
                            message.fileName = file.name                            
                            message.filePath = 'upload/' + filePath
                        }

                        messageModel(message).save(function(err, message) {
                            if (err) {
                                res.json({success: false, error: err})
                            } else {
                                console.log(message)
                                res.json({success: true, data: message})
                            }
                        })
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.get('/', function(req, res, next) {
    userModel
    .findOne({remember_token: req.query.token}).populate('friends')
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {

                var responseObject = new Object()
                responseObject.friends = []
                responseObject.enterprises = []
                responseObject.groups = []

                var friends = currentUser.friends                
                async.forEach(friends, function(friend, callback){  
                    friend = friend.toObject()
                    
                    chatRoomModel.findOne({$and: [{type: 0}, {users: {$all: [friend._id, currentUser._id]}}]}).exec(function(err, chatRoom) {
                        if (err) {

                        } else {            
                            var count = 0                
                            messageModel.find({chat_room: chatRoom._id}).sort({'created_at': -1}).exec(function(err, messages) {
                                // console.log(messages)
                                if (err) {

                                } else {
                                    for (var i = 0; i < messages.length; i++) {
                                        var date = new Date(messages[i].created_at)
                                        if (i == 0) {
                                            friend.lastMessage = messages[i].message
                                            friend.lastDate = ((date.getHours() < 10)? '0' + date.getHours(): date.getHours()) + ':' + ((date.getMinutes() < 10)? '0' + date.getMinutes(): date.getMinutes())                                          
                                        } 
                                        if (!messages[i].status.is_read)
                                            count++;

                                    }
                                    friend.unreadMessageCount = count
                                    friend.chat_room_id = chatRoom._id
                                    responseObject.friends.push(friend)
                                    callback()
                                }
                            })
                        }
                    })                   
                    
                }, function(){
                    responseObject.friends.sort(function(a, b) {
                        if ( a.created_at > b.created_at ){
                            return -1;
                          }
                          if ( a.created_at < b.created_at ){
                            return 1;
                          }
                          return 0;
                    })

                    // responseObject.friends.reverse()

                    console.log(responseObject.friends)

                    res.json({success: true, data: responseObject})
                })
            } else {
                res.json({success: false, error: 'invalid token'})
            }
        }
    })
})

router.get('/:message_id/download', function(req, res, next) {
    messageModel
    .findById(req.params.message_id)
    .exec(function(err, message) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            console.log(message)
            if (message) {                            
                var fileName = message.fileName;
                var filePath = message.filePath;
                res.download('./public/' + filePath, fileName)
            } else {
                res.json({success: false, error: 'nothing message'})
            }
        }
    })
})

router.post('/:chat_room_id/readMsg', function(req, res, next) {    
    // console.log(req.params.chat_room_id)
    userModel
    .findOne({remember_token: req.body.token})    
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            // console.log(currentUser)
            if (currentUser) {
                messageModel
                .find({chat_room: req.params.chat_room_id})
                .exec(function(err, messages) {
                    console.log(messages)
                    async.forEach(messages, function(message, callback) {
                        messageModel
                        .findByIdAndUpdate(message._id, {status: {is_read: true}})
                        .exec(function(err) {

                        })
                    })
                })           
            } else {
                res.json({success: false, error: 'invalid token'})
            }
        }
    })
})

module.exports = router