var mongoose = require('mongoose');
require('dotenv').config()
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
const { log } = require('console');
var jwt = require('jsonwebtoken');
const config = require('../config/server-config');

var userSchema = new Schema({
    name: { type : String, required : true, unique : true},
    hash: { type : String, required : true},
    salt: { type : String, required : true},
    admin: { type : Boolean, required : true},
    acceptedProblems: { type : Array, required : true},
});

userSchema.method('setPassword', function(password) {
    this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, this.salt);
});

userSchema.method('generateJwt', function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        name: this.name,
        admin: this.admin,
        exp: parseInt(expiry.getTime() / 1000),
    }, config.jwt.secret);
});

userSchema.method('validPassword', function(password) {
    var hash = bcrypt.hashSync(password, this.salt);
    return this.hash === hash;
});

userSchema.method('addAcceptedProblem', function(problem, verdict) {
    if(verdict == "Accepted") {
        if(!this.acceptedProblems.includes(problem.name)) {
            this.acceptedProblems.push(problem.name);
            this.save();
        }
    }
});

module.exports = mongoose.model('User', userSchema);