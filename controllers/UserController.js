const {User} = require('../models')
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const { to, ReE, ReS, isNull, isEmpty } = require('../services/util.service')
const AuthUser = require('../services/auth.service');
const CONFIG = require('../config/config')
const HttpStatus = require('http-status')


exports.create = async (req, res) => {

    let RegNo = req.body.reg

    let err, exisitUser;

    let fields = [
        'reg',
        'name'
    ]
    
    let invalidFields = fields.filter(field => {
        if (isNull(req.body[field])) {
            return true
        }
    })
    
      
    if (invalidFields.length !== 0) { return ReE(res, 
        { message: `Please enter ${invalidFields}` },
        HttpStatus.BAD_REQUEST)
    }

    [err, exisitUser] = await to(User.findOne({ RegNo: RegNo }))
    
    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
    
    if (exisitUser) { return ReE(res, { message: 'User already here!' }, HttpStatus.BAD_REQUEST) }
    
    let newUser = {
        RegNo: RegNo,
        name:req.body.name
    };

    let user;

    [err, user] = await to(AuthUser.createUser(newUser))

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
    
    if (!user) { return ReE(res, { message: 'User doesn\'t exisit' }, HttpStatus.BAD_REQUEST) }
    
    if (user) { return ReS(res, { message: 'User created successfully!', User: user }, HttpStatus.Ok) }
    

    
}