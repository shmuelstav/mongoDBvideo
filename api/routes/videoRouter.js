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
     *   lessons
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
        .post(video.update_subject)
        .delete(video.delete_subject);

    app.route('/courses/subjects/lessons/:courseId/:subjectId')
        .post(video.add_lessons)
        .get(video.all_lessons);

    app.route('/courses/subjects/lessons/:courseId/:subjectId/:lessonId')
        .get(video.get_lesson)
        .post(video.update_lesson)
        .delete(video.delete_lesson);

    app.route('/courses/subjects/lessons/markers/:courseId/:subjectId/:lessonId')
        .post(video.add_markers)
        .get(video.all_markers);

    app.route('/courses/subjects/lessons/markers/:courseId/:subjectId/:lessonId/:markerId')
        .get(video.get_marker)
        .post(video.update_marker)
        .delete(video.delete_marker);

    app.route('/files')
        .post(video.upload_files)

    app.route('/courses/subjects/lessons/:courseId/:subjectId/:lessonId/files')
        .post(video.upload_lesson_files)

};

