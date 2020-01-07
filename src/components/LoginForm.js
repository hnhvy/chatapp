import React, { Component } from 'react';
import { VERIFY_USER } from '../Events';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import '../login.css';
const config = {
	apiKey: 'AIzaSyBrC1cEI0DrFZ8yN7VIUn7LDkXhzI5XX2s',
	authDomain: 'instakilogram-14d79.firebaseapp.com',
	databaseURL: 'https://instakilogram-14d79.firebaseio.com',
	projectId: 'instakilogram-14d79',
	storageBucket: 'instakilogram-14d79.appspot.com',
	messagingSenderId: '409839865244',
	appId: '1:409839865244:web:775316685369be1e498c59',
	measurementId: 'G-YW2M3SYNK7',
};

var firebaseApp = null;
if (!firebase.apps.length) {
	firebaseApp = firebase.initializeApp(config);
}
class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			nickname: '',
			error: '',
		};
	}

	setUser = ({ user, isUser }) => {
		if (isUser) {
			this.setError('User name taken');
		} else {
			this.setError('');
			this.props.setUser(user);
		}
	};

	handleSubmit = e => {
		e.preventDefault();
		const { socket } = this.props;
		const { nickname } = this.state;
		if (nickname) socket.emit(VERIFY_USER, nickname, this.setUser);
	};

	handleChange = e => {
		this.setState({ nickname: e.target.value });
	};

	setError = error => {
		this.setState({ error });
	};
	addUid = user => {
		if (user) {
			this.setState({ nickname: user.displayName });
			const { socket } = this.props;
			const { nickname } = this.state;
			if (nickname) socket.emit(VERIFY_USER, nickname, this.setUser);
		}
	};
	render() {
		const { nickname, error } = this.state;
		const { user, signOut, signInWithGoogle } = this.props;
		return (
			// <div className="login">
			// 	<form onSubmit={this.handleSubmit} className="login-form">
			// 		<label htmlFor="nickname">
			// 			<h2>Got a nickname?</h2>
			// 		</label>
			// 		<input
			// 			ref={input => {
			// 				this.textInput = input;
			// 			}}
			// 			type="text"
			// 			id="nickname"
			// 			value={nickname}
			// 			onChange={this.handleChange}
			// 			placeholder={'Username'}
			// 		/>
			// 		{user ? (
			// 			<p>
			// 				Hello, {user.displayName}
			// 				<button onClick={() => { this.addUid(user) }}>Continue to Chat</button>
			// 			</p>
			// 		) : (
			// 				<p>Please sign in.</p>
			// 			)}
			// 		{user ? (
			// 			<div className="google-btn"  onClick={signOut}>
			// 			<div className="google-icon-wrapper">
			// 				<img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
			// 			</div>
			// 			<p className="btn-text"><b>Sign in with google</b></p>
			// 			</div>
			// 		) : (
			// 				// <button onClick={signInWithGoogle}>Sign in with Google</button>

			// 			<div className="google-btn"  onClick={signInWithGoogle}>
			// 			<div className="google-icon-wrapper">
			// 				<img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
			// 			</div>
			// 			<p className="btn-text"><b>Sign in with google</b></p>
			// 			</div>
			// 			)}
			// 		<div className="error">{error ? error : null}</div>
			// 	</form>
			// </div>
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100">
						<form className="login100-form validate-form"  onSubmit={this.handleSubmit}  >
							<span className="login100-form-title p-b-26">Welcome</span>
							<span className="login100-form-title p-b-48">
								<i className="zmdi zmdi-font" />
							</span>
							<div className="wrap-input100 validate-input">
								<input className="input100" name="username"
									ref={input => {
									this.textInput = input;
								}}
								type="text"
								id="nickname"
								value={nickname}
								onChange={this.handleChange}
								// placeholder={'Username'}
								 />
								<span className="focus-input100" data-placeholder="username" />
							</div>
							<div className="wrap-input100 validate-input" data-validate="Enter password">
								<span className="btn-show-pass">
									<i className="zmdi zmdi-eye" />
								</span>
								<input className="input100" type="password" name="pass" />
								<span className="focus-input100" data-placeholder="Password" />
							</div>
							<div className="container-login100-form-btn">
								<div className="wrap-login100-form-btn">
									<div className="login100-form-bgbtn" />
									<button className="login100-form-btn">Login</button>
								</div>
							</div>
							<div className="text-center p-t-115">
							{user ? (
			 			<p>
			 				Hello, {user.displayName}
			 				<button onClick={() => { this.addUid(user) }}>Continue to Chat</button>
			 			</p>
			 		) : (
			 				<p>Please sign in.</p>
			 			)}
			 		{user ? (
			 			<div className="google-btn"  onClick={signOut}>
			 			<div className="google-icon-wrapper">
			 				<img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
			 			</div>
			 			<p className="btn-text"><b>Sign Out</b></p>
			 			</div>
			 		) : (
			 				// <button onClick={signInWithGoogle}>Sign in with Google</button>

			 			<div className="google-btn"  onClick={signInWithGoogle}>
			 			<div className="google-icon-wrapper">
			 				<img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
			 			</div>
			 			<p className="btn-text"><b>Sign in with google</b></p>
			 			</div>
			 			)}
			 		<div className="error">{error ? error : null}</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
	googleProvider: new firebase.auth.GoogleAuthProvider(),
};
export default withFirebaseAuth({
	providers,
	firebaseAppAuth,
})(LoginForm);
