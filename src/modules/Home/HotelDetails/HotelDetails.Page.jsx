/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import BoxContainer from '../../../components/Box/Box.Container';
import HeaderGuest from '../../../layouts/Header/Guest/HeaderGuest';
import FooterCustomer from '../../../layouts/Footer/Customer/FooterCustomer';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import './HotelDetails.Style.scss';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../routes';
import { themeColors } from '../../../themes/schemes/PureLightThem';
import DescriptionPage from './Description/Description.Page';
import { checkLogin, formatPrice, renderStars } from '../../../utils/helper';
import RoomsPage from './Rooms/Rooms.Page';
import GuestReviewsPage from './GuestReviews/GuestReviews.Page';
import AmenitiesPage from './Amenities/Amenities.Page';
import MapModal from '../Modal/ModalMap/Map.Modal';
import GalleryDetailsModal from '../Modal/GalleryDetails/GalleryDetails.Modal';
import HeaderUser from '../../../layouts/Header/User/HeaderUser';
import { getAllHotel, getAllHotelNameToSearch, getHotelDetails, searchHotelByCity } from '../Home.Api';
import secureLocalStorage from 'react-secure-storage';
import { URL_IMAGE } from '../../../services/ApiUrl';
import {
	filterHotelInCanTho,
	filterHotelInDaNang,
	filterHotelInHaNoi,
	filterHotelInHoChiMinh,
	filterHotelInQuyNhon,
	filterListHotelsHaveRoom,
} from '../../../utils/filter';
import { useDispatch } from 'react-redux';
import { saveListHotels } from '../Home.Actions';
import { format, formatDate } from 'date-fns';
import ToastComponent from '../../../components/Toast/Toast.Component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { LoadingButton } from '@mui/lab';

const detailedHotel = ['Description', 'Guest Reviews', 'Services & Amenities'];

