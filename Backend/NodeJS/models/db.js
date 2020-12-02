module.exports.connection = function(mongoose, dbUrl) {
    mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.error('Database connection sucessful')       
    })
    .catch(err => {
        console.error('Database connection error')       
    });
}   