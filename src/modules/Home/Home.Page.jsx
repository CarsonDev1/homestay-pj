/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import HeaderGuest from '../../layouts/Header/Guest/HeaderGuest';
import FooterCustomer from '../../layouts/Footer/Customer/FooterCustomer';
import BoxContainer from '../../components/Box/Box.Container';
import { Box, Typography } from '@mui/material';
import { AssetImages } from '../../utils/images';
import './Home.Style.scss';
import { checkLogin, formatPrice } from '../../utils/helper';
import SearchComponent from '../../components/SearchComponent/SearchComponent';
import HeaderUser from '../../layouts/Header/User/HeaderUser';
import { themeColors } from '../../themes/schemes/PureLightThem';
import { getAllHotel } from './Home.Api';
import { URL_IMAGE } from '../../services/ApiUrl';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import secureLocalStorage from 'react-secure-storage';
import { findFiveStarsHotels } from '../../utils/filter';
import { LoadingButton } from '@mui/lab';

const HomePage = () => {
	const navigate = useNavigate();
	const images = [
		AssetImages.BANNER.BANNER_1,
		AssetImages.BANNER.BANNER_2,
		AssetImages.BANNER.BANNER_3,
		AssetImages.BANNER.BANNER_4,
		AssetImages.BANNER.BANNER_5,
	];

	const [data, setData] = useState([]);

	// const listHotels = findFiveStarsHotels(data);
	console.log('data', data);

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [hotelPage, setHotelPage] = useState(11);

	const handleSeeMore = () => {
		setHotelPage((prev) => prev + 4);
	};

	const init = async () => {
		const res = await getAllHotel();

		if (res) {
			setData(res);
		}
	};

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [images.length]);

	useEffect(() => {
		secureLocalStorage.removeItem('hotelId');
		secureLocalStorage.removeItem('hotelLocation');
		secureLocalStorage.removeItem('roomId');
		secureLocalStorage.removeItem('checkInDate');
		secureLocalStorage.removeItem('checkOutDate');
		secureLocalStorage.removeItem('numberGuest');
		secureLocalStorage.removeItem('numberRoom');
		secureLocalStorage.removeItem('city');
	}, []);

	return (
		<>
			<BoxContainer property='home__container'>
				{checkLogin() ? <HeaderUser /> : <HeaderGuest />}
				<Box className='content__banner'>
					<Box className='banner'>
						<img
							src={`${images[currentImageIndex]}`}
							alt=''
							style={{ width: '100%', objectFit: 'cover', display: 'block' }}
						/>
					</Box>
				</Box>

				<Box p='20px 60px'>
					<SearchComponent />
				</Box>

				<Box className='content__top-hotels'>
					<Typography className='top-hotels__title'>Top Luxury & Cheapest 5-star Hotels</Typography>
					{data?.map((item) => (
						<div
							key={item.homeStayID}
							onClick={() => {
								secureLocalStorage.setItem('hotelId', item?.homeStayID);
								secureLocalStorage.setItem('city', item?.homeStayAddress?.city);
								secureLocalStorage.setItem('hotelLocation', item?.homeStayAddress?.city);
								navigate(routes.home.hotelDetails);
								document.documentElement.scrollTop = 0;
							}}
						>
							<span className='text-orange-600'>{item.name}</span>
						</div>
					))}
					{/* {data?.length > 0 ? (
						<Box className='top-hotels__wrapper'>
							{data?.map((hotel, index) => {
								if (index > hotelPage) {
									return null;
								} else {
									return (
										<Box
											className='wrapper__hotel'
											key={hotel?.hotelID}
											onClick={() => {
												secureLocalStorage.setItem('hotelId', hotel?.hotelID);
												secureLocalStorage.setItem('city', hotel?.hotelAddress?.city);
												secureLocalStorage.setItem('hotelLocation', hotel?.hotelAddress?.city);
												navigate(routes.home.hotelDetails);
												document.documentElement.scrollTop = 0;
											}}
										>
											<img
												loading='lazy'
												src={`${URL_IMAGE}${hotel?.mainImage}`}
												alt=''
												style={{
													width: '100%',
													minHeight: '215px',
													maxHeight: '215px',
													borderRadius: '8px 8px 0 0',
													objectFit: 'cover',
												}}
											/>

											<Box className='hotel__infor'>
												<Typography
													onClick={() => {
														secureLocalStorage.setItem('hotelId', hotel?.hotelID);
														secureLocalStorage.setItem('city', hotel?.hotelAddress?.city);
														secureLocalStorage.setItem(
															'hotelLocation',
															hotel?.hotelAddress?.city
														);
														navigate(routes.home.hotelDetails);
														document.documentElement.scrollTop = 0;
													}}
													sx={{
														color: themeColors.title,
														fontSize: 18,
														fontWeight: 700,
														display: '-webkit-box',
														overflow: 'hidden',
														WebkitLineClamp: 1,
														WebkitBoxOrient: 'vertical',
														transition: 'all .3s ease',
														'&:hover': {
															color: themeColors.text_Link,
															textDecoration: 'underline',
														},
													}}
												>
													{hotel?.name}
												</Typography>

												<Box display='flex' alignItems='center' gap='.5rem'>
													<img
														src={AssetImages.ICONS.STAR}
														alt=''
														style={{ width: 24, height: 24 }}
													/>
													<img
														src={AssetImages.ICONS.STAR}
														alt=''
														style={{ width: 24, height: 24 }}
													/>
													<img
														src={AssetImages.ICONS.STAR}
														alt=''
														style={{ width: 24, height: 24 }}
													/>
													<img
														src={AssetImages.ICONS.STAR}
														alt=''
														style={{ width: 24, height: 24 }}
													/>
													<img
														src={AssetImages.ICONS.STAR}
														alt=''
														style={{ width: 24, height: 24 }}
													/>
												</Box>

												<Typography
													sx={{
														color: themeColors.gray,
														fontSize: 16,
														fontWeight: 400,
													}}
												>
													{hotel?.hotelAddress?.city}
												</Typography>

												<Box display='flex' justifyContent='flex-end'>
													<Typography
														sx={{
															color: themeColors.title,
															fontSize: 20,
															fontWeight: 700,
														}}
													>
														{formatPrice(hotel?.rooms[0]?.price)} VND
													</Typography>
												</Box>
											</Box>
										</Box>
									);
								}
							})}
						</Box>
					) : (
						<Box width='100%' display='flex' justifyContent='center' alignItems='center'>
							<LoadingButton loading variant='outlined' sx={{ border: '0 !important' }} />
							<Typography
								sx={{
									fontSize: 20,
									fontWeight: 400,
								}}
							>
								Loading...
							</Typography>
						</Box>
					)} */}
					{/* 
					{hotelPage < data.length - 1 ? (
						<Box display='flex'>
							<Box m='auto' onClick={handleSeeMore}>
								<Typography
									sx={{
										color: themeColors.white,
										fontSize: 18,
										textAlign: 'center',
										bgcolor: themeColors.secondary_Default,
										p: '10px 30px',
										borderRadius: '8px',
										transition: 'all .2s linear',
										'&:hover': {
											cursor: 'pointer',
											bgcolor: themeColors.thirdary_Default,
										},
									}}
								>
									See more
								</Typography>
							</Box>
						</Box>
					) : null} */}
				</Box>
			</BoxContainer>
			<FooterCustomer />
		</>
	);
};

export default HomePage;