const HotelDetailsPage = () => {
	let listHotelCanTho = [];
	let listHotelHaNoi = [];
	let listHotelHoChiMinh = [];
	let listHotelDaNang = [];
	let listHotelQuyNhon = [];

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onTopRef = useRef(null);
	const dateRangeRef = useRef(null);
	const roomGuestRef = useRef(null);

	const [data, setData] = useState({});

	// console.log('data', data);

	const [dataHotels, setDataHotels] = useState([]);

	const [isSelected, setIsSelected] = useState(0);

	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);
	const checkoutDate = currentDate.setDate(currentDate.getDate() + 1);

	const [openDate, setOpenDate] = useState(false);
	const [openOptions, setOpenOptions] = useState(false);

	const [optionsHotel, setOptionsHotel] = useState([]);
	const [city, setCity] = useState(null);
	const [inputValue, setInputValue] = useState('');

	const [displayEmpty, setDisplayEmpty] = useState(false);
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayNotFound, setDisplayNotFound] = useState(false);
	const [displayServerError, setDisplayServerError] = useState(false);

	const [dates, setDates] = useState([
		{
			startDate: secureLocalStorage.getItem('checkInDate') || new Date(),
			endDate: secureLocalStorage.getItem('checkOutDate') || checkoutDate,
			key: 'selection',
		},
	]);

	const [options, setOptions] = useState({
		person: secureLocalStorage.getItem('numberGuest') || 1,
		room: secureLocalStorage.getItem('numberRoom') || 1,
	});

	const filterListHotel = (listHotels) => {
		switch (secureLocalStorage.getItem('hotelLocation')) {
			case 'Can Tho':
				listHotelCanTho = filterHotelInCanTho(filterListHotelsHaveRoom(listHotels));
				setDataHotels(listHotelCanTho);
				break;
			case 'Ho Chi Minh':
				listHotelHoChiMinh = filterHotelInHoChiMinh(filterListHotelsHaveRoom(listHotels));
				setDataHotels(listHotelHoChiMinh);
				break;
			case 'Da Nang':
				listHotelDaNang = filterHotelInDaNang(filterListHotelsHaveRoom(listHotels));
				setDataHotels(listHotelDaNang);
				break;
			case 'Quy Nhon':
				listHotelQuyNhon = filterHotelInQuyNhon(filterListHotelsHaveRoom(listHotels));
				setDataHotels(listHotelQuyNhon);
				break;
			case 'Ha Noi':
				listHotelHaNoi = filterHotelInHaNoi(filterListHotelsHaveRoom(listHotels));
				setDataHotels(listHotelHaNoi);
				break;
			default:
				setDataHotels([]);
				break;
		}
	};

	const init = async () => {
		const res = await getHotelDetails(secureLocalStorage.getItem('hotelId'), dispatch);
		const resHotel = await getAllHotel();
		const resSuggestion = await getAllHotelNameToSearch();

		if (resSuggestion) {
			setOptionsHotel(resSuggestion);
		}

		if (res) {
			setData(res);
		}

		if (resHotel) {
			filterListHotel(resHotel);
		}
	};

	const handleSelect = (index) => {
		setIsSelected(index);
	};

	const findMinPrice = (dataHotel) => {
		let minPrice = Infinity;

		dataHotel?.hotel?.rooms?.forEach((room) => {
			if (room?.quantity > 0 && room?.price < minPrice) {
				minPrice = room?.price;
			}
		});

		return minPrice === Infinity ? null : minPrice;
	};

	const handleBack = async () => {
		let formData = new FormData();

		formData.append('city', data?.hotel?.hotelAddress?.city);

		const res = await searchHotelByCity(formData, dispatch);

		if (filterListHotelsHaveRoom(res).length !== 0 && filterListHotelsHaveRoom(res)) {
			secureLocalStorage.setItem('city', data?.hotel?.hotelAddress?.city);
			saveListHotels(filterListHotelsHaveRoom(res));
			navigate(routes.home.listHotels);
			document.documentElement.scrollTop = 0;
		}
	};

	const normalizeString = (str) => {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
	};

	const filteredOptions = optionsHotel?.filter((option) =>
		normalizeString(option?.city?.toLowerCase()).includes(normalizeString(inputValue?.toLowerCase()))
	);

	const handleOption = (name, operation) => {
		setOptions((prev) => {
			return {
				...prev,
				[name]: operation === 'i' ? options[name] + 1 : options[name] - 1,
			};
		});
	};

	const handleSearch = async () => {
		try {
			if (city !== null) {
				let formData = new FormData();

				formData.append('city', city?.city);

				const res = await searchHotelByCity(formData, dispatch);

				if (filterListHotelsHaveRoom(res).length !== 0 && filterListHotelsHaveRoom(res)) {
					secureLocalStorage.setItem('checkInDate', formatDate(dates[0].startDate, 'yyyy-MM-dd'));
					secureLocalStorage.setItem('checkOutDate', formatDate(dates[0].endDate, 'yyyy-MM-dd'));
					secureLocalStorage.setItem('numberGuest', options.person);
					secureLocalStorage.setItem('numberRoom', options.room);
					setDisplaySuccess(true);
					switch (window.location.pathname) {
						case '/':
							saveListHotels(filterListHotelsHaveRoom(res));
							setTimeout(() => {
								navigate(routes.home.listHotels);
								document.documentElement.scrollTop = 0;
							}, 2000);
							break;
						case '/hotels':
							saveListHotels(filterListHotelsHaveRoom(res));
							break;
						case '/hotels/details':
							saveListHotels(filterListHotelsHaveRoom(res));
							setTimeout(() => {
								navigate(routes.home.listHotels);
								document.documentElement.scrollTop = 0;
							}, 2000);
							break;
						default:
							saveListHotels([]);
							break;
					}
				} else {
					saveListHotels([]);
					setDisplayNotFound(true);
				}
			} else {
				saveListHotels([]);
				setDisplayEmpty(true);
			}
		} catch (error) {
			saveListHotels([]);
			setDisplayServerError(true);
		}
	};

	const checkIn = formatDate(dates[0].startDate, 'yyyy-MM-dd');
	const checkOut = formatDate(dates[0].endDate, 'yyyy-MM-dd');
	const numberGuest = options.person;
	const numberRoom = options.room;

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
				setOpenDate(false);
			}
		};

		const handleClickOptionOutside = (event) => {
			if (roomGuestRef.current && !roomGuestRef.current.contains(event.target)) {
				setOpenOptions(false);
			}
		};

		if (openDate) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		if (openOptions) {
			document.addEventListener('mousedown', handleClickOptionOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOptionOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openDate, openOptions]);

	useEffect(() => {
		init();
	}, [data]);

	useEffect(() => {
		const storedCity = secureLocalStorage.getItem('city');
		if (storedCity) {
			setCity(storedCity);
		}
	}, []);

	useEffect(() => {
		if (city) {
			secureLocalStorage.setItem('city', city?.city);
		}
	}, [city]);

	useEffect(() => {
		secureLocalStorage.removeItem('roomId');
	});

	useEffect(() => {}, [isSelected]);

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
		if (displayNotFound) {
			timeOut = setTimeout(() => {
				setDisplayNotFound(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayNotFound]);

	useEffect(() => {
		let timeOut;
		if (displayServerError) {
			timeOut = setTimeout(() => {
				setDisplayServerError(false);
			}, 5500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayServerError]);

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

	return (
		<>
			{checkLogin() ? <HeaderUser /> : <HeaderGuest />}

			<ToastComponent
				open={displayEmpty}
				close={() => setDisplayEmpty(false)}
				title='Error'
				message='Please provide a location!'
				type='error'
			/>

			<ToastComponent
				open={displayNotFound}
				close={() => setDisplayNotFound(false)}
				title='Not Found'
				message='Hotel not found!'
				type='info'
			/>

			<ToastComponent
				open={displayServerError}
				close={() => setDisplayServerError(false)}
				title='Error'
				message='Server maintenance is underway. Please try again later!'
				type='error'
			/>

			<ToastComponent
				open={displaySuccess}
				close={() => setDisplaySuccess(false)}
				title='Success'
				message='Search hotel successfully!'
				type='success'
			/>

			<Box className='hotel-details__container' ref={onTopRef}>
				{/* Search container */}
				<BoxContainer>
					<Box className='search_Item--content'>
						<Typography
							sx={{
								fontSize: '24px',
								lineHeight: '24px',
								fontWeight: 'bold',
								color: themeColors.title,
								marginBottom: '20px',
							}}
						>
							Find where you want to stop
						</Typography>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Box className='search_content'>
								<Typography
									sx={{
										fontSize: '20px',
										lineHeight: '20px',
										color: themeColors.black,
										marginBottom: '15px',
									}}
								>
									Destination
								</Typography>
								<Box>
									<Autocomplete
										size='small'
										value={city}
										onChange={(event, newHotelName) => {
											setCity(newHotelName);
										}}
										onInputChange={(event, newInputValue) => {
											setInputValue(newInputValue);
										}}
										selectOnFocus
										autoComplete
										clearOnBlur
										handleHomeEndKeys
										freeSolo
										options={filteredOptions}
										getOptionLabel={(option) => {
											if (secureLocalStorage.getItem('city')) {
												return secureLocalStorage.getItem('city');
											} else {
												return option?.city;
											}
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												placeholder='City'
												InputProps={{
													...params.InputProps,
												}}
											/>
										)}
										renderOption={(props, option) => {
											const { key, ...optionProps } = props;
											return (
												<li key={key} {...optionProps}>
													{option?.city}
												</li>
											);
										}}
										sx={{
											width: '100%',
											bgcolor: themeColors.white,
											borderRadius: '4px',
										}}
									/>
								</Box>
							</Box>
							<Box className='search_content'>
								<Typography
									sx={{
										fontSize: '20px',
										lineHeight: '20px',
										color: themeColors.black,
										marginBottom: '15px',
									}}
								>
									Check-in & Check-out
								</Typography>
								<Box className='search_content-Item'>
									<FontAwesomeIcon
										onClick={() => setOpenDate(!openDate)}
										icon={faCalendarDays}
										className='search_Item--icon'
									/>
									<span
										onClick={() => setOpenDate(!openDate)}
										className='search_Item--text'
									>{`${format(dates[0].startDate, 'dd/MM/yyyy')} - ${format(
										dates[0].endDate,
										'dd/MM/yyyy'
									)}`}</span>
									{openDate && (
										<div ref={dateRangeRef} className='search_Item-date'>
											<DateRange
												editableDateInputs={true}
												onChange={(item) => setDates([item.selection])}
												moveRangeOnFirstSelection={false}
												ranges={dates}
												minDate={new Date()}
											/>
										</div>
									)}
								</Box>
							</Box>
							<Box className='search_content'>
								<Typography
									sx={{
										fontSize: '20px',
										lineHeight: '20px',
										color: themeColors.black,
										marginBottom: '15px',
									}}
								>
									Rooms & Guests
								</Typography>

								<Box className='search_content-Item'>
									<FontAwesomeIcon
										onClick={() => setOpenOptions(!openOptions)}
										icon={faPerson}
										className='search_Item--icon'
									/>
									<span onClick={() => setOpenOptions(!openOptions)} className='search_Item--text'>
										{`${
											options.person <= 1
												? `${options.person} person`
												: `${options.person} people`
										} and ${options.room <= 1 ? `${options.room} room` : `${options.room} rooms`}`}
									</span>
									{openOptions && (
										<Box ref={roomGuestRef} className='search_Item--options'>
											<Box className='search_Item--optionItem'>
												<span className='search_Item--optionItem-text'>Person</span>
												<Box className='search_Item--optionItem-optionCounter'>
													<button
														className='optionCounterButton'
														onClick={() => handleOption('person', 'd')}
														disabled={options.person <= 1}
													>
														-
													</button>
													<span className='optionCounterNumber'>{options.person}</span>
													<button
														className='optionCounterButton'
														onClick={() => handleOption('person', 'i')}
														disabled={options.person >= 20}
													>
														+
													</button>
												</Box>
											</Box>

											<Box className='search_Item--optionItem'>
												<span className='search_Item--optionItem-text'>Room</span>
												<Box className='search_Item--optionItem-optionCounter'>
													<button
														className='optionCounterButton'
														onClick={() => handleOption('room', 'd')}
														disabled={options.room <= 1}
													>
														-
													</button>
													<span className='optionCounterNumber'>{options.room}</span>
													<button
														className='optionCounterButton'
														onClick={() => handleOption('room', 'i')}
														disabled={options.room >= 10}
													>
														+
													</button>
												</Box>
											</Box>
										</Box>
									)}
								</Box>
							</Box>
							<Box sx={{ marginTop: '42px' }}>
								<Button className='search_Item--btn-search' onClick={handleSearch}>
									Search
								</Button>
							</Box>
						</Box>
					</Box>
				</BoxContainer>

				{/* Detailed Hotel */}
				<>
					<Box className='details__nav'>
						<Typography
							className='nav__item text'
							onClick={() => {
								navigate(routes.home.root);
								document.documentElement.scrollTop = 0;
							}}
						>
							Home
						</Typography>
						<Typography className='arrow text'>&gt;</Typography>
						<Typography className='nav__item text' onClick={handleBack}>
							{data?.homeStayAddress?.city}
						</Typography>
						<Typography className='arrow text'>&gt;</Typography>
						<Typography className='current__path text'>{data?.name}</Typography>
					</Box>

					<Box className='details__information'>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Box
								sx={{
									width: '85%',
									display: 'flex',
									flexDirection: 'column',
									gap: '1.2rem',
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
									<Typography className='information__hotel-name'>{data?.hotel?.name}</Typography>

									<Box sx={{ display: 'flex', gap: '.5rem' }}>
										{renderStars(data?.hotel?.hotelStandar)}
									</Box>
								</Box>

								<Typography
									sx={{
										fontSize: 18,
										display: '-webkit-box',
										overflow: 'hidden',
										WebkitLineClamp: 1,
										WebkitBoxOrient: 'vertical',
										transition: 'all .3s ease',
									}}
								>
									{data?.hotel?.hotelAddress?.address}
								</Typography>
								<MapModal
									data={{
										lat: data?.hotel?.hotelAddress?.latitude,
										lng: data?.hotel?.hotelAddress?.longitude,
									}}
								>
									<Typography className='btn--show__map'>Show on Map</Typography>
								</MapModal>
							</Box>
							<Typography className='information__cheapest-price'>
								{data?.price?.toLocaleString()} VND
							</Typography>
						</Box>

						<Box className='information__hotel-images'>
							<Box className='hotel--main-images'>
								<img
									loading='lazy'
									src={`${URL_IMAGE}${data?.mainImage}`}
									alt=''
									style={{
										width: '531px',
										minHeight: '343.163px',
										maxHeight: '343.163px',
										borderRadius: '6px',
										lineHeight: 0,
									}}
								/>
							</Box>
							<Box className='hotel--gallery'>
								{data?.homeStayImages?.slice(0, 5)?.map((image) => (
									<img
										loading='lazy'
										src={`${URL_IMAGE}${image?.image}`}
										alt=''
										key={image?.imageID}
										style={{
											width: '266px',
											height: '166.5px',
											borderRadius: '6px',
										}}
									/>
								))}
								<GalleryDetailsModal
									data={{
										listImages: data?.homeStayImages,
									}}
								>
									<Box className='view-all'>
										<div className='overlay'>View all images</div>
										<img
											loading='lazy'
											src={
												data?.hotel?.hotelImages
													? `${URL_IMAGE}${data?.hotel?.hotelImages[5]?.image}`
													: null
											}
											alt='Hotel'
											style={{
												width: '266px',
												height: '166.5px',
												borderRadius: '6px',
											}}
										/>
									</Box>
								</GalleryDetailsModal>
							</Box>
						</Box>
					</Box>

					<Box className='detailed__hotel'>
						{detailedHotel.map((item, index) => (
							<Typography
								key={index}
								onClick={() => handleSelect(index)}
								sx={{
									width: '100%',
									height: 'fit-content',
									color: index === isSelected ? themeColors.primary_Default : themeColors.black,
									fontSize: 16,
									fontWeight: index === isSelected ? 700 : 'normal',
									cursor: 'pointer',
									p: '0 20px',
									textAlign: 'center',
									borderRight: index < 2 ? `1px solid ${themeColors.gray}` : '0',
									'&:hover': {
										color:
											index !== isSelected
												? themeColors.text_Disabled
												: themeColors.primary_Default,
									},
								}}
							>
								{item}
							</Typography>
						))}
					</Box>

					{isSelected === 0 ? (
						<DescriptionPage
							data={{
								year: data?.openedIn,
								numberRooms: data?.totalRoom,
								desc: data?.description,
							}}
						/>
					) : null}
					{isSelected === 1 ? (
						<RoomsPage
							valueStorage={{
								checkIn: checkIn,
								checkOut: checkOut,
								numberGuest: numberGuest,
								numberRoom: numberRoom,
							}}
						/>
					) : null}
					{isSelected === 2 ? <GuestReviewsPage /> : null}
					{isSelected === 3 ? <AmenitiesPage /> : null}

					<Box className='another-hotels'>
						<Typography className='another-hotels__title'>
							Another Hotels in {secureLocalStorage.getItem('hotelLocation')}
						</Typography>

						<Box sx={{ display: 'flex', gap: '1rem', mt: '20px' }}>
							{dataHotels?.slice(0, 4)?.map((hotel) => (
								<Box className='card__hotel' key={hotel?.homeStayID}>
									<img
										loading='lazy'
										src={`${URL_IMAGE}${hotel?.mainImage}`}
										alt=''
										style={{
											width: '100%',
											minHeight: '240px',
											maxHeight: '240px',
											borderRadius: '10px 10px 0 0',
										}}
									/>
									<Box className='card__hotel--infor'>
										<Typography className='card__hotel--name'>{hotel?.name}</Typography>
										<Box sx={{ display: 'flex', gap: '.5rem' }}>
											{renderStars(hotel?.hotelStandar)}
										</Box>
										<Typography className='card__hotel--address'>
											{hotel?.hotelAddress?.address}
										</Typography>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'flex-end',
												gap: '1rem',
											}}
										>
											<Typography className='card__hotel--special-price'>
												VND {hotel?.rooms ? formatPrice(hotel?.rooms[0]?.price) : null}
											</Typography>
										</Box>
									</Box>
									<Button
										className='btn--view-detailed'
										onClick={() => {
											secureLocalStorage.removeItem('hotelId');
											secureLocalStorage.setItem('hotelId', hotel?.hotelID);
											navigate(routes.home.hotelDetails);
											if (onTopRef.current) {
												onTopRef.current.scrollIntoView({
													behavior: 'smooth',
												});
											}
											if (isSelected !== 0) {
												setIsSelected(0);
											}
										}}
									>
										View Details
									</Button>
								</Box>
							))}
						</Box>
						{/* <Box display="flex" p="25px 0 25px">
                  <Typography
                    sx={{ m: "auto", fontSize: 18, color: themeColors.black }}
                  >
                    No hotel found in{" "}
                    {secureLocalStorage.getItem("hotelLocation")}!
                  </Typography>
                </Box> */}
					</Box>
				</>
			</Box>

			<FooterCustomer />
		</>
	);
};

export default HotelDetailsPage;
