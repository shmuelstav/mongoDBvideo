/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';


var mongoose = require('mongoose'),
    Video = mongoose.model('Video');

exports.list_all_courses = function(req, res) {
    Video.find({}, function(err, course) {
        if (err)
            res.send(err);
        res.json(course);
    });
};




exports.create_a_course = function(req, res) {
    var new_video = new Video(req.body);
    new_video.save(function(err, course) {
        if (err)
            res.send(err);
        res.json(course);
    });
};


exports.read_a_course = function(req, res) {
    Video.findById(req.params.courseId, function(err, course) {
        if (err)
            res.send(err);
        res.json(course);
    });
};


exports.update_a_course = function(req, res) {
    console.log(req.body);
    Video.findOneAndUpdate({_id: req.params.courseId}, req.body, function(err, course) {
        if (err)
            res.send(err);
        res.json(course);
    });
};


exports.delete_a_course = function(req, res) {

    Video.remove({
        _id: req.params.courseId
    }, function(err, course) {
        if (err)
            res.send(err);
        res.json({ message: 'Course successfully deleted' });
    });
};

