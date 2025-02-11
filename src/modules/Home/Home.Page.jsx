/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import HeaderGuest from '../../layouts/Header/Guest/HeaderGuest';
import FooterCustomer from '../../layouts/Footer/Customer/FooterCustomer';
import BoxContainer from '../../components/Box/Box.Container';
import { Box, Button, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
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
import StarIcon from '@mui/icons-material/Star';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
	const [filteredHotels, setFilteredHotels] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAllHotel().then((data) => {
			const fiveStarHotels = data.filter((hotel) => hotel.homeStayStandar === 5);
			setFilteredHotels(fiveStarHotels);
			setLoading(false);
		});
	}, []);

	console.log('filteredHotels', filteredHotels);

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [hotelPage, setHotelPage] = useState(8);

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
					<Swiper
						modules={[Pagination, Autoplay]}
						spaceBetween={0}
						slidesPerView={1}
						loop={true}
						autoplay={{ delay: 3000, disableOnInteraction: false }}
						pagination={{ clickable: true }}
						className='overflow-hidden h-[700px]'
					>
						{images.map((image, index) => (
							<SwiperSlide key={index}>
								<img
									src={image}
									alt={`Banner ${index + 1}`}
									style={{ width: '100%', objectFit: 'cover', display: 'block', height: '100%' }}
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</Box>

				<Box p='20px 60px'>
					<SearchComponent />
				</Box>

				<Box className='content__top-hotels'>
					<Typography className='top-hotels__title'>Top Luxury & Cheapest 5-star Hotels</Typography>
					<Grid container spacing={3}>
						{loading
							? Array.from(new Array(8)).map((_, index) => (
									<Grid item xs={12} sm={6} md={3} key={index}>
										<Skeleton variant='rectangular' width='100%' height={200} />
										<Skeleton width='80%' height={30} />
										<Skeleton width='60%' height={20} />
									</Grid>
							  ))
							: filteredHotels.slice(0, hotelPage).map((homestay) => (
									<Grid
										item
										xs={12}
										sm={6}
										md={3}
										key={homestay.homeStayID}
										onClick={() => {
											secureLocalStorage.setItem('hotelId', homestay?.homeStayID);
											secureLocalStorage.setItem('city', homestay?.homeStayAddress?.city);
											secureLocalStorage.setItem(
												'hotelLocation',
												homestay?.homeStayAddress?.city
											);
											navigate(routes.home.hotelDetails);
											document.documentElement.scrollTop = 0;
										}}
									>
										<Card>
											<div className='h-52 overflow-hidden'>
												<CardMedia
													component='img'
													height='200'
													image={`${URL_IMAGE}${homestay?.mainImage}`}
													alt={homestay.name}
													sx={{
														cursor: 'pointer',
														transition:
															'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
														'&:hover': {
															transform: 'scale(1.05)',
															boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
														},
													}}
												/>
											</div>
											<CardContent>
												<Typography variant='h6'>{homestay.name}</Typography>
												<Typography variant='body2' color='textSecondary'>
													{homestay.homeStayAddress.address}
												</Typography>
												<Typography>
													{[...Array(Math.round(homestay.homeStayStandar))].map(
														(_, index) => (
															<StarIcon key={index} style={{ color: 'gold' }} />
														)
													)}
												</Typography>
												<Typography variant='body2'>{homestay.description}</Typography>
												<Button
													variant='contained'
													color='primary'
													fullWidth
													sx={{ marginTop: 2 }}
												>
													Book Now
												</Button>
											</CardContent>
										</Card>
									</Grid>
							  ))}
					</Grid>

					{hotelPage < filteredHotels.length && (
						<Box textAlign='center' mt={3}>
							<Button variant='contained' color='primary' onClick={handleSeeMore}>
								Xem thêm
							</Button>
						</Box>
					)}
				</Box>
			</BoxContainer>
			<FooterCustomer />
		</>
	);
};

export default HomePage;
