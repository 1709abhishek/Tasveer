const express = require('express');
const router = express.Router();

// get captcha object.
var Recaptcha = require('express-recaptcha').RecaptchaV2;

//import Recaptcha from 'express-recaptcha'
const API_KEY = '6LeF5uQUAAAAAITxtT2yeszPcLLziXtSu4VSD6FY';
const SECRET_KEY = '6LeF5uQUAAAAAEtRTFX-qhfVTi2h9BgoLFN2xnNx';

// create captcha object.
var recaptcha = new Recaptcha(API_KEY, SECRET_KEY, {callback: 'cb'});

const usersConrtoller = require('../controllers/users_controller');

router.get('/profile', recaptcha.middleware.render, usersConrtoller.profile);

router.get('/sign-up', usersConrtoller.signUp);

router.get('/sign-in', usersConrtoller.signIn);

router.post('/create', recaptcha.middleware.verify, usersConrtoller.create);

router.post('/create-session', usersConrtoller.createSession);


module.exports = router;