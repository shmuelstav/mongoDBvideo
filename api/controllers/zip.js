

var zipFolder = require('zip-folder');

zipFolder('C:\\Users\\shmuel\\Desktop\\exam_one', 'C:\\Users\\shmuel\\Desktop\\exam_one.zip', function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        console.log('EXCELLENT');
    }
});