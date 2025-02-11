import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../routes';
import './VerifyEmail.Style.scss';
import { themeColors } from '../../../themes/schemes/PureLightThem';
import { Box, Typography } from '@mui/material';
import secureLocalStorage from 'react-secure-storage';
import { sendMail, verifyEmail } from '../Auth.Api';
import ToastComponent from '../../../components/Toast/Toast.Component';

const VerifyEmailPage = () => {
	const navigate = useNavigate();

	const [otpCode, setOtpCode] = useState('');
	const [show, setShow] = useState(false);
	const [countdown, setCountdown] = useState(60);

	const [disableButton, setDisableButton] = useState(false);

	const [displayEmpty, setDisplayEmpty] = useState(false);
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayErrorOtp, setDisplayErrorOtp] = useState(false);
	const [displayError, setDisplayError] = useState(false);
	const [displayResendSuccess, setDisplayResendSuccess] = useState(false);
	const [displayResendError, setDisplayResendError] = useState(false);

	const handleVerify = async () => {
		setDisableButton(true);
		if (otpCode === '') {
			setDisplayEmpty(true);
			setDisableButton(false);
		} else {
			try {
				if (secureLocalStorage.getItem('otp').toString() === otpCode) {
					let formData = new FormData();

					formData.append('email', secureLocalStorage.getItem('email'));

					const res = await verifyEmail(formData);
					if (res.status === 200) {
						setDisplaySuccess(true);
						setDisableButton(false);
						setTimeout(() => {
							secureLocalStorage.removeItem('otp');
							navigate(routes.auth.resetPassword);
						}, 2000);
					}
				} else {
					setDisplayErrorOtp(true);
					setDisableButton(false);
				}
			} catch {
				setDisplayError(true);
				setDisableButton(false);
			}
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleVerify();
		}
	};

	const handleResendOTP = async () => {
		try {
			setCountdown(60);
			setShow((prev) => !prev);
			const response = await sendMail(secureLocalStorage.getItem('email'));
			if (response.status === 200) {
				secureLocalStorage.setItem('otp', response.data.toString());
				setDisplayResendSuccess(true);
			}
		} catch {
			setDisplayResendError(true);
		}
	};

	useEffect(() => {
		let timer;

		if (countdown > 0 && !show) {
			timer = setTimeout(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		} else if (countdown === 0 && !show) {
			secureLocalStorage.removeItem('otp');
			setShow(true);
		}

		return () => clearTimeout(timer);
	}, [countdown, show]);

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
		if (displayErrorOtp) {
			timeOut = setTimeout(() => {
				setDisplayErrorOtp(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayErrorOtp]);

	useEffect(() => {
		let timeOut;
		if (displayResendError) {
			timeOut = setTimeout(() => {
				setDisplayResendError(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayResendError]);

	useEffect(() => {
		let timeOut;
		if (displayResendSuccess) {
			timeOut = setTimeout(() => {
				setDisplayResendSuccess(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayResendSuccess]);

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
		if (displayError) {
			timeOut = setTimeout(() => {
				setDisplayError(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayError]);

	return (
		<div className='container_verifyemail'>
			<ToastComponent
				open={displayEmpty}
				close={() => setDisplayEmpty(false)}
				title='Error'
				message='Please enter otp code!'
				type='error'
			/>

			<ToastComponent
				open={displayErrorOtp}
				close={() => setDisplayErrorOtp(false)}
				title='Error'
				message='Your OTP code is incorrect!'
				type='error'
			/>

			<ToastComponent
				open={displayResendError}
				close={() => setDisplayResendError(false)}
				title='Error'
				message='Resend OTP code failure!'
				type='error'
			/>

			<ToastComponent
				open={displayResendSuccess}
				close={() => setDisplayResendSuccess(false)}
				title='Success'
				message='Resend OTP successfully. Please check your email!'
				type='success'
			/>

			<ToastComponent
				open={displayError}
				close={() => setDisplayError(false)}
				title='Error'
				message='Your OTP code is old. Please resend!'
				type='error'
			/>

			<ToastComponent
				open={displaySuccess}
				close={() => setDisplaySuccess(false)}
				title='Success'
				message='Verify email successfully!'
				type='success'
			/>

			<div className='main_container_verifyemail'>
				<h1 className='title_verifyemail'>VERIFY YOUR EMAIL</h1>
				<p className='title_attention_verifyemail'>
					OTP Code has sent to your email. Please enter it to verify!
				</p>
				<div className='form_container_verifyemail'>
					<div className='form_verifyemail' onKeyDown={handleKeyDown}>
						<div className='input_container_verifyemail'>
							<label htmlFor='otp'>OTP</label>
							<input
								type='text'
								id='otp'
								name='otp'
								placeholder='000000'
								maxLength={6}
								size={6}
								autoFocus
								onChange={(e) => setOtpCode(e.target.value)}
							/>
						</div>
						<button
							type='button'
							className='submit_button_verifyemail'
							onClick={handleVerify}
							disabled={disableButton}
						>
							Continue
						</button>
					</div>
				</div>
				{!show ? (
					<Box
						sx={{
							width: '100%',
							p: '15px 5px 5px 5px',
							textAlign: 'center',
						}}
					>
						If your email don&#39;t have a message, please wait for{' '}
						<Typography className='color-change-3x' sx={{ display: 'inline' }}>
							{countdown}
						</Typography>{' '}
						seconds to resend OTP code.
					</Box>
				) : (
					<Box
						sx={{
							width: '100%',
							p: '15px 5px 5px 5px',
							textAlign: 'center',
						}}
					>
						<Typography
							onClick={handleResendOTP}
							sx={{
								display: 'inline',
								color: themeColors.primary_600,
								'&:hover': {
									cursor: 'pointer',
									color: themeColors.thirdary,
								},
							}}
						>
							resend OTP code
						</Typography>
					</Box>
				)}
			</div>
		</div>
	);
};

export default VerifyEmailPage;
