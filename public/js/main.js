/**
 * Created by shmuel on 12/24/2017.
 */


//alert("ERVrevve");

function remove_css_class(object,css_class){
    $(object).removeClass(css_class);
}

function add_css_class(object,css_class){
    $(object).addClass(css_class);
}
function send_course() {
    $.ajax('http://localhost:3001/courses', {
        type: 'POST',  // http method,
        crossOrigin: true,
        data: {
            Course_name: $("course_name_input").val()
        },
        success: function (data, status, xhr) {
            console.log(data);
            add_css_class('#begin_process','display_none');
            show_course(data);

        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
        }
    });
}

