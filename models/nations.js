const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nationSchema = new Schema({
    name: String
})

module.exports = mongoose.model('Nation', nationSchema);