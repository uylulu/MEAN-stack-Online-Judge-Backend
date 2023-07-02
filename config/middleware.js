var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const config = require('./server-config.js');

exports.authenticate = asyncHandler(async (req, res, next) => {
    var headerExists = req.headers.authorization;

    if(headerExists) {
        var token = req.headers.authorization.split(' ')[1];

        try {
            var decoded = jwt.verify(token, config.jwt.secret);
            req.user = decoded.name;
            next();
        } catch(err) {
            console.log(err);
            res.status(401).json('Unauthorized');
        }
    } 
    else {
        res.status(403).json('No token provided');
    }
});