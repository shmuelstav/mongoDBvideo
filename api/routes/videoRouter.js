/**
 * Created by shmuel on 11/20/2017.
 */
'use strict';
module.exports = function(app) {
    var video = require('../controllers/videoController');
    /*****************************************************\
     *                     REST  API
     *------------------------------------------------------
     * courses:
     *             get all
     *             create new
     *             update by id
     *             delete by id
     *             get by id
     * ------------------------------------------------------
     * subjects:
     *              get all subjects by course id
     *              create new subject by course id
     *              delete subject by course id
     *              update subject by course id
     *              get subject by course id
     *--------------------------------------------------------
     *
     *
     *
     *
     *
     ******************************************************/





    app.route('/courses')
        .get(video.list_all_courses)
        .post(video.create_a_course);


    app.route('/courses/:courseId')
        .get(video.read_a_course)
        .put(video.update_a_course)
        .delete(video.delete_a_course);


    app.route('/courses/subjects/:courseId/')
        .post(video.add_subject)
        .get(video.get_subjects);

    app.route('/courses/subjects/:courseId/:subjectId')
        .get(video.get_subject)
        .put(video.update_subject)
        .delete(video.delete_subject);

    app.route('/courses/subjects/lessons/:courseId/:subjectId')
        .post(video.add_lessons)
        //.get(video.get_lessons);

};
