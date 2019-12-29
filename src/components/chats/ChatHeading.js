import React from 'react';
import { MdKeyboardHide } from 'react-icons/md';
import { FaVideo, FaUserPlus } from 'react-icons/fa';
export default class ChatHeading extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasMedia: false,
			otherUserId: null,
			isCalling: false,
		};
		console.log(this.props)
	}
	onClickCall(){
		this.props.onOpenCall();
	}
	render() {
		const { name, numberOfUsers} = this.props;
		return (
			<div >
				<div className="chat-header">
					<div className="user-info">
						<div className="user-name">{name}</div>
						<div className="status">
							<div className="indicator"></div>
							<span>{numberOfUsers ? numberOfUsers : null}</span>
						</div>
					</div>
					<div className="options">
						<FaVideo onClick={()=>{this.onClickCall()}} />
						<FaUserPlus />
						<MdKeyboardHide />
					</div>
				</div>
				{/* <VideoCall activeChat={activeChat} user={user} /> */}
			</div>
		);
	}
}
