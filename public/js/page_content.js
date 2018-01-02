/**
 * Created by shmuel on 12/26/2017.
 */

var  i = 1;
var  y=1;

$( document ).ready(function() {
    show_courses();
});

var appData = {
    currentcourse: ""
}

function send_course() {
    $.ajax('/courses', {
        type: 'POST',  // http method,
        crossOrigin: true,
        data: {
            Course_name: $("#course_name_input").val()
        },
        success: function (data, status, xhr) {
            //console.log(data);
            //add_css_class('#begin_process','display_none');
            show_courses();
            add_css_class('#form_course_name','display_none');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
        }
    });
}



function show_courses() {
    $.ajax('/courses', {
        type: 'GET',  // http method,
        crossOrigin: true,
        success: function (data, status, xhr) {
            var html = '';
            var i =0;
            var onclick = "onclick=\"delete_data(\"courses\")\"";
            var onclick_course = "";
            $.each(data, function(key, value){
                onclick = "onclick=\"delete_data('courses','"+value._id+"','courseid"+i+"')\"";
                onclick_course = "onclick=\"open_course('"+value._id+"')\"";
                html += '<div class="dcell" id="courseid'+i+'">';
                html += '<label class="course_name_label">course name :  '+value.Course_name+'<span '+ onclick_course +' class="span_button"><i class="fa fa-pencil" aria-hidden="true"></span></i><span ' +onclick+'  class="span_button"><i  class='+'"fa fa-trash-o"'+' aria-hidden="true"></i></span></label>';
                html += '</div>';
                i = i+1;
            });
            $('#courses').html(html);
            //add_event_clicks(".course_name_label",call_alert)

        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
        }
    });
}



function call_alert(){
    alert( "Handler for .click() called." );
}

function delete_data(url,param,container,success_func,fail_func){
    alert("hi i am here");
    container = "#"+container.toString();
    $.ajax(url+"/"+param, {
        type: 'DELETE',  // http method,
        crossOrigin: true,
        success: function (data, status, xhr) {
           $(container ).remove();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
        }
    });
}


function open_course(id){
    console.log(id);

    $.ajax('/courses/'+id , {
        type: 'GET',  // http method,
        crossOrigin: true,
        success: function (data, status, xhr) {
                         appData.currentcourse = data;
                         update_course_view();

        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
        }
    });

}


