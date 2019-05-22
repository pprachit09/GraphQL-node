const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: String,
    position: String,
    jersynumber: String,
    nationId: String
})

module.exports = mongoose.model('Player', playerSchema);