var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    Task = require('./api/models/todolistModel'),
    Video = require('./api/models/videoModel'),
    //created model loading here
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://videoserverdb:f6NeQIsU2tS54qS0mOy0sc7DwBeg6YvcOZDN4DD1lFMApSlCgy50f0enwUA2PSGOqrqvdzRqh5fckrkaVXn8yw==@videoserverdb.documents.azure.com:10255/mydb?ssl=true');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

var routesTasks = require('./api/routes/todolistRouter'); //importing route
routesTasks(app); //register the route
var routesVideo = require('./api/routes/videoRouter'); //importing route
routesVideo(app);

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);