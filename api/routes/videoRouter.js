/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';
module.exports = function(app) {
    var video = require('../controllers/videoController');

    // todoList Routes
    app.route('/courses')
        .get(video.list_all_courses)
        .post(video.create_a_course);


    app.route('/courses/:courseId')
        .get(video.read_a_course)
        .put(video.update_a_course)
        .delete(video.delete_a_course);


    app.route('/courses/subjects/:courseId/')
        .get(video.read_subjects)
        .post(video.add_subject);
};
