/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VideoSchema = new Schema({
    Course_name: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    subjects:{type:[{
        date:{type: Date,default: Date.now},
        name:{type: String}
    }]},

});

module.exports = mongoose.model('Video', VideoSchema);