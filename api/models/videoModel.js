/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
    date:{type: Date,default: Date.now},
    name:{type: String}
})

var VideoSchema = new Schema({
    Course_name: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    subjects:[SubjectSchema]
});

module.exports = mongoose.model('Video', VideoSchema);