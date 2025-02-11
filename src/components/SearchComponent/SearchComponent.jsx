/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import BoxContainer from '../Box/Box.Container';
import './SearchComponent.Style.scss';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { themeColors } from '../../themes/schemes/PureLightThem';
import { DateRange } from 'react-date-range';
import { getAllHotelNameToSearch, searchHotelByCity } from '../../modules/Home/Home.Api';
import ToastComponent from '../Toast/Toast.Component';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { useDispatch } from 'react-redux';
import { saveListHotels } from '../../modules/Home/Home.Actions';
import { filterListHotelsHaveRoom } from '../../utils/filter';
import secureLocalStorage from 'react-secure-storage';
import { formatDate } from 'date-fns';

const SearchComponent = () => {
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);
	const checkoutDate = currentDate.setDate(currentDate.getDate() + 1);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const dateRangeRef = useRef(null);
	const roomGuestRef = useRef(null);

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

	const init = async () => {
		const res = await getAllHotelNameToSearch();

		if (res) {
			setOptionsHotel(res);
		}
	};

	const handleSearch = async () => {
		try {
			if (city !== null) {
				let formData = new FormData();

				formData.append('city', city?.city);

				const res = await searchHotelByCity(formData, dispatch);

				if (filterListHotelsHaveRoom(res).length !== 0 && filterListHotelsHaveRoom(res)) {
					secureLocalStorage.setItem('city', city?.city);
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
	}, []);

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
				message="Sorry, we couldn't find the hotel you were looking for!"
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
									getOptionLabel={(option) => option?.city}
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
								<span onClick={() => setOpenDate(!openDate)} className='search_Item--text'>{`${format(
									dates[0].startDate,
									'dd/MM/yyyy'
								)} - ${format(dates[0].endDate, 'dd/MM/yyyy')}`}</span>
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
						{/* <Box className="search_content">
              <Typography
                sx={{
                  fontSize: "20px",
                  lineHeight: "20px",
                  color: themeColors.black,
                  marginBottom: "15px",
                }}
              >
                Rooms & Guests
              </Typography>

              <Box className="search_content-Item">
                <FontAwesomeIcon
                  onClick={() => setOpenOptions(!openOptions)}
                  icon={faPerson}
                  className="search_Item--icon"
                />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="search_Item--text"
                >
                  {`${
                    options.person <= 1
                      ? `${options.person} person`
                      : `${options.person} people`
                  } and ${
                    options.room <= 1
                      ? `${options.room} room`
                      : `${options.room} rooms`
                  }`}
                </span>
                {openOptions && (
                  <Box ref={roomGuestRef} className="search_Item--options">
                    <Box className="search_Item--optionItem">
                      <span className="search_Item--optionItem-text">
                        Person
                      </span>
                      <Box className="search_Item--optionItem-optionCounter">
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("person", "d")}
                          disabled={options.person <= 1}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.person}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("person", "i")}
                          disabled={options.person >= 20}
                        >
                          +
                        </button>
                      </Box>
                    </Box>

                    <Box className="search_Item--optionItem">
                      <span className="search_Item--optionItem-text">Room</span>
                      <Box className="search_Item--optionItem-optionCounter">
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "d")}
                          disabled={options.room <= 1}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "i")}
                          disabled={options.room >= 10}
                        >
                          +
                        </button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box> */}
						<Box sx={{ marginTop: '42px' }}>
							<Button className='search_Item--btn-search' onClick={handleSearch}>
								Search
							</Button>
						</Box>
					</Box>
				</Box>
			</BoxContainer>
		</>
	);
};

export default SearchComponent;
