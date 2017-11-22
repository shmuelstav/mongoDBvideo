/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';


var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    Subject = mongoose.model('Subject');

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

exports.add_subject = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
          console.log(doc);
            var new_subject = new Subject(req.body);
            doc.subjects.push(new_subject);
            doc.save();
            new_subject.save();
            res.json({ message: 'Subject successfully created' });
        }
    });
};

exports.get_subjects = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(doc.subjects);
        }
    });
};

exports.get_subject = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            console.log(doc);
            var subject =  doc.subjects.id(req.params.subjectId) ;
            res.json(subject);
        }
    });
};

exports.update_subject = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {

            var subject =  doc.subjects.id(req.params.subjectId) ;
            subject.set(req.body);
            doc.save().then(function(course) {
                res.send(course);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
        }
    });
};

exports.delete_subject = function(req, res) {
    Video.findOneAndUpdate(
        {_id: req.params.courseId},
        {$pull: {subjects: {_id: req.params.subjectId}}},
        function(err, org) {
            if(err)  res.send(err);
            res.send("success");
        });
};
