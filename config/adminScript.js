// script to add admin users to database
// remember to run server before running this script

const { mongo, default: mongoose } = require('mongoose');
var User = require('../model/user');
var fs = require('fs');
const { exit } = require('process');
const config = require('./server-config');

var name = "uy";

mongoose.connect(config.db.url);

const add = async () => {
    var user = await User.findOne({name: name});

    if(!user) {
        console.log("User not found");
        return;
    }
    user.admin = true;
    await user.save();
    console.log("User updated");
}

add();