/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react';
import './SignIn.Style.scss';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../routes';
import secureLocalStorage from 'react-secure-storage';
import { googleLogin, login } from '../Auth.Api';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ToastComponent from '../../../components/Toast/Toast.Component';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { checkPermisson } from '../../../utils/helper';

const SignIn = () => {
	const isPhone = /^[0-9]+$/;

	const regexPhone = /^0[3|5|7|8|9]\d{8}$/;
	const regexEmail = /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
	const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

	const navigate = useNavigate();

	const [text, setText] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayError, setDisplayError] = useState(false);
	const [displayExists, setDisplayExists] = useState(false);
	const [displayInvalidPassword, setDisplayInvalidPassword] = useState(false);
	const [displayEmpty, setDisplayEmpty] = useState(false);
	const [displayInvalidEmail, setDisplayInvalidEmail] = useState(false);
	const [displayInvalidPhone, setDisplayInvalidPhone] = useState(false);
	const [displayBlocked, setDisplayBlocked] = useState(false);
	const [displayAwaiting, setDisplayAwaiting] = useState(false);
	const [displayNotHave, setDisplayNotHave] = useState(false);

	const handleShowPassword = () => {
		setShowPassword((showPassword) => !showPassword);
	};

	const validateInput = () => {
		setDisplayEmpty(false);
		setDisplayInvalidEmail(false);
		setDisplayInvalidPhone(false);
		setDisplayInvalidPassword(false);

		if (text.trim() === '' || password.trim() === '') {
			setDisplayEmpty(true);
			return false;
		} else if (!isNaN(text) && isPhone.test(text)) {
			if (!regexPhone.test(text)) {
				setDisplayInvalidPhone(true);
				return false;
			}
		} else if (!regexEmail.test(text)) {
			setDisplayInvalidEmail(true);
			return false;
		} else {
			if (!regexPassword.test(password)) {
				setDisplayInvalidPassword(true);
				return false;
			}
			return true;
		}
		return true;
	};

	const handleLogin = async () => {
		if (!validateInput()) {
			return;
		}

		const data = {
			text: text.trim(),
			password: password.trim(),
		};

		const res = await login(data);

		console.log(res);

		if (res?.status) {
			switch (res?.status) {
				case 200:
					setDisplaySuccess(true);
					// secureLocalStorage.setItem('accountId', res.data?.data?.accountID);
					secureLocalStorage.setItem('role', res.data?.data?.role);
					localStorage.setItem('token', res.data?.data?.token);

					// if (res.data?.data?.hotel[0]?.hotelID) {
					// 	secureLocalStorage.setItem('hotelId', res.data?.data?.hotel[0]?.hotelID);
					// 	// secureLocalStorage.setItem("email", res.data?.data?.email);
					// }
					setTimeout(() => {
						checkPermisson(navigate);
					}, 2000);
					break;
				case 202:
					setDisplayAwaiting(true);
					setTimeout(() => {
						navigate(routes.home.root);
					}, 2000);
					break;
				case 201:
					setDisplayNotHave(true);
					// secureLocalStorage.setItem('accountId', res.data?.data?.accountID);
					setTimeout(() => {
						navigate(routes.partner.registration);
					}, 2000);
					break;
				default:
					setDisplayError(true);
					break;
			}
		} else {
			switch (res?.data?.statusCode) {
				case 404:
					setDisplayExists(true);
					break;
				case 403:
					setDisplayBlocked(true);
					break;
				default:
					setDisplayError(true);
					break;
			}
		}
	};

	const handleGoogleLogin = async (credentialResponse) => {
		const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
		if (credentialResponseDecoded) {
			let formData = new FormData();

			formData.append('email', credentialResponseDecoded.email);
			formData.append('avartar', credentialResponseDecoded.picture);
			formData.append('userName', credentialResponseDecoded.given_name);

			const res = await googleLogin(formData);

			if (res?.status) {
				switch (res?.status) {
					case 200:
						setDisplaySuccess(true);
						secureLocalStorage.setItem('accountId', res.data?.data?.accountID);
						secureLocalStorage.setItem('role', res.data?.data?.role?.name);
						localStorage.setItem('token', res.data?.token);

						if (res?.data?.data?.hotel) {
							secureLocalStorage.setItem('hotelId', res?.data?.data?.hotel[0]?.hotelID);
							// secureLocalStorage.setItem("email", res?.data?.data?.email);
						}
						setTimeout(() => {
							checkPermisson(navigate);
						}, 2000);
						break;
					case 201:
						setDisplayNotHave(true);
						secureLocalStorage.setItem('accountId', res.data?.data?.accountID);
						setTimeout(() => {
							navigate(routes.partner.registration);
						}, 2000);
						break;
					case 202:
						setDisplayAwaiting(true);
						setTimeout(() => {
							navigate(routes.home.root);
						}, 2000);
						break;
					default:
						setDisplayError(true);
						break;
				}
			} else {
				switch (res.response?.status) {
					case 403:
						setDisplayBlocked(true);
						break;
					default:
						break;
				}
			}
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleLogin();
		}
	};

	useEffect(() => {
		let timeOut;
		if (displaySuccess) {
			timeOut = setTimeout(() => {
				setDisplaySuccess(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displaySuccess]);

	useEffect(() => {
		let timeOut;
		if (displayEmpty) {
			timeOut = setTimeout(() => {
				setDisplayEmpty(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayEmpty]);

	useEffect(() => {
		let timeOut;
		if (displayInvalidEmail) {
			timeOut = setTimeout(() => {
				setDisplayInvalidEmail(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayInvalidEmail]);

	useEffect(() => {
		let timeOut;
		if (displayInvalidPhone) {
			timeOut = setTimeout(() => {
				setDisplayInvalidPhone(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayInvalidPhone]);

	useEffect(() => {
		let timeOut;
		if (displayInvalidPassword) {
			timeOut = setTimeout(() => {
				setDisplayInvalidPassword(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayInvalidPassword]);

	useEffect(() => {
		let timeOut;
		if (displayExists) {
			timeOut = setTimeout(() => {
				setDisplayExists(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayExists]);

	useEffect(() => {
		let timeOut;
		if (displayError) {
			timeOut = setTimeout(() => {
				setDisplayError(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayError]);

	useEffect(() => {
		let timeOut;
		if (displayBlocked) {
			timeOut = setTimeout(() => {
				setDisplayBlocked(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayBlocked]);

	useEffect(() => {
		let timeOut;
		if (displayAwaiting) {
			timeOut = setTimeout(() => {
				setDisplayAwaiting(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayAwaiting]);

	useEffect(() => {
		let timeOut;
		if (displayNotHave) {
			timeOut = setTimeout(() => {
				setDisplayNotHave(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayNotHave]);

	return (
		<div className='container_login'>
			<ToastComponent
				open={displayEmpty}
				close={() => setDisplayEmpty(false)}
				title='Error'
				message='All field are required!'
				type='error'
			/>

			<ToastComponent
				open={displayInvalidEmail}
				close={() => setDisplayInvalidEmail(false)}
				title='Invalid Email'
				message='Example: example@gmail.com'
				type='error'
			/>

			<ToastComponent
				open={displayInvalidPhone}
				close={() => setDisplayInvalidPhone(false)}
				title='Invalid Phone'
				message='Example: 03 | 05 | 07 | 08 | 09xx xxx xxx'
				type='error'
			/>

			<ToastComponent
				open={displayInvalidPassword}
				close={() => setDisplayInvalidPassword(false)}
				title='Invalid Password'
				message='Password must have at least:'
				type='error'
				children={[
					'One lowercase letter',
					'One uppercase letter',
					'One digit',
					'One special letter',
					'From 8 to 16 characters',
				]}
			/>

			<ToastComponent
				open={displayExists}
				close={() => setDisplayExists(false)}
				title='Login fail'
				message='Email or Phone Number does not exist, or Password is incorrect!'
				type='error'
			/>

			<ToastComponent
				open={displayBlocked}
				close={() => setDisplayBlocked(false)}
				title='Error'
				message='Your account has been blocked!'
				type='error'
			/>

			<ToastComponent
				open={displayAwaiting}
				close={() => setDisplayAwaiting(false)}
				title='Warning'
				message='Please wait an admin approve your hotel!'
				type='warning'
			/>

			<ToastComponent
				open={displayNotHave}
				close={() => setDisplayNotHave(false)}
				title='Error'
				message='Please register the hotel to use the system!'
				type='error'
			/>

			<ToastComponent
				open={displayError}
				close={() => setDisplayError(false)}
				title='Error'
				message='Server maintenance is underway. Please try again later!'
				type='error'
			/>

			<ToastComponent
				open={displaySuccess}
				close={() => setDisplaySuccess(false)}
				title='Success'
				message='Login successfully!'
				type='success'
			/>

			<div className='main_container'>
				<h1 className='title'>Login</h1>
				<div className='form_container'>
					<div className='form' onKeyDown={handleKeyDown}>
						<div className='input_container'>
							<label htmlFor='text'>Email or Phone Number</label>
							<input
								type='text'
								id='text'
								name='text'
								autoFocus
								placeholder='Please enter email or phone number'
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
						</div>
						<div className='input_container password'>
							<label htmlFor='password'>Password</label>
							<input
								type={showPassword ? 'text' : 'password'}
								id='password'
								name='password'
								autoComplete='current-password'
								placeholder='Please enter your password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<div className='icon' onClick={handleShowPassword}>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</div>
						</div>
						<div className='container_foget'>
							<div className='checkbox_container'>
								{/* <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  value="remember"
                  className="checkbox_container_button"
                />
                <label htmlFor="remember">Remember Me</label> */}
							</div>
							<div className='link_container_forgotpassword'>
								<button
									type='button'
									className='link_button_forgotpassword'
									onClick={() => navigate(routes.auth.forgotPassword)}
								>
									Forgot Password?
								</button>
							</div>
						</div>
						<button className='submit_button' onClick={handleLogin}>
							Sign In
						</button>
						<div className='link_container_signup'>
							<p>Do not have an account?</p>
							<button
								type='button'
								className='link_button_signup'
								onClick={() => navigate(routes.auth.register)}
							>
								Sign up here
							</button>
						</div>
						<div className='or_container'>
							<p>Or</p>
						</div>
						<div className='google_button_container'>
							<GoogleLogin
								onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse)}
								onError={() => {
									setDisplayError(true);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
