/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import MediaHandler from '../components/Call/MediaHandler';
import Pusher from 'pusher-js';
// import Peer from 'simple-peer';
import Peer from 'peerjs';
// import call from '../asset/'
import Call from '../../src/asset/call.png'
import End from '../../src/asset/end.png'
export default class VideoCall extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasMedia: false,
			otherUserId: null,
			isCalling: false,
		};
		this.other = '';
		this._isload = false;
		this._isRemoted = false;
		this._isStreamed = false;
		console.log(this.props.activeChat);
		// console.log(this.props.activeChat);
        this.user = this.props.user;
        this.call = null;
        this.inComming = null;

		// this.setupPusher();
		// this.callTo = this.callTo.bind(this);
		// this.setupPusher = this.setupPusher.bind(this);
		// this.startPeer = this.startPeer.bind(this);
	}

	componentWillMount() {
		// this.mediaHandler.getPermissions()
		//     .then((stream) => {
		//         this.setState({hasMedia: true});
		//         this.user.stream = stream;
		//         try {
		//             this.myVideo.srcObject = stream;
		//         } catch (e) {
		//             this.myVideo.src = URL.createObjectURL(stream);
		//         }
		//         this.myVideo.play();
		//     })
		// if(!this.props.activeChat.isCommunity){
		//     console.log(this.props.activeChat)
		//     const peer = new Peer(this.props.activeChat.id + this.user.username);
		//     var other = "";
		//     this.props.activeChat.user.map( (e) => {
		//         other = (e === this.user.username)?"":this.props.activeChat.id+e;
		//     });
		//     const conn = peer.connect(this.props.activeChat.id);
		//     conn.on('open', () => {
		//         conn.send('hi!');
		//         console.log("Say hi")
		//     });
		//     peer.on('call', (call) => {
		//         navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
		//           call.answer(stream); // Answer the call with an A/V stream.
		//           call.on('stream', (remoteStream) => {
		//             // Show stream in some <video> element.
		//             this.user.stream = remoteStream;
		//                 try {
		//                     this.userVideo.srcObject = remoteStream;
		//                 } catch (e) {
		//                     this.userVideo.src = URL.createObjectURL(remoteStream);
		//                 }
		//                 this.userVideo.play();
		//           });
		//         }, (err) => {
		//           console.error('Failed to get local stream', err);
		//         });
		//       });
		//     this.mediaHandler = new MediaHandler();
		//     navigator.mediaDevices.getUserMedia({video: true, audio: false}, (stream) => {
		//         const call = peer.call(other, stream);
		//         call.on('stream', (remoteStream) => {
		//             this.setState({hasMedia: true});
		//                 this.user.stream = remoteStream;
		//                 try {
		//                     this.myVideo.srcObject = remoteStream;
		//                 } catch (e) {
		//                     this.myVideo.src = URL.createObjectURL(remoteStream);
		//                 }
		//                 this.myVideo.play();
		//         });
		//     }, (err) => {
		//         console.error('Failed to get local stream', err);
		//     });
		// }
	}

	setupPusher() {
		this.pusher = new Pusher('e75071eb23c8dbd2c3e2', {
			cluster: 'ap1',
			forceTLS: true,
		});
		console.log(this.user);
		this.channel = this.pusher.subscribe('presence-video-channel');

		this.channel.bind(`client-signal-${this.user.id}`, signal => {
			let peer = this.peers[signal.userId];
			console.log('bind' + this.user.id);
			// if peer is not already exists, we got an incoming call
			if (peer === undefined) {
				this.setState({ otherUserId: signal.userId });
				peer = this.startPeer(signal.userId, false);
			}

			peer.signal(signal.data);
		});
	}

	startPeer(userId, initiator = true) {
		const peer = new Peer({
			initiator,
			stream: this.user.stream,
			trickle: false,
		});

		peer.on('signal', data => {
			console.log(`client-signal-${userId}`);
			this.channel = this.pusher.subscribe('presence-video-channel');
			this.channel.trigger(`client-signal-${userId}`, {
				type: 'signal',
				userId: this.user.id,
				data: data,
			});
		});

		// peer.on('stream', (stream) => {
		//     console.log("DCMMMMMMMMMMMMMMMMm")
		//     try {
		//         this.userVideo.srcObject = stream;
		//     } catch (e) {
		//         this.userVideo.src = URL.createObjectURL(stream);
		//     }

		//     this.userVideo.play();
		// });

		peer.on('close', () => {
			let peer = this.peers[userId];
			if (peer !== undefined) {
				peer.destroy();
			}

			this.peers[userId] = undefined;
		});

		return peer;
	}

	callTo(userId) {
		this.peers[userId] = this.startPeer(userId);
	}

	render() {
		if (!this.props.activeChat.isCommunity && !this._isload) {
			
			var myid = "";
			this.props.activeChat.users.map((e,i) => {
				this.other = e === this.user.name ? this.other : this.props.activeChat.id + i;
				myid = e !== this.user.name ? myid : this.props.activeChat.id + i;
				// console.log(other)
				console.log("PEERID", this.other)
			});
			
			console.log('MYID', myid);
			this.peer = new Peer(myid);
			console.log(this.peer);
			const conn = this.peer.connect(this.other);
			conn.on('open', () => {
				conn.send('hi!');
				console.log('Say hi');
			});
			this._isload = true;
			this.mediaHandler = new MediaHandler();
		}
		if (this._isload) {
			this.peer.on('connection', conn => {
				conn.on('data', data => {
					// Will print 'hi!'
					console.log(data);
				});
			});
			this.peer.on('call', call => {
				this.mediaHandler.getPermissions().then(
					stream => {
                        call.answer(stream); // Answer the call with an A/V stream.
                        this.setState({ isCalling: true });
                        this.inComming = call
						call.on('stream', remoteStream => {
							// Show stream in some <video> element.
							console.log(remoteStream);
							//  this.user.stream = remoteStream;
							try {
								if (!this._isRemoted) {
									this.userVideo.srcObject = remoteStream;
									this._isRemoted = true;
								}
							} catch (e) {
								this.userVideo.src = URL.createObjectURL(remoteStream);
							}
							this.userVideo.play();
						});
						call.on('close', () => {
							if(stream)
								stream.getTracks().forEach(function(track) {
									track.stop();
								});
							this.setState({ isCalling: false });
						});
						try {
							this.myVideo.srcObject = stream;
						} catch (e) {
							this.userVideo.src = URL.createObjectURL(stream);
						}

						this.myVideo.play();
					},
					err => {
						console.error('Failed to get local stream', err);
					}
				);
			});
		}
		const { isCalling } = this.state;
		const { openCall } = this.props;
		console.log(openCall);
		return (
			<div className="App">
				{openCall === true || isCalling ? (
					<div className="container">
						<div className="video-container">
							<video
								className="my-video"
								ref={ref => {
									this.myVideo = ref;
								}}
							></video>
							<video
								className="user-video"
								ref={ref => {
									this.userVideo = ref;
								}}
							></video>
						</div>

						<img width="100px" height="100px"
							onClick={() => { 
								if (!isCalling) {

									this.mediaHandler.getPermissions().then(stream => {
										this.setState({ hasMedia: true });
										this.user.mystream = stream;
										const call = this.peer.call(this.other, stream);
										console.log(call);
                                        this.call = call;
										call.on(
											'stream',
											remoteStream => {
												this.setState({ isCalling: true });
												this.setState({ hasMedia: true });
												this.user.stream = remoteStream;
												try {
													this.userVideo.srcObject = remoteStream;
													this._isStreamed = false;
												} catch (e) {
													this.userVideo.src = URL.createObjectURL(remoteStream);
												}
												this.userVideo.play();
											},
											err => {
												console.error('Failed to get local stream', err);
											}
										);
										call.on('close', () => {
											if(this.user.stream)
											this.user.stream.getTracks().forEach(function(track) {
												track.stop();
											});
											if(this.user.mystream)
											this.user.mystream.getTracks().forEach(function(track) {
												track.stop();
											});
											this.setState({ isCalling: false });
											// this.myVideo.stop();
										});
										try {
											this.myVideo.srcObject = stream;
										} catch (e) {
											this.myVideo.src = URL.createObjectURL(stream);
										}
										this.myVideo.play();
									});
								} else {
									if(this.call)this.call.close();
                                    if(this.inComming) this.inComming.close()
									this.setState({ isCalling: false });
									if(this.user.mystream) this.user.mystream.getTracks().forEach(function(track) {
												track.stop();
											});
								}
							}}
							src={!isCalling ? Call : End}
					/>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}
