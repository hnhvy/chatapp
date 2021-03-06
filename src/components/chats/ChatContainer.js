import React, { Component } from 'react';
import SideBar from '../sidebar/SideBar'
import { COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, 
				TYPING, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED,
				NEW_CHAT_USER,OLD_MESSAGE,OLD_LOADER, END_OLD_LOADER } from '../../Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import { values, difference, differenceBy } from 'lodash'
export default class ChatContainer extends Component {
	constructor(props) {
	  super(props);	
	  this.openCall = false
	  this.state = {
		  chats:[],
		  users:[],
		  activeChat:null,
		  openCall:false,
		  isOldLoader:false
	  }
	  
	}

	componentDidMount() {
		const { socket } = this.props
		this.initSocket(socket)
	}
	
	componentWillUnmount() {
		const { socket } = this.props
		socket.off(PRIVATE_MESSAGE)
		socket.off(USER_CONNECTED)
		socket.off(USER_DISCONNECTED)
		socket.off(NEW_CHAT_USER)
	}
	
	initSocket(socket){
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		socket.on(PRIVATE_MESSAGE, this.addChat)
		socket.on('connect', ()=>{
			socket.emit(COMMUNITY_CHAT, this.resetChat)
		})
		socket.on(USER_CONNECTED, (users)=>{
			this.setState({ users: values(users) })
		})
		socket.on(USER_DISCONNECTED, (users)=>{
			const removedUsers = differenceBy( this.state.users, values(users), 'id')
			this.removeUsersFromChat(removedUsers)
			this.setState({ users: values(users) })			
		})
		socket.on(NEW_CHAT_USER, this.addUserToChat)
	}

	sendOpenPrivateMessage = (reciever) => {
		const { socket, user } = this.props
		const { activeChat } = this.state
		socket.emit(PRIVATE_MESSAGE, {reciever, sender:user.name, activeChat})
	}
	addUserToChat = ({ chatId, newUser }) => {
		const { chats } = this.state
		
		const newChats = chats.map( chat => {
			if(chat.id === chatId){
				return Object.assign({}, chat, { users: [ ...chat.users, newUser ] })
			}
			return chat
		})
		this.setState({ chats:newChats })
	}
	removeUsersFromChat = removedUsers => {
		const { chats } = this.state
		const newChats = chats.map( chat => {
			let newUsers = difference( chat.users, removedUsers.map( u => u.name ) )
				return Object.assign({}, chat, { users: newUsers })
		})
		this.setState({ chats: newChats })
	}
	onOpenCall(){
		if(this.openCall) this.openCall = false
		else this.openCall = true
	}

	/*
	*	Reset the chat back to only the chat passed in.
	* 	@param chat {Chat}
	*/
	resetChat = (chat)=>{
		return this.addChat(chat, true)
	}

	/*
	*	Adds chat to the chat container, if reset is true removes all chats
	*	and sets that chat to the main chat.
	*	Sets the message and typing socket events for the chat.
	*	
	*	@param chat {Chat} the chat to be added.
	*	@param reset {boolean} if true will set the chat as the only chat.
	*/
	addChat = (chat, reset = false)=>{
		const { socket } = this.props
		const { chats } = this.state

		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat})

		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		
		const typingEvent = `${TYPING}-${chat.id}`
		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
		const oldLoaderEvent = `${OLD_LOADER}-${chat.id}`;
		console.log(oldLoaderEvent)
		let chatID = chat.id
		socket.on(oldLoaderEvent, (message, sender)=>{
			if(!this.state.isOldLoader){
				console.log(message, sender)
				const { chats } = this.state
				let newChats = chats.map((chat)=>{
					if(chat.id === chatID)
						chat.messages.push(message)
					return chat
				})
				this.setState({chats:newChats})}
		});
		const endOldEvt  =  `${END_OLD_LOADER}-${chat.id}` 
		socket.on(endOldEvt, ()=>{
			console.log("Chét clmm")
			this.setState({isOldLoader: true});
		});
	}

	/*
	* 	Returns a function that will 
	*	adds message to chat with the chatId passed in. 
	*
	* 	@param chatId {number}
	*/
	addMessageToChat = (chatId)=>{
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat)=>{
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({chats:newChats})
		}
	}

	/*
	*	Updates the typing of chat with id passed in.
	*	@param chatId {number}
	*/
	updateTypingInChat = (chatId) =>{
		return ({isTyping, user})=>{
			if(user !== this.props.user.name){

				const { chats } = this.state

				let newChats = chats.map((chat)=>{
					if(chat.id === chatId){
						if(isTyping && !chat.typingUsers.includes(user)){
							chat.typingUsers.push(user)
						}else if(!isTyping && chat.typingUsers.includes(user)){
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({chats:newChats})
			}
		}
	}

	/*
	*	Adds a message to the specified chat
	*	@param chatId {number}  The id of the chat to be added to.
	*	@param message {string} The message to be added to the chat.
	*/
	sendMessage = (chatId, message)=>{
		const { socket } = this.props
		socket.emit(MESSAGE_SENT, {chatId, message} )
	}

	/*
	*	Sends typing status to server.
	*	chatId {number} the id of the chat being typed in.
	*	typing {boolean} If the user is typing still or not.
	*/
	sendTyping = (chatId, isTyping)=>{
		const { socket } = this.props
		socket.emit(TYPING, {chatId, isTyping})
	}

	setActiveChat = (activeChat)=>{
		this.setState({activeChat})
		const { socket } = this.props

		socket.emit(OLD_MESSAGE,activeChat);
		

		if(activeChat.isCommunity)
			activeChat.messages = ["cc"];
	}
	render() {
		const { user, logout } = this.props
		const { chats, activeChat, users,openCall } = this.state
	
		return (
			<div className="container">
				<SideBar
					logout={logout}
					chats={chats}
					user={user}
					users={users}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					onSendPrivateMessage={this.sendOpenPrivateMessage}
					/>
				<div className="chat-room-container">
					{
						activeChat !== null ? (
							<div className="chat-room">
								<ChatHeading name={activeChat.name}
									messages={activeChat.messages}
									user={user}
									onOpenCall = {()=>{this.openCall=!this.openCall;this.setState({openCall:this.openCall});}}
									activeChat = {activeChat}
									typingUsers={activeChat.typingUsers} />
								<Messages 
									messages={activeChat.messages}
									user={user}
									activeChat = {activeChat}
									openCall = {openCall}
									typingUsers={activeChat.typingUsers}
									/>
									
								<MessageInput 
									sendMessage={
										(message)=>{
											this.sendMessage(activeChat.id, message)
										}
									}
									sendTyping={
										(isTyping)=>{
											this.sendTyping(activeChat.id, isTyping)
										}
									}
									/>

							</div>
						):
						<div className="chat-room choose">
							<h3>Choose a chat!</h3>
						</div>
					}
				</div>

			</div>
		);
	}
}