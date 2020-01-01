const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Role = require('../../models/Role');
// get all users
router.get('/', (req, res) => {
    Role.find().select('name value').then(users => {
        res.json(users);
    })
});

router.post('/save', (req, res) => {
    Role.findOne({ value: req.body.value }).then(role => {
        if (role) {
            return res.send({ 'status': "error", 'message': req.body.name + " already exists" });
        } else {
            let newObject = {
                name: req.body.name,
                value: req.body.value,
            }
            const newRole = new Role(newObject);
            newRole.save(function (err, role) {
                return res.send({ 'status': "success", 'message': "Role created Successfully", 'role': role });
            });
        }
    });
});

router.put('/delete/:id', (req, res) => {
    Role.findByIdAndRemove(req.params.id, (err, model) => {
        if (err) return res.status(500).send(err);
        return res.send({
            'status': 'success',
            'message': model.name + " deleted Successfully"
        });
    });
});

router.put('/edit/:id', (req, res) => {
    Role.findByIdAndUpdate(req.params.id, req.body, { new: true },
        (err, model) => {
            if (err) return res.status(500).send(err);
            return res.send({
                'status': 'success',
                'message': model.name + " updated Successfully",
                'model': model
            });
        });
});


router.post('/assign/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).then(outerModel => {
        for (var property in req.body) {
            let roleValue = req.body[property];
            Role.findOne({ value: roleValue }).then(model => {
                outerModel.roles.push(model);
                console.log(outerModel)
                //outerModel.save();
            });
        }

    })

});

module.exports = router;