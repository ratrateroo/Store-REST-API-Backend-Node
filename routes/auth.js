const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const router = express.Router();

router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Email address already exists!');
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('firstname')
    .trim()
    .not()
    .isEmpty(),
  body('middlename')
    .trim()
    .not()
    .isEmpty(),
  body('lastname')
    .trim()
    .not()
    .isEmpty(),
]);

module.exports = router;
