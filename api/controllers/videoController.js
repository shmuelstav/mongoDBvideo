/**
 * Created by shmuel on 11/20/2017.
 */

var storage = require('../video/storage.js');
'use strict';

/*******************************************************\
 *   Declare the Schemas the controller would use
 *   Hyrarcy Video(course) -> Subject -> Lesson
 /********************************************************/

var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    Subject = mongoose.model('Subject'),
    Lesson = mongoose.model('Lesson'),
    Marker = mongoose.model('Marker'),
    multer = require('multer');
var upload = multer({ dest: './uploads/'}).single('upl');

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

/**********************************************
 * Marker controllers
 **********************************************/

exports.add_markers = function(req, res) {

    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            var new_marker = new Marker(req.body);
            try{
                doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId).markers.push(new_marker);
                doc.save();
                res.json({ message: 'marker successfully created' });
            }
            catch(err){
                res.json({ message: 'no such subject' });
            }
        }
    });
}

exports.all_markers = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            try{
                res.json( doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId).markers);
            }
            catch(err){
                res.json({ message: 'no such lesson' });
            }
        }
    });
}

exports.get_marker = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }

        else {
            var marker =  doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId).markers.id(req.params.markerId) ;
            res.json(marker);
        }
    });
};

exports.update_marker = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            var marker = doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId).markers.id(req.params.markerId) ;
            //put here all the updates
            marker.name  = (req.body.name);
            doc.save().then(function(course) {
                res.send(marker);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
        }
    });
};

exports.delete_marker = function(req, res) {
    Video.findById({_id: req.params.courseId}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            var marker =  doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId).markers.id(req.params.markerId)  ;
            //put here all the updates
            var markers = doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId).markers;
            var index = markers.indexOf(marker);
            markers.splice(index, 1);
            doc.save().then(function(course) {
                res.send(marker);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
        }
    });
};



/**********************************************
 * Upload files
 **********************************************/


exports.upload_files = function(req, res) {
    //upload the file with the request
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            res.send(err);
        }
        else{
                storage.upload_video(req.file.filename,req.file.originalname,function (err , data) {
                    console.log("I am back at the controller");
                    res.status(201).send(data);
                });
        }
    });

}

exports.upload_lesson_files = function(req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            res.send(err);
        }
        else{
            storage.upload_video(req.file.filename,req.file.originalname,function (err , data) {
                Video.findById({_id: req.params.courseId}, function (err, doc) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        var lesson =  doc.subjects.id(req.params.subjectId).lessons.id(req.params.lessonId) ;
                        //put here all the updates
                        lesson.link  = data.link;
                        lesson.markers = data.markers;
                        doc.save().then(function(course) {
                            storage.save_lesson_video(req,data,function (err) {
                                if (err) {
                                    // An error occurred when uploading
                                    res.send(err);
                                }
                                else{
                                    console.log(" I finish the process");
                                    res.send(data);
                                }
                            })
                        }).catch(function(err) {
                            console.log(err);
                            res.status(500).send(err);
                        });
                    }
                });
                //console.log("I am back at the controller");
                //storage.delete_files("original_name","middle_name","current_name");
                //res.status(201).send(data);
            });
        }
    });

}

