/**
 * Created by shmuel on 11/27/2017.
 */
var fs = require('fs');
var unzip = require('unzip');
var extract = require('extract-zip'),
xml2js = require('xml2js');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var mkdirp = require('mkdirp');
var mv = require('mv');
async = require("async");

var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    Subject = mongoose.model('Subject'),
    Lesson = mongoose.model('Lesson'),
    Marker = mongoose.model('Marker');


//constant variabels for all the module

var storage_data = {
    root_folder: appDir,
    unzip_folder : appDir+"/unzip/",
    upload_folder: appDir+"/uploads/",
    lesson_config : "_config.xml",
    xml_path : '["x:xmpmeta"]["rdf:RDF"]["0"]["rdf:Description"]["0"]["xmpDM:Tracks"]["0"]["rdf:Bag"]["0"]["rdf:li"]["0"]["rdf:Description"]["0"]["xmpDM:markers"]',
    video_storage : appDir.substring(0,appDir.indexOf("todoListApi"))+"content"
}






  function upload_video(file_name , original_name,callback){

     var lesson_data = {
         lesson : new Lesson({link:"",name:"",markers:[],folder_name:""}),
         user_file_name : original_name,
         node_file_name : file_name,
         folder_name: ""
     }

      try{
          fs.rename(storage_data.upload_folder+file_name, storage_data.upload_folder+original_name);

      }
      catch(err){
          console.log(err);
      }


      var type = getExtension(original_name);
      var source =  storage_data.upload_folder+original_name;


      //check if the file is mp4 or zip/rar
      //other files the frontend should block
      switch(type) {
          case "zip":
              lesson_data.folder_name = original_name.substring(0,original_name.indexOf("."))
              extract(source, {dir: storage_data.unzip_folder}, function (err) {
                  if(err){
                      console.log(err);
                  }
                  else{
                      read_xml_config(original_name.substring(0,original_name.indexOf(".")),function(err){
                          return callback(null,lesson_data);
                      });
                  }
              })
              console.log("zip file upload");
              break;

          case "mp4":
              lesson_data.lesson.link = original_name;
              return (lesson_data);
              break;
          default:
              console.log("wrong file upload");
      }

      function read_xml_config(file_name,callback){
          var parser = new xml2js.Parser();
          console.log("I am before the read xml file");
          fs.readFile( storage_data.unzip_folder+file_name+"/"+file_name+storage_data.lesson_config, function(err, data) {
              parser.parseString(data, function (err, result) {
                  var data;

                  //with markers
                  try{

                      data = result["x:xmpmeta"]["rdf:RDF"]["0"]["rdf:Description"]["0"]["xmpDM:Tracks"]["0"]["rdf:Bag"]["0"]["rdf:li"]["0"]["rdf:Description"]["0"]["xmpDM:markers"]["0"]["rdf:Seq"]["0"]["rdf:li"];
                      for(var i =0 ; i< data.length ;i++) {
                          lesson_data.lesson.markers.push(new Marker ({link :data[i]["rdf:Description"]["0"].$["tscDM:file"],name:data[i]["rdf:Description"]["0"].$["xmpDM:name"]}));
                      }
                      return callback(null);
                  }
                      //without markers
                  catch(err){
                      lesson_data.lesson.link = result["x:xmpmeta"]["rdf:RDF"]["0"]["rdf:Description"]["0"]["tscDM:contentList"]["0"]["rdf:Description"]["0"]["tscDM:files"]["0"]["rdf:Seq"]["0"]["rdf:li"]["0"].$["xmpDM:value"];
                      return callback(null);
                  }
              });
          });
      }
    };

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}




function save_lesson_video(req ,data,callback){
      /*  if(data.lesson.markers.length > 0){
            //for every marker create folder with the mp4 file
            for (var i = 0 ; i < data.lesson.markers.length;i++){

            }
            console.log("I have markers");
            return callback(null);
        }
        else{*/
            ensureExists(storage_data.video_storage+"/"+req.params.courseId+"/"+req.params.subjectId+"/"+req.params.lessonId+"/",data,function(err){
                if(err){
                    return callback(new Error (err));
                }
                else{

                    return callback(null);
                }
            })
        //}
}

function ensureExists(path,data,cb) {

    if(data.lesson.markers.length > 0){

      /*  async.each(items, function (item, callback) {
            connection.getFileInfo(result, callback);
        }, function (err) {
            console.log('All done');
        });
*/
        async.each(data.lesson.markers, function (marker, cb) {
            mv(storage_data.unzip_folder + data.folder_name + "/" + marker.link, path + marker.link, {mkdirp: true}, function (err) {
                if (err) {
                    console.log("storage fails");
                    return cb(err);
                }
                else{
                    console.log("storage succeed");
                    return cb(new Error("dfhfhfghfg"));
                }
            })
        }, function (err) {
                if (err) {
                    console.log('ERROr');
                    return cb(err)
                }
                else {
                    console.log('All done');
                    return cb(null);

                }
            })
    }

    /*    //for every marker create folder with the mp4 file
        for (var i = 0 ; i < data.lesson.markers.length;i++){
            mv(storage_data.unzip_folder+data.folder_name+"/"+data.lesson.markers[i].link, path+data.lesson.markers[i].link, {mkdirp: true}, function(err) {
                if (err){
                    console.log("storage fails");
                    return cb(err);
                }
                else{
                    console.log("storage succedd");
                        cb(null);
                }
            });
        }
    }
    */
    else{
        mv(storage_data.unzip_folder+data.folder_name+"/"+data.lesson.link, path+data.lesson.link, {mkdirp: true}, function(err) {
            if (err){
                console.log("storage fails");
                return cb(err);
            }
            else{
                console.log("storage succedd");
                cb(null);
            }
        });
    }
}

function delete_files(original_name,middle_name,current_name){
  rmDir(appDir+"/unzip/");
    rmDir(appDir+"/uploads/");
}

rmDir = function(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
};


module.exports.upload_video = upload_video;
module.exports.save_lesson_video = save_lesson_video ;
module.exports.delete_files = delete_files ;

































/**
 * async rename func
 fs.rename(storage_data.upload_folder+file_name, storage_data.upload_folder+original_name, function(err) {
        if ( err ) {
            console.log('ERROR: ' + err);
        }
        else{
        }
    });
 */

/*

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
*/