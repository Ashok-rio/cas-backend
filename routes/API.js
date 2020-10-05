const express = require('express')
const router = express.Router()

const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const SemFeeController = require('../controllers/SemFeeController')

const passport = require('passport')
const needsAuth = passport.authenticate('jwt', {session: false})
require('./../middleware/Passport')(passport)

router.get('/', (req, res) => {
    return res.json({message: 'Nothing here in this route'})
})

router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.get('/get',needsAuth, UserController.get);
router.put('/update',needsAuth, UserController.update);

router.post('/post/create',needsAuth,PostController.postCreate);
router.get('/post/getAll',needsAuth,PostController.getAllPost);

router.post('/sem/fee/create',needsAuth,SemFeeController.createSemFee);
router.put('/sem/fee/add',needsAuth,SemFeeController.addSemFee);
router.put('/sem/fee/paid',needsAuth,SemFeeController.paidFee);
router.get('/sem/fee',needsAuth,SemFeeController.getSemFees);


module.exports = router