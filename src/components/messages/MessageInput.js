import React, { Component } from 'react';
import attachLogo from '../../asset/attach.png';
export default class MessageInput extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	message:"",
	  	isTyping:false
	  };

	}
	clickFile = null;
	
	handleSubmit = (e)=>{
		e.preventDefault()
		this.sendMessage()
		this.setState({message:""})
	}

	sendMessage = ()=>{
		this.props.sendMessage(this.state.message)

	}

	componentWillUnmount() {
	  this.stopCheckingTyping()
	}
	handleChangeImage = (evt) => {
		console.log("Uploading");
		var self = this;
		var reader = new FileReader();
		var file = evt.target.files[0];
		var filename = file.name
		
		reader.onload = function(upload) {
	
			self.setState({
				image: upload.target.result
			});
		};
		reader.readAsDataURL(file); 
		setTimeout(function() {
		  console.log(self.state.image);
		  //self.setState({mesage:self.state.image})
		  //self.sendMessage()
		  self.props.sendMessage(filename+"|"+self.state.image)
		}, 3000);		
	}
	sendTyping = ()=>{
		this.lastUpdateTime = Date.now()
		if(!this.state.isTyping){
			this.setState({isTyping:true})
			this.props.sendTyping(true)
			this.startCheckingTyping()
		}
	}

	/*
	*	startCheckingTyping
	*	Start an interval that checks if the user is typing.
	*/
	startCheckingTyping = ()=>{
		console.log("Typing");
		this.typingInterval = setInterval(()=>{
			if((Date.now() - this.lastUpdateTime) > 300){
				this.setState({isTyping:false})
				this.stopCheckingTyping()
			}
		}, 300)
	}
	
	/*
	*	stopCheckingTyping
	*	Start the interval from checking if the user is typing.
	*/
	stopCheckingTyping = ()=>{
		console.log("Stop Typing");
		if(this.typingInterval){
			clearInterval(this.typingInterval)
			this.props.sendTyping(false)
		}
	}


	render() {
		const { message } = this.state
		return (
			<div className="message-input">
				<form 
					onSubmit={ this.handleSubmit }
					className="message-form">

					<input 
						id = "message"
						ref = {"messageinput"}
						type = "text"
						className = "form-control"
						value = { message }
						autoComplete = {'off'}
						placeholder = "Type something interesting"
						onKeyUp = { e => { e.keyCode !== 13 && this.sendTyping() } }
						onChange = {
							({target})=>{
								this.setState({message:target.value})
							}
						}
						/>
					<button
						disabled = { message.length < 1 }
						type = "submit"
						className = "send"
					> Send </button>
					<img alt="acttach file" src={attachLogo} height='40' width='40'  onClick={()=>{this.clickFile.click()}} />
				</form>
				<input style={{display:'none'}} ref="file" type="file" name="file" 
                              className="upload-file" 
                              id="file"
							  ref={input => this.clickFile = input}
                              onChange={this.handleChangeImage}
                              encType="multipart/form-data" 
                              required/>
			</div>
		);
	}
}