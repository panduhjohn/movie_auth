const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');

//! Render Pages
router.get('/', userController.renderIndex);
router.get('/register', userController.renderRegister)
router.get('/login', userController.renderLogin)
router.get('/logout', userController.logoutUser);
router.get('/*', userController.notFound)

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
// router.post('/login', userController.loginUser);
// router.put('/:title', userController.updateMovie);


module.exports = router;
