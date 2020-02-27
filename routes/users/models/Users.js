const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, default: '', trim: true, lowercase: true },
    email: { type: String, default: '', unique: true, lowercase: true, trim: true },
    password: { type: String, default: '' }
});

// we are naming the UserSchema as "users" and export the model (aka class)
module.exports = mongoose.model('users', UserSchema)