const {User} = require('../models')
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const { to, ReE, ReS, isNull, isEmpty } = require('../services/util.service')
const AuthUser = require('../services/auth.service');
const CONFIG = require('../config/config')
const HttpStatus = require('http-status')


exports.create = async (req, res) => {

    let err, exisitUser;

    let fields = [
        'regNo',
        'name',
        'email',
        'phone',
        'dob',
        'department',
        'course',
        'graduate'
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

    [err, exisitUser] = await to(User.findOne({ regNo: req.body.regNo }))
    
    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
    
    if (exisitUser) { return ReE(res, { message: 'User already here!' }, HttpStatus.BAD_REQUEST) }
    
    let newUser = {...req.body, profileName:req.body.name };

    let user;

    [err, user] = await to(AuthUser.createUser(newUser))

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
    
    if (!user) { return ReE(res, { message: 'User doesn\'t exisit' }, HttpStatus.BAD_REQUEST) }
    
    if (user) { return ReS(res, { message: 'User created successfully!', User: user }, HttpStatus.Ok) }
    

}

exports.login = async (req, res) => {

    let err, exisitUser;
  
    let fields = ['regNo','password']
  
    let invalidFields = fields.filter(field => { if (isNull(req.body[field])) { return true } })

    if (invalidFields.length !== 0) { return ReE(res, { message: `Please enter ${invalidFields} to login` }, HttpStatus.BAD_REQUEST) }
  
    [err, exisitUser] = await to(User.findOne({ regNo: req.body.regNo }))
  
    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
  
    if (!exisitUser) { return ReE(res, { message: 'You doesn\'t have an account contact our tutor' }, HttpStatus.BAD_REQUEST) }
  
    let compare;
  
    [err, compare] = await to(exisitUser.comparePassword(req.body.password))
  
    if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
  
    if (!compare) { return ReE(res, { message: 'Invalid password' }, HttpStatus.BAD_REQUEST) }

    if(compare){

    return ReS(res, { message: 'User logged in ',

            user: {
                
                _id: exisitUser._id,
                email: exisitUser.email,
                phone: exisitUser.phone,
                name: exisitUser.name
            },

            token: exisitUser.getJWT(),
        }, 

        HttpStatus.OK)

    }


}

exports.get =  async (req,res) => {

    let  user = req.user;

    let err,exisitingUser;

    [err,exisitingUser] = await to(User.findOne({_id:user._id}))

    if (err) {return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)}

    if(!exisitingUser){return ReE(res, { message: 'User not found'}, HttpStatus.BAD_REQUEST)}

    if(exisitingUser){ return ReS(res, { message: 'user data', user: exisitingUser }, HttpStatus.OK) } 


}
