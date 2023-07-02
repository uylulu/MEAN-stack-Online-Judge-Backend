const User = require('../model/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

exports.register = asyncHandler(async (req, res, next) => {

    var tmp = await User.findOne({name: req.body.name});
    if(tmp) {
        res.json({status: "error", message: "User already exists!!!", data: null});
        return;
    }

    var user = new User();
    user.name = req.body.name;
    user.setPassword(req.body.pw);
    user.admin = false;

    await user.save();

    res.status(202).send({
        token: user.generateJwt(),     
        name: user.name,   
    })
});

exports.login = asyncHandler(async (req, res, next) => {

    var user = await User.findOne({name: req.body.name});

    if(!user) {
        res.json({status: "error", message: "Invalid username/password!!!", data: null});
    }
    else if(user.validPassword(req.body.pw)) {

        // generate login token
        res.status(202).send({
            token: user.generateJwt(),
            name: user.name,
        })
    }
    else {
        res.json({status: "error", message: "Invalid username/password!!!", data: null});
    }
})

exports.authenticate = asyncHandler(async (req, res, next) => {
    var headerExists = req.headers.authorization;
    if(headerExists) {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'MY_SECRET', function(err, decoded) {
            if(err) {
                console.log(err);
                res.status(401).json('Unauthorized');
            }
            else {
                req.user = decoded.name;
                next();
            }
        })
    } 
    else {
        res.status(403).json('No token provided');
    }
});