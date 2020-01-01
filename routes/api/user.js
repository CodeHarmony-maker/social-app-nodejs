const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../../validation/register');

// Load User model and role
const User = require('../../models/Users');
const Role = require('../../models/Role');
// get all users
router.get('/', (req, res) => {
    User.find().then(users => {
        res.json(users);
    })
});

router.get('/:user_id', (req, res) => {
    User.find().select('firstname lastname email avatar')
        .then(users => {
            if (!users) {
                res.status(404).json(errors);

            }
            res.json(users);
            console.log(users)
        })
        .catch(err => res.status(404).json(err));
});

router.post('/save', (req, res) => {

    User.findOne({ email: req.body.email }).then(model => {
        if (model) {
            return res.send({ 'status': "error", 'message': req.body.email + " email lready exists" });
        } else {
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                parentId: req.body.parentId
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save(function (err, model) {
                        Role.findOne({ value: req.body.role }).then(role => {
                            model.roles.push(role);
                            model.save().then(m => {
                                return res.send({
                                    'status': "success",
                                    'message': "User created Successfully",
                                    'model': m
                                });
                            })
                        });
                    });
                });
            });
        }
    });
});

router.put('/edit/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true },
        (err, model) => {
            if (err) return res.status(500).send(err);
            return res.send({
                'status': 'success',
                'message': model.name + " updated Successfully",
                'model': model
            });
        });
});

router.put('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, model) => {
        if (err) return res.status(500).send(err);
        return res.send({
            'status': 'success',
            'message': model.name + "deleted Successfully"
        });
    });
});

module.exports = router;