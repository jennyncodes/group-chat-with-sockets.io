//imports
var express = require("express");
var fs = require("fs");
var port = 8000;
var bodyparser = require("body-parser");
var app = express();
var id =0;
var messages={};
var users= {};

//config
app.set("view engine", "ejs");
app.set("views", __dirname + "/views" );
app.use(express.static(__dirname + "/static"));
app.use(bodyparser.urlencoded({extended: true}));


//port
var server=app.listen(port, function(){
    console.log(`Listening on port ${port}...`)
});


//route
app.get('/', function(req, res) {
	res.render("index"); 
})

//sockets
var io = require('socket.io').listen(server)
io.sockets.on('connection', function (socket){
    console.log("Client/socket is connected!");
    console.log("Client/socket id is :", socket.id);

	socket.on("new_user", function(data){
		users[socket.id] = {name:data.name};
		socket.emit('existing_messages', messages);
		io.emit("display_new_user", {name:data.name})
	});
	socket.on("new_message", function(data){
		messages[id] = {name:data.name, message:data.message};
		io.emit("update_messages", messages[id]);
		id++;
	})
	socket.on("disconnect", function(){
		io.emit("user_disconnect", users[socket.id])
	})
       
});
