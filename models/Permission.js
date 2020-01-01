const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PermissionSchema = new Schema({

    name:{
        type: String
    },
    value:{
        type: String
    }

});

module.exports = Permission = mongoose.model('permissions', PermissionSchema)