/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';

/*******************************************************\
 *   Declare the Schemas the controller would use
 *   Hyrarcy Video(course) -> Subject -> Lesson
 /********************************************************/

var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    Subject = mongoose.model('Subject'),
    Lesson = mongoose.model('Lesson');


/**********************************************
 * Video (course) controllers)
 **********************************************/

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

/**********************************************
 * Subject controllers
 **********************************************/


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
            //put here all the fields to update if there is more then one recommende to use var
            doc.subjects.id(req.params.subjectId).name = req.body.name;
            doc.save().then(function(subject) {
                //console.log(doc);
                res.send(subject);
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

/**********************************************
 * Lesson controllers
 **********************************************/

exports.add_lessons = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
        var new_lesson = new Lesson(req.body);
            try{
                doc.subjects.id(req.params.subjectId).lessons.push(new_lesson);
                doc.save();
                res.json({ message: 'lesson successfully created' });
            }
            catch(err){
                res.json({ message: 'no such subject' });
            }
        }
    });
}

exports.all_lessons = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            try{
                res.json( doc.subjects.id(req.params.subjectId).lessons);
            }
            catch(err){
                res.json({ message: 'no such subject' });
            }
        }
    });
}

exports.get_lesson = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            console.log(doc);
            var lesson =  doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId) ;
            res.json(lesson);
        }
    });
};

exports.update_lesson = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            var lesson =  doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId) ;
            //put here all the updates
            lesson.name  = (req.body.name);
            doc.save().then(function(course) {
                res.send(lesson);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
        }
    });
};


/*
exports.delete_lesson = function(req, res) {
    Video.findOneAndUpdate(
        {"_id": req.params.courseId,"subjects._id" : req.params.subjectId},
        {$pull: {lessons: {_id: req.params.lessonId}}},
        function(err, org) {
            console.log(org);
            if(err)  res.send(err);
            res.send("success");
        });
};


function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}*/

exports.delete_lesson = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            var lesson =  doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId) ;
            //put here all the updates
            var lessons = doc.subjects.id(req.params.subjectId).lessons;
            var index = lessons.indexOf(lesson);
            lessons.splice(index, 1);
            doc.save().then(function(course) {
                res.send(lesson);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
        }
    });
};