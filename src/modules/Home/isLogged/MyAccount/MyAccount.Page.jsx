/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './MyAccount.Style.scss';
import BoxContainer from '../../../../components/Box/Box.Container';
import { Avatar, Box, Divider, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import { themeColors } from '../../../../themes/schemes/PureLightThem';
import { AssetImages } from '../../../../utils/images';
import { URL_IMAGE } from '../../../../services/ApiUrl';
import { getProfile } from '../../../Auth/Auth.Api';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import HeaderUser from '../../../../layouts/Header/User/HeaderUser';
import FooterCustomer from '../../../../layouts/Footer/Customer/FooterCustomer';
import { routes } from '../../../../routes';
import ProfileContainer from './Profile/Profile.Container';
import MyBookingContainer from './myBooking/MyBooking.Container';
import MyPostsContainer from './MyPosts/MyPosts.Container';
import MyVouchercontainer from './MyVoucher/MyVoucher.container';

const items = ['Profile', 'My Bookings', 'My Posts', 'My Vouchers', 'Logout'];

const MyAccountPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [data, setData] = useState({});

	const [isSelectedSidebar, setIsSelectedSidebar] = useState(0);

	const logout = () => {
		localStorage.clear();
		secureLocalStorage.clear();
		setTimeout(() => {
			navigate(routes.home.root);
		}, 1000);
	};

	const handleSelectIndexSidebar = (index) => {
		setIsSelectedSidebar(index);
		if (index === 4) {
			logout();
		}
	};

	const init = async () => {
		const res = await getProfile(secureLocalStorage.getItem('accountId'), dispatch);
		if (res) {
			setData(res);
		}
	};

	useEffect(() => {
		init();
	}, [data]);

	return (
		<>
			<HeaderUser />

			<BoxContainer property='my-account__container'>
				<Box
					sx={{
						flex: 0.6,
						minHeight: '420px',
						maxHeight: '420px',
						borderRadius: '8px',
						backgroundColor: themeColors.white,
						boxShadow: themeColors.boxShadow,
					}}
				>
					<Box
						sx={{
							p: '15px',
							display: 'flex',
							alignItems: 'center',
							gap: '1.5rem',
						}}
					>
						{data?.profile?.avatar ? (
							<Avatar
								src={
									data?.profile?.avatar?.startsWith('/')
										? `${URL_IMAGE}${data?.profile?.avatar}`
										: `${data?.profile?.avatar}`
								}
								sx={{ width: 70, height: 70 }}
							/>
						) : (
							<img loading='lazy' src={AssetImages.LOGO} alt='' style={{ width: 70, height: 70 }} />
						)}
						<Typography sx={{ fontSize: 20 }}>Member</Typography>
					</Box>

					<Divider
						sx={{
							width: '100%',
							height: '1px',
							bgcolor: themeColors.gray,
							mb: '15px',
						}}
					/>

					<List disablePadding sx={{ width: '100%' }}>
						<Stack direction='column'>
							{items.map((item, index) => (
								<ListItem key={index} disablePadding>
									<ListItemButton
										sx={{
											borderLeft:
												index === isSelectedSidebar
													? `5px solid ${themeColors.secondary_Default}`
													: null,

											bgcolor: index === isSelectedSidebar ? themeColors.bgTitle : 'transparent',
											p: index === isSelectedSidebar ? '20px 0 20px 20px' : '10px 0 10px 15px',
											m: '5px 0',
											'&:hover': {
												bgcolor: themeColors.bgTitle,
											},
										}}
										onClick={() => handleSelectIndexSidebar(index)}
									>
										<Typography
											sx={{
												fontSize: 17,
												color:
													index === isSelectedSidebar
														? themeColors.text_Link
														: themeColors.black,
											}}
										>
											{item}
										</Typography>
									</ListItemButton>
								</ListItem>
							))}
						</Stack>
					</List>
				</Box>

				<Box flex={2}>
					{isSelectedSidebar === 0 ? <ProfileContainer /> : null}
					{isSelectedSidebar === 1 ? <MyBookingContainer /> : null}
					{isSelectedSidebar === 2 ? <MyPostsContainer /> : null}
					{isSelectedSidebar === 3 ? <MyVouchercontainer /> : null}
				</Box>
			</BoxContainer>

			<FooterCustomer />
		</>
	);
};

export default MyAccountPage;
