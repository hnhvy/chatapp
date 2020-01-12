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
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100">
						<form className="login100-form validate-form" onSubmit={this.handleSubmit}>
							<span className="login100-form-title p-b-26">Welcome</span>
							<span className="login100-form-title p-b-48">
								<i className="zmdi zmdi-font" />
							</span>
							<div className="wrap-input100 validate-input">
								<input
									className={nickname ? 'input100  has-val' : 'input100'}
									name="username"
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
								<input
									className={nickname ? 'input100  has-val' : 'input100'}
									type="password"
									name="pass"
								/>
								<span className="focus-input100" data-placeholder="Password" />
							</div>
							<div className="container-login100-form-btn">
								<div className="wrap-login100-form-btn">
									<div className="login100-form-bgbtn" />
									<button className="login100-form-btn">Login</button>
								</div>
							</div>
							<div className="text-center p-t-30">
								{user ? (
									<p>
										Hello, {user.displayName}
										<button
											onClick={() => {
												this.addUid(user);
											}}
										>
											Continue to Chat
										</button>
									</p>
								) : (
									<p>Or login with.</p>
								)}
								{user ? (
									<div className="btn-login btn-google"  onClick={signOut}>
        {/* -------------------- */}
        <div className="line center-wrapper svg-wrap">
          <svg className="centerHV" width="46px" height="46px" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
            {/* Generator: Sketch 3.3.3 (12081) - http://www.bohemiancoding.com/sketch */}
            <title>btn_google_light_normal_ios</title>
            <desc>Created with Sketch.</desc>
            <g id="Google-Button" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
              <g id="btn_google_light_normal" transform="translate(-1, -1)">
                <g id="logo_googleg_48dp" transform="translate(15, 15)">
                  <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" id="Shape" fill="#4285F4" />
                  <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" fill="#34A853" />
                  <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" fill="#FBBC05" />
                  <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" fill="#EA4335" />
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div className="center-wrapper  p1 google-color">
          <div className="centerV ">
            <strong>Sign Out </strong> 
            <span className="lighter"> </span> 
            <strong>Google </strong>
          </div>
        </div>
      </div>
								) : (
									// <button onClick={signInWithGoogle}>Sign in with Google</button>
									<div className="btn-login btn-google"  onClick={signInWithGoogle}>
        {/* -------------------- */}
        <div className="line center-wrapper svg-wrap">
          <svg className="centerHV" width="46px" height="46px" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
            {/* Generator: Sketch 3.3.3 (12081) - http://www.bohemiancoding.com/sketch */}
            <title>btn_google_light_normal_ios</title>
            <desc>Created with Sketch.</desc>
            <g id="Google-Button" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
              <g id="btn_google_light_normal" transform="translate(-1, -1)">
                <g id="logo_googleg_48dp" transform="translate(15, 15)">
                  <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" id="Shape" fill="#4285F4" />
                  <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" fill="#34A853" />
                  <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" fill="#FBBC05" />
                  <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" fill="#EA4335" />
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div className="center-wrapper  p1 google-color">
          <div className="centerV ">
            <strong>Login </strong> 
            <span className="lighter">with </span> 
            <strong>Google </strong>
          </div>
        </div>
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
