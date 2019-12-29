import React , { Component, Fragment} from 'react'

import VideoCall from '../videoCall';
export default class Messages extends React.Component {
	constructor(props) {
		super(props);
			this.scrollDown = this.scrollDown.bind(this)

	}

	scrollDown(){
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}

		componentDidMount(){
			this.scrollDown()
		}

		componentDidUpdate(prevProps, prevState) {
			this.scrollDown()
		}

	render() {
		const { messages, user, typingUsers, activeChat,openCall} = this.props
		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
		console.log(openCall)
		return (
			<div ref='container'
				className="thread-container">
				<div className = "thread">
				{
					messages.map((mes, i)=>{
						console.log(mes.message.length)
						return (
							<div
								key={mes.id}
								className={`message-container ${mes.sender == user.name && 'right'}`}
							>
							{mes.message.includes("|") && base64regex.test(mes.message.split("|")[1].split(',')[1])?(
								mes.message.split("|")[1].startsWith("data:image/")?
								(<img className="mess-img" src = {mes.message.split("|")[1]}/>):
								(
									<a download={mes.message.split("|")[0]} href={mes.message.split("|")[1]}>{mes.message.split("|")[0]} Download</a>
								)
								
							):(
								<Fragment>
								<div className="time">{mes.time}</div>
								<div className="data">
									<div className="message">{mes.message}</div>
									<div className="name">{mes.sender}</div>
								</div>
								</Fragment>)}
								</div>
							)
						})	
					
					}
				
					<VideoCall openCall={openCall} activeChat={activeChat} user={user}/>	
					{
						typingUsers.map((name)=>{
							return(
								<div key={name} className="typing-user">
									{`${name} is typing . . .`}
								</div>
								)
						})
					}
			</div>
			</div>
		)
	}
}