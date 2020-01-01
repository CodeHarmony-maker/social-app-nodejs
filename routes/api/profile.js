const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport')


//Load validateProfileInput
const validateProfileInput = require('../../validation/profile');
//Load validateExperienceInput
const validateExperienceInput = require('../../validation/experience');
//Load validateEducationInput
const validateEducationInput = require('../../validation/education');
//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/Users');

router.get('/:id', (req, res) => {
    Profile.findOne({ user: req.params.id })
        .then(model => {
            res.json({
                'model': model
            });
        }).catch(err => res.status(404).json(err));
});
module.exports = router;