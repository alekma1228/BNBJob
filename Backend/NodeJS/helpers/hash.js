var crypto = require('crypto'),
    uuidv4 = require('uuid/v4')

module.exports.random = function(input) {
    return crypto.createHash('sha256').update(input).digest('hex')
}

module.exports.uuid = function() {
    return uuidv4()
}