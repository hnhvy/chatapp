  
import React, { Component } from 'react';
import MediaHandler from '../components/Call/MediaHandler';
import Pusher from 'pusher-js';
// import Peer from 'simple-peer';
import Peer from 'peerjs';

export default class VideoCall extends Component {
    constructor(props) {
		super(props);
        this.state = {
            hasMedia: false,
            otherUserId: null
        };
        this.other = "";
        this._isload = false
        console.log(this.props.activeChat);
        // console.log(this.props.activeChat);
        this.user = this.props.user
        
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
            forceTLS: true
          });
        console.log(this.user)
        this.channel = this.pusher.subscribe('presence-video-channel');

        this.channel.bind(`client-signal-${this.user.id}`, (signal) => {
            let peer = this.peers[signal.userId];
            console.log("bind"+this.user.id)
            // if peer is not already exists, we got an incoming call
            if(peer === undefined) {
                this.setState({otherUserId: signal.userId});
                peer = this.startPeer(signal.userId, false);
            }

            peer.signal(signal.data);
        });
    }

    startPeer(userId, initiator = true) {
        const peer = new Peer({
            initiator,
            stream: this.user.stream,
            trickle: false
        });

        peer.on('signal', (data) => {
            console.log(`client-signal-${userId}`)
            this.channel = this.pusher.subscribe('presence-video-channel');
            this.channel.trigger(`client-signal-${userId}`, {
                type: 'signal',
                userId: this.user.id,
                data: data
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
            if(peer !== undefined) {
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
        if(!this.props.activeChat.isCommunity && !this._isload){
          
            this.peer = new Peer(this.props.activeChat.id + this.user.name); 
            console.log(this.peer)
            this.props.activeChat.users.map( (e) => {
                this.other = (e === this.user.name)?this.other:this.props.activeChat.id+e;
                // console.log(other)
            });
            console.log("MYID",this.props.activeChat.id + this.user.name)
           
            const conn = this.peer.connect(this.other);
            conn.on('open', () => {
                conn.send('hi!');
                console.log("Say hi")
            });
            this._isload = true
            this.mediaHandler = new MediaHandler();
        }
        if(this._isload){
            
            this.peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                  // Will print 'hi!'
                  console.log(data);
                });
              });
            this.peer.on('call', (call) => {
                this.mediaHandler.getPermissions()
                .then((stream) => {
                  call.answer(stream); // Answer the call with an A/V stream.
                  call.on('stream', (remoteStream) => {
                    // Show stream in some <video> element.
                    console.log(remoteStream)
                  //  this.user.stream = remoteStream;
                        try {
                            this.userVideo.srcObject = remoteStream;
                        } catch (e) {
                            this.userVideo.src = URL.createObjectURL(remoteStream);
                        }
                        this.userVideo.play();
                  });
                }, (err) => {
                  console.error('Failed to get local stream', err);
                });
              });
        }
        
        return (
            <div className="App">
                {/* {[1,2,3,4].map((userId) => {
                    return this.user.id !== userId ? <button key={userId} onClick={() => this.callTo(this.props.activeChat.id)}>Call {userId}</button> : null;
                })} */}
                {/* {this.props.activeChat.id}
                {this.props.user.id} */}
                <div className="video-container">
                <button  onClick={() =>  {
                    this.mediaHandler.getPermissions()
                    .then((stream) => {
                        this.setState({hasMedia: true});
                        this.user.stream = stream;
                        const call = this.peer.call(this.other, stream);
                        console.log(call)
                        call.on('stream', (remoteStream) => {
                            this.setState({hasMedia: true});
                                this.user.stream = remoteStream;
                                try {
                                    this.myVideo.srcObject = remoteStream;
                                } catch (e) {
                                    this.myVideo.src = URL.createObjectURL(remoteStream);
                                }
                                this.myVideo.play();
                            
                        }, (err) => {
                            console.error('Failed to get local stream', err);
                        });
                        // try {
                        //     this.myVideo.srcObject = stream;
                        // } catch (e) {
                        //     this.myVideo.src = URL.createObjectURL(stream);
                        // }

                        //this.myVideo.play();
                    });
                    
                    }}
                     
            // navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
            //     console.log("any")
            //                                             const call = this.peer.call(this.other, stream);
            //                                             console.log(call)
            //                                             call.on('stream', (remoteStream) => {
            //                                                 this.setState({hasMedia: true});
            //                                                     this.user.stream = remoteStream;
            //                                                     try {
            //                                                         this.myVideo.srcObject = remoteStream;
            //                                                     } catch (e) {
            //                                                         this.myVideo.src = URL.createObjectURL(remoteStream);
            //                                                     }
            //                                                     this.myVideo.play();
            //                                             });
            //                                         }, (err) => {
            //                                             console.error('Failed to get local stream', err);
            //                                         })}}
                                                    >
                                                       Call 
                                                    </button> 
                {/* {this.state.otherUserId} */}
                    <video className="my-video" ref={(ref) => {this.myVideo = ref;}}></video>
                    <video className="user-video" ref={(ref) => {this.userVideo = ref;}}></video>
                </div>
            </div>
        );
    }
}
