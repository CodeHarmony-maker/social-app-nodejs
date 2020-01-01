const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const RoleScheme = new Schema({

    name: {
        type: String
    },
    value: {
        type: String
    },
    permissions: []
});

module.exports = Role = mongoose.model('roles', RoleScheme);