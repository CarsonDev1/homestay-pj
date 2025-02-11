/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { AssetImages } from '../../../utils/images';
import { Avatar, Button, Typography } from '@mui/material';
import './HeaderUser.Style.scss';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../routes';
import { getProfile } from '../../../modules/Auth/Auth.Api';
import secureLocalStorage from 'react-secure-storage';
import { URL_IMAGE } from '../../../services/ApiUrl';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const HeaderUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [data, setData] = useState({});
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				const nameIdentifier =
					decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
				localStorage.setItem('accountId', nameIdentifier);

				const init = async () => {
					const res = await getProfile(nameIdentifier, dispatch);
					if (res) {
						setData(res);
					}
				};

				init();
			} catch (error) {
				console.error('Invalid token:', error);
				localStorage.removeItem('token');
				navigate(routes.auth.login);
			}
		} else {
			navigate(routes.auth.login);
		}
	}, [token]);

	return (
		<header className='header__container--user'>
			{/* <img src={AssetImages.LOGO} alt='' className='logo' /> */}
			<div className='nav__container'>
				<Typography
					className='nav__item'
					onClick={() => {
						secureLocalStorage.removeItem('city');
						navigate(routes.home.root);
					}}
				>
					Home
				</Typography>

				<Typography className='nav__item' onClick={() => navigate(routes.home.listHotels)}>
					Hotels
				</Typography>

				<Typography className='nav__item' onClick={() => navigate(routes.home.listMoments)}>
					Moments
				</Typography>

				<Typography className='nav__item' onClick={() => navigate(routes.home.listVouchers)}>
					Vouchers
				</Typography>

				{/* <Typography className='nav__item' onClick={() => navigate(routes.home.aboutUs)}>
					About Us
				</Typography> */}
			</div>
			<div className='auth__container'>
				<Button className='btn--is__logged' onClick={() => navigate('/account')}>
					{data?.profile?.avatar ? (
						data?.profile?.avatar?.startsWith('/', 0) ? (
							<Avatar
								src={`${URL_IMAGE}${data?.profile?.avatar}`}
								sx={{ width: 30, height: 30, pointerEvents: 'none' }}
							/>
						) : (
							<Avatar src={data?.profile?.avatar} sx={{ width: 30, height: 30, pointerEvents: 'none' }} />
						)
					) : (
						<img src={AssetImages.ICONS.USER} alt='' />
					)}
					{data?.profile?.fullName}
				</Button>
			</div>
		</header>
	);
};

export default HeaderUser;
