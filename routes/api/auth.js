const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const mongoose = require('mongoose');
const formidable = require('formidable');
const fs = require('fs');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/Users');
const Role = require('../../models/Role');
const Permission = require('../../models/Permission');
const Profile = require('../../models/Profile');

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'Email already exists';
            return res.status(400).json(errors);
        } else {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        error: 'image could not be uploaded'
                    })
                }
                let user = new newUser(fields)
                if (files.avatar) {
                    user.avatar.data = fs.readFileSync(files.avatar.path)
                    user.avatar.contenType = files.avatar.type
                }
                console.log(user);
            })

            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
                status: req.body.status,
                parentId: null
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => {
                        Role.findOne({ value: req.body.role }).then(role => {
                            user.roles.push(role);
                            user.save().then(user => res.json(user))
                        });
                    })
                });
            });
        }
    });
});

router.post('/login', async (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email

    User.findOne({ email }).lean().exec(function (err, data) {
        const payload = data;
        jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
                res.json({
                    success: true,
                    token: 'Bearer ' + token
                });
            });
    });

});

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            firstname: req.user.firstname,
            email: req.user.email
        });
    }
);


router.post('/upload', (req, res) => {
    let user_id = req.query.user_id;
    Profile.findOne({ user: user_id })
        .then(model => {
            var form = new formidable.IncomingForm();
            form.parse(req);
            form.on('fileBegin', function (name, file) {
                file.path = __dirname + '../../../public/images/' + file.name;
            });
            form.on('file', function (name, file) {
                let avatar = 'http://localhost:5000/images/' + file.name;
                model.avatar = avatar;
                model.save();
                res.json({
                    'status': 'success',
                    'message': 'File updated successfully',
                    'avatar': avatar
                })
            });
        })
});
module.exports = router;