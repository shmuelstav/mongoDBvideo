/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarkerSchema = new Schema({
    date:{type: Date,default: Date.now},
    name:{type: String},
    link:{type: String}
})

var LessonSchema = new Schema({
    date:{type: Date,default: Date.now},
    name:{type: String},
    markers:[MarkerSchema],
    link:{type: String}
})


var SubjectSchema = new Schema({
    date:{type: Date,default: Date.now},
    name:{type: String},
    lessons:[LessonSchema]
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
module.exports = mongoose.model('Subject', SubjectSchema);
module.exports = mongoose.model('Lesson', LessonSchema);
module.exports = mongoose.model('Marker', MarkerSchema);