const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Permission = require('../../models/Permission');
// get all users
router.get('/', (req, res) => {
    Permission.find().select('name value').then(model => {
        res.json(model);
    })
});

router.post('/save', (req, res) => {
    Permission.findOne({ value: req.body.value }).then(model => {
        if (model) {
            return res.send({ 'status': "error", 'message': req.body.name + " already exists" });
        } else {
            let newObject = {
                name: req.body.name,
                value: req.body.value,
            }
            const newPermission = new Permission(newObject);
            newPermission.save(function (err, model) {
                return res.send({ 'status': "success", 'message': "Permission created Successfully", 'model': model });
            });
        }
    });
});

router.put('/delete/:id', (req, res) => {
    Permission.findByIdAndRemove(req.params.id, (err, model) => {
        if (err) return res.status(500).send(err);
        return res.send({
            'status': 'success',
            'message': model.name + " deleted Successfully"
        });
    });
});

router.put('/edit/:id', (req, res) => {
    Permission.findByIdAndUpdate(req.params.id, req.body, { new: true },
        (err, model) => {
            if (err) return res.status(500).send(err);
            return res.send({
                'status': 'success',
                'message': model.name + " updated Successfully",
                'model': model
            });
        });
});


module.exports = router;