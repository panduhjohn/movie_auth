const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');

//! Render Pages
router.get('/', userController.renderIndex);
router.get('/register', userController.renderRegister)
router.get('/login', userController.renderLogin)
router.get('/success', userController.renderSuccess)
router.get('/fail', userController.renderFail)

router.get('/getallusers', userController.getAllUsers);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
// router.put('/:title', userController.updateMovie);


module.exports = router;