function update_course_view(){

    /************************************************************************************************************
     *              create the content of the course edit view
     *
     ***********************************************************************************************************/

    /***************************************************************
     *                edit course name
     ****************************************************************/

    $( "#edit_course" ).empty();
    var add_icons = "<span  id=\""+appData.currentcourse._id+"\" class=\"span_button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></span><span class= \"span_button\"><i  class=\"fa fa-trash-o\""+"aria-hidden=\"true\"></i></span>";
    $( "#edit_course" ).prepend( "<div id='course_name_edit_course'><p id='edit_course_p'>course:  "+appData.currentcourse.Course_name+" "+add_icons+" </p></div><div id='subjects'></div>");
    var html = '';

    /***************************************************************
     *                edit subjects
     ****************************************************************/



    $.each(appData.currentcourse.subjects, function(key, value){
        console.log("key: "+ key);
        console.log("value: "+ value);
        html += '<div class="edit_course_subject" id=\"'+value._id+'">';
        html += '<label class="subject_name_label"><span> subject: </span><label class=\"subject_edit_val\">'+value.name+'<span '+' class="span_button"><i class="fa fa-pencil" aria-hidden="true"></span></i><span ' +'  class="span_button"><i  class='+'"fa fa-trash-o"'+' aria-hidden="true"></i></span></label></label>';
        html += '</div>';
        var lesson_template ="";
        $.each(value.lessons, function(key, value){
            lesson_template += '<div class="edit_course_lesson" id="value._id">';
            lesson_template +='<label class="lesson_name_label"><span> lesson: </span><label class=\"lesson_edit_val\">'+value.name+'<span '+' class="span_button"><i class="fa fa-pencil" aria-hidden="true"></span></i><span ' +'  class="span_button"><i  class='+'"fa fa-trash-o"'+' aria-hidden="true"></i></span></label></label>';
            lesson_template +='</div>';
        })
        html += lesson_template;
    });


    /********************************************************
     *                   ui for add content
     ********************************************************/

    var add_subject="";
    add_subject += '<div class="edit_course_subject" id=\"add_subject\">';

    add_subject += '<label class="subject_name_label"><label class=\"subject_edit_val\">add subject<span '+' class="span_button"><i class="fa fa-plus-square-o" aria-hidden="true"></i></span></label></label>';
    add_subject += '</div>';

    $('#subjects').html(html+add_subject);


    /************************************************************************************************************
     *              add  events to all the buttons in the template     *
     ***********************************************************************************************************/

    add_event_clicks('#'+appData.currentcourse._id,function(){
        var html_content = "<input id=\"cancel_edit_course\" class=\"form_button\" type=\"button\" value=\"cancel\">"
        html_content = html_content+ "<input id=\"save_edit_course\" class=\"form_button\" type=\"button\" value=\"save\">";
        $( "#course_name_edit_course" ).append( html_content );
        var $el = $('#edit_course_p')
        var $input = $('<input id="course_btn_id" class="edit_course_btn"/>').val( $el.text() );
        $el.replaceWith( $input );
        add_event_clicks('#cancel_edit_course',function(){
            restart_edit_course();
        })

        add_event_clicks('#save_edit_course',function(){
            var data = {
                Course_name: $("#course_btn_id").val()
            };
            ajax_course_operations('PUT',"courses/"+appData.currentcourse._id,data)
        })

    });


    /**************************************************************************************
     *
     *                  Add buttons for add subject
     **************************************************************************************/
    var html_content = "<input id=\"cancel_edit_course\" class=\"form_button smbutton\" type=\"button\" value=\"cancel\">"
    html_content += "<input id=\"save_edit_course\" class=\"form_button  smbutton\" type=\"button\" value=\"save\">";


        add_event_clicks("#add_subject .fa-plus-square-o",function(){
            $("#add_subject").append(html_content);
            var $el = $("#add_subject" +" .subject_edit_val");
            var $input = $('<input class="edit_subject_btn"/>').val( $el.text() );
            $el.replaceWith( $input );

            add_event_clicks('#cancel_edit_course',function(){
                restart_edit_course();
            })
            add_event_clicks("#add_subject"+' #save_edit_course',function(){
                var data = {
                    name: $("#add_subject" +" .edit_subject_btn").val()
                };
                ajax_course_operations('POST',"courses/subjects/"+appData.currentcourse._id,data)
            })

        })





    $(".edit_course_subject").each(function() {
        var dir_id = $(this).attr('id');
        var id = "#"+dir_id+" .fa-pencil";
        var id_father = "#"+dir_id;
        add_event_clicks(id,function(){
            $(id_father +" .subject_name_label .form_button").remove();
            $(id_father).append(html_content);
            var $el = $(id_father +" .subject_edit_val");
            var $input = $('<input id='+dir_id+' class="edit_subject_btn"/>').val( $el.text() );
            $el.replaceWith( $input );

            add_event_clicks('#cancel_edit_course',function(){
               restart_edit_course();
            })
            add_event_clicks(id_father+' #save_edit_course',function(){
                var data = {
                    name: $(id_father +" .edit_subject_btn").val()
                };
                ajax_course_operations('POST',"courses/subjects/"+appData.currentcourse._id+"/"+dir_id,data)
            })

        })
    })

    /***********************************************************************************************
     *
     *                         add events to subjects
     *
     *****************************************************************************************/

    $(".edit_course_subject").each(function() {
        var dir_id = $(this).attr('id');
        var id_father = "#"+dir_id;
        add_event_clicks(id_father+' .fa-trash-o',function(){
            alert("delete subject");
            ajax_course_operations('DELETE',"courses/subjects/"+appData.currentcourse._id+"/"+dir_id)
        })
    })


    add_event_clicks('.course_name_edit_course .fa-pencil',function(){

        $( "#course_name_edit_course" ).append( html_content );
        var $el = $('#edit_course_p')
        var $input = $('<input id="course_btn_id" class="edit_course_btn"/>').val( $el.text() );
        $el.replaceWith( $input );
        add_event_clicks('#cancel_edit_course',function(){
            restart_edit_course();
        })
    })
}





/****************************************************************************************************************\
 *
 *                       General functions
 *
 * **************************************************************************************************************/


function ajax_course_operations(operation,path , data){
    console.log("path: "+ path );
    console.log("data: "+ data );
    $.ajax('/'+path , {
        type: operation,  // http method,
        crossOrigin: true,
        data:   data,
        success: function (data, status, xhr) {
            open_course(appData.currentcourse._id)
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
        }
    });
}


function restart_edit_course(){
    update_course_view();
}


function add_event_clicks(object,func){
    $(object).click(func);
}

function remove_css_class(object,css_class){
    $(object).removeClass(css_class);
}

function add_css_class(object,css_class){
    $(object).addClass(css_class);
}