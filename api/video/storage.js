/**
 * Created by shmuel on 11/27/2017.
 */
var fs = require('fs');
var unzip = require('unzip');
var Unrar = require('node-unrar-update');
var extract = require('extract-zip')


var dest = "C:/Users/shmuel/WebstormProjects/mongoDBvideo/todoListApi/unzip"








  function upload_video(file_name , original_name){
       var lessons_names;
      //change to the original name
      fs.rename('./uploads/'+file_name, './uploads/'+original_name, function(err) {
        if ( err ) {
            console.log('ERROR: ' + err);
        }
        else{
            //change to the original name
            console.log(original_name+ "saved");
        }
    });
      var type = getExtension(original_name);
      var source =  './uploads/'+original_name;
      //dev comment
      console.log("the type is:  "+type);
      //check if the file is mp4 or zip/rar
      //other files the frontend should block
      switch(type) {

          case "rar":
              console.log("rar file upload");
              var rar = new Unrar(source);
              rar.extract(dest, null, function (err) {
                  if(err){
                      console.log(err);
                  }
                  else{
                      console.log("rar file upload succeeded");
                  }
              });
              break;
          case "zip":
              extract(source, {dir: dest}, function (err) {
                  console.log(err);
              })

              console.log("zip file upload");
          case "mp4":
              lessons_names = {
                  link : original_name
              }
              break;
          default:
              console.log("wrong file upload");
      }


      //check if the file is mp4 or zip/rar
      //other files the frontend should block
      //type_check();

      //if the file is zip open and read the xml part
      //open_zip();
      //read_xml();
      //if the file has one mp4 file save the file name at the content field of lesson
      //check_markers();
      //if the file  has markers save the file names as at the markers content and save
      //return lessons_names;
      //give back the file names if the filas has markers
      return lessons_names;

    };


    function film102 (){
        console.log("I am storage function");
    }
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}


module.exports.upload_video = upload_video;
module.exports.film102 = film102;