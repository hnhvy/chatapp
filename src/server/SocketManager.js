const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
		LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
		TYPING, PRIVATE_MESSAGE, NEW_CHAT_USER, OLD_MESSAGE  } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = { }

let communityChat = createChat({ isCommunity:true })
var mysql = require('mysql');
 
console.log('Get connection ...');
 
var conn = mysql.createConnection({
  database: 'chat',
  host: "localhost",
  user: "root",
  password: ""
});
 
conn.connect(function(err) {
  if (err) throw err;
  console.log("SQL Connected!");
});

module.exports = function(socket){
					
	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;
	let sendMessageToChatFromOld;

	let sendTypingFromUser;

	socket.on(OLD_MESSAGE, (active)=>{
		console.log(active);
		let sender = active.users[0];
		let reciever = active.users[1];
		let sql = `select * from connection where p1 = "${sender}" and p2="${reciever}" or p2 = "${sender}" and p1="${reciever}" `;
		console.log(sql)
		//let sql = `INSERT INTO connection value ('',"${sender}", "${reciever}","${newChat.id}","${recieverSocket}")`;
		conn.query(sql, function(err, results) {
			if (err) throw err;
			if (results.length == 0 && !active.isCommunity){
				sql = `insert connection value ('',"${sender}","${reciever}","${active.id}","${sender} connected with ${reciever}")`
				conn.query(sql, function(err, results) {
					if (err) throw err;
				});
			}
			results.map((e) => {
				let message = e.msg
				let p1 = e.p1
				// console.log(sender)
				console.log(p1)
				if(p1!==sender)
				// console.log(e.msg )
				io.emit(`${MESSAGE_RECIEVED}-${active.id}`, createMessage({message,p1}))
				else
				sendMessageToChatFromOld(active.id, message)
				//sendMessageToChat(reciever);
			});
		});
		 sql = `update connection set p1sid="${active.id}"  where p1 = "${sender}" and p2="${reciever}"  or p2 = "${sender}" and p1="${reciever}"`;
		console.log(sql);
		conn.query(sql, function(err, results) {
			if (err) throw err;
		});

		
		// console.log(sender);
	})
	//Verify Username
	socket.on(VERIFY_USER, (nickname, callback)=>{
		if(isUser(connectedUsers, nickname)){
			callback({ isUser:true, user:null })
		}else{
			var us = createUser({name:nickname, socketId:socket.id})
			callback({ isUser:false, user:us})
			
			let sql = `select * from connection where p1 = "${nickname}" `;
			console.log(sql);
			var old_p1="";
			conn.query(sql, function(err, results) {
				if (err) throw err;
				if(results.length>0){
					
				old_p1 = results[0].p1sid;
				let sql = `update connection set p1sid = "${us.id}" where p1="${nickname}" `;
				console.log(sql);
				conn.query(sql, function(err, results) {
					if (err) throw err;
				});
				/* sql = `update message set sender = "${us.id}" where sender="${old_p1}"`;
				 console.log(sql);
				 conn.query(sql, function(err, results) {
					if (err) throw err;
				});*/
				}
			});
			}
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user)=>{
		user.socketId = socket.id
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user

		sendMessageToChatFromUser = sendMessageToChat(user.name)
		sendMessageToChatFromOld = sendMessageToOld(user.name)
		sendTypingFromUser = sendTypingToChat(user.name)

		io.emit(USER_CONNECTED, connectedUsers)
		console.log(connectedUsers);

	})
	
	//User disconnects
	socket.on('disconnect', ()=>{
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})


	//User logsout
	socket.on(LOGOUT, ()=>{
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback)=>{
		callback(communityChat)
	})

	socket.on(MESSAGE_SENT, ({chatId, message})=>{
		sendMessageToChatFromUser(chatId, message)
	})

	socket.on(TYPING, ({chatId, isTyping})=>{
		sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, ({reciever, sender, activeChat})=>{
		if(reciever in connectedUsers){
			const recieverSocket = connectedUsers[reciever].socketId
			if(activeChat === null || activeChat.id === communityChat.id){
				const newChat = createChat({ name:`${reciever}&${sender}`, users:[reciever, sender] })
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
				socket.emit(PRIVATE_MESSAGE, newChat)
				console.log("if đầu, new chat");
				
			}else{
				if(!(reciever in activeChat.users)){
					activeChat.users
										.filter( user => user in connectedUsers)
										.map( user => connectedUsers[user] )
										.map( user => {
											socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever })
										} )
										socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever } )
										console.log("if 2, new chat user");

				}
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat)
				
			
			}
			
		}
	})

}
/*
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user){
	return (chatId, isTyping)=>{
		io.emit(`${TYPING}-${chatId}`, {user, isTyping})
	}
}

/*
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendMessageToChat(sender){
	return (chatId, message)=>{
		// let sql = `INSERT INTO message value ('',"${chatId}", "${message}","${sender}")`;
		// console.log(sql);
		// conn.query(sql, function(err, results) {
		// 	if (err) throw err;
		// });
		let sql = "";
		sql = `select * from connection where p1sid = "${chatId}" limit 1`;
		console.log(sql);
		//let sql = `INSERT INTO connection value ('',"${sender}", "${reciever}","${newChat.id}","${recieverSocket}")`;
		console.log(sql);
		conn.query(sql, function(err, results) {
			if (err) throw err;
			results.map((e) => {
				let reciever = (sender === e.p1)? e.p2: e.p1
				sql = `insert connection value ('',"${sender}","${reciever}","${chatId}","${message}")`
				console.log(sql )
				conn.query(sql, function(err, results) {
					if (err) throw err;
				});
				//sendMessageToChat(reciever);
			});
		});
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
	}
}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user){
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username){
  	return username in userList
}
function sendMessageToOld(sender){
	return (chatId, message)=>{
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
	}
}