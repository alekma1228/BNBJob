var express = require('express'),
    router = express.Router(),
    async = require("async"),

    userModel = require('../../models/User'),
    friendModel = require('../../models/Friend'),
    chatModel = require('../../models/Message'),
    chatRoomModel = require('../../models/Chat_Room'),
    likeModel = require('../../models/Like'),
    geolocation = require('../../helpers/geolocation'),
    messageModel = require('../../models/Message')

router.get('/', function (req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                friendModel
                .find({$and: [{user: currentUser._id}, {status: 2}]})
                .populate('friend')
                .exec(function(err, friends) {
                    if (err) {
                        console.error(err)
                        res.json({success: false, error: err})
                    } else {
                        res.json({success: true, data: friends})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.get('/invite', function (req, res, next) {
    userModel
    .findOne({remember_token: req.query.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                friendModel
                .find({$and: [{friend: currentUser._id}, {status: 0}]})
                .populate('friend')
                .exec(function(err, friends) {
                    if (err) {
                        console.error(err)
                        res.json({success: false, error: err})
                    } else {
                        console.log(friends)
                        res.json({success: true, data: friends})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/:user_id/invite', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                friendModel
                .find({$or: [{$and: [{friend: currentUser._id}, {user: req.params.user_id}]}, {$and: [{user: currentUser._id}, {friend: req.params.user_id}]}] })
                .exec(function(err, docs) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        console.log(docs)
                        if (docs.length == 0) {                            
                            friendModel(
                                {
                                    user: currentUser._id,
                                    friend: req.params.user_id,
                                    status: 0
                                }
                            )
                            .save(function(err, doc) {
                                if (err) {
                                    res.json({success: false, error: err})
                                } else {
                                    res.json({success: true, data: doc})
                                }
                            })
                        } else {
                            friendModel
                            .findOneAndUpdate({$or: [{$and: [{friend: currentUser._id}, {user: req.params.user_id}]}, {$and: [{user: currentUser._id}, {friend: req.params.user_id}]}]} , {status: 0})
                            .exec(function(err, doc) {
                                console.log(doc)
                                if (err) {
                                    res.json({success:false, error: err})
                                } else {
                                    res.json({success: true})
                                }
                            })
                        }
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/:user_id/decline', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                friendModel
                .findOneAndUpdate({$and: [{friend: currentUser._id}, {user: req.params.user_id}]}, {status: 1}, function(err, friend) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        res.json({success: true, data: friend})
                    }
                })
            } else {
                res.json({success: false, error: 'unauthorized request'})
            }
        }
    })
})

router.post('/:user_id/accept', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                friendModel
                .findOneAndUpdate({$and: [{friend: currentUser._id}, {user: req.params.user_id}]}, {status: 2}, function(err, doc) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        var myFriends = []
                        myFriends = currentUser.friends                        
                        myFriends.push(req.params.user_id)

                        userModel
                        .findByIdAndUpdate(currentUser._id, {friends: myFriends},  function(err, user) {
                            if (err) {
                                res.json({success: false, error: err})
                            } else {

                                userModel
                                .findById(req.params.user_id)
                                .exec(function(err, user) {
                                    if (err) {
                                        res.json({success: false, error: err})
                                    } else {
                                        var myFriends = []
                                        myFriends = user.friends
                                        myFriends.push(currentUser._id)

                                        userModel
                                        .findByIdAndUpdate(req.params.user_id, {friends: myFriends},  function(err, user) {
                                            if (err) {
                                                res.json({success: false, error: err})
                                            } else {
                                                chatRoomModel
                                                .find({users: {$all: [currentUser._id, req.params.user_id]}})
                                                .exec(function(err, chatRooms) {
                                                    if (err) {
                                                        res.json({success: false, error: err})
                                                    } else {
                                                        if (chatRooms.length == 0) {
                                                            chatRoomModel (
                                                                {
                                                                    users: [currentUser._id, req.params.user_id],
                                                                    type: 0 //friends
                                                                }
                                                            )
                                                            .save(function(err, chatRoom) {
                                                                if (err) {
                                                                    res.json({success: false, error: err})
                                                                } else {
                                                                    res.json({success: true})
                                                                }
                                                            })
                                                        } else {
                                                            res.json({success: false, data: 'already added'})
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })                                
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

router.post('/:user_id/unfriend', function(req, res, next) {
    userModel
    .findOne({remember_token: req.body.token})
    .exec(function(err, currentUser) {
        if (err) {
            res.json({success: false, error: err})
        } else {
            if (currentUser) {
                var myFriends = []
                myFriends = currentUser.friends

                var index = myFriends.indexOf(req.params.user_id)
                if (index > -1) {
                    myFriends.splice(index, 1)
                }

                userModel
                .findByIdAndUpdate(currentUser._id, {friends: myFriends})
                .exec(function(err, updatedCurrentUser) {
                    if (err) {
                        res.json({success: false, error: err})
                    } else {
                        userModel
                        .findById(req.params.user_id)
                        .exec(function(err, user) {
                            if (err) {
                                res.json({success: false, error: err})
                            } else {
                                var myFriends = []
                                myFriends = user.friends

                                var index = myFriends.indexOf(currentUser._id)
                                if (index > -1) {
                                    myFriends.splice(index, 1)
                                }

                                userModel
                                .findByIdAndUpdate(user._id, {friends: myFriends})
                                .exec(function(err, updatedUser) {
                                    if (err) {
                                        res.json({success: false, error: err})
                                    } else {
                                        
                                        friendModel
                                        .findOneAndUpdate({$or: [{$and: [{friend: req.params.user_id}, {user: currentUser._id}, {status: 2}]}, {$and: [{user: req.params.user_id}, {friend: currentUser._id}, {status: 2}]}]}, {status: 3})
                                        .exec(function(err, updatedFriend) {
                                            if (err) {
                                                res.json({success: false, error: err})
                                            } else {
                                                chatRoomModel
                                                .findOneAndDelete({users: {$all: [currentUser._id, req.params.user_id]} })
                                                .exec(function(err, deletedRoom) {
                                                    if (err) {
                                                        res.json({success: false, error: err})
                                                    } else {
                                                        if (deletedRoom) {
                                                            messageModel
                                                            .deleteMany({chat_room: deletedRoom._id})
                                                            .exec(function(err, deletedMessages) {
                                                                if (err) {
                                                                    res.json({success: false, error: err})
                                                                } else {
                                                                    res.json({success: true})
                                                                }
                                                            })
                                                        } else {
                                                            res.json({success: true})
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
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

module.exports = router