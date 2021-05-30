const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        sparse: true
    },
    date: {
        type: Date,
        Default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);