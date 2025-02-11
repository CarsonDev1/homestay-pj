import React from 'react';
import secureLocalStorage from 'react-secure-storage';
import { routes } from '../routes';
import { AssetImages } from './images';

// Format price
export const formatPrice = (number) => number?.toLocaleString('vi-VN');

// Format description in UI
export const formatDesc = (text) => {
	const lines = text?.split('\n');
	return lines?.map((line, index) => (
		<React.Fragment key={index}>
			{line}
			{index !== lines?.length - 1 && (
				<>
					<br />
					<br />
				</>
			)}
		</React.Fragment>
	));
};

// Format description in input
export const formatDescInInput = (text) => {
	const lines = text?.split('\n');
	return lines.map((line, index) => (index !== lines?.length - 1 ? `${line}\n` : line)).join('\n');
};

// Format Date -> January 20
export const formatDateMonthAndDay = (dateString) => {
	const date = new Date(dateString);
	const options = { month: 'long', day: 'numeric' };
	return date?.toLocaleDateString('en-US', options);
};

// Format Date -> Fri, May 24, 2024
export const formatDateWithWeekDay = (dateString) => {
	const date = new Date(dateString);
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	};
	return date?.toLocaleDateString('en-US', options);
};

// Format Date -> DD/MM/YYYY
export const formatDate = (dateString) => {
	const date = new Date(dateString);
	const day = String(date?.getDate()).padStart(2, '0');
	const month = String(date?.getMonth() + 1).padStart(2, '0');
	const year = date?.getFullYear();

	const formatDate = `${day}/${month}/${year}`;
	return formatDate;
};

// Format Date -> YYYY/MM/DD
export const formatDateInput = (dateString) => {
	const date = new Date(dateString);
	const day = String(date?.getDate()).padStart(2, '0');
	const month = String(date?.getMonth() + 1).padStart(2, '0');
	const year = date?.getFullYear();

	const formatDate = `${year}-${month}-${day}`;
	return formatDate;
};

// Format phone number -> 09xx - xxx - xxx
export const formatPhoneNumber = (phoneNumber) => {
	const formattedNumber = phoneNumber?.replace(/(\d{4})(\d{3})(\d{3})/, '$1 - $2 - $3');

	return formattedNumber;
};

// Calculate nights
export const calculateNights = (startDateString, endDateString) => {
	const startDate = new Date(startDateString);
	const endDate = new Date(endDateString);
	startDate?.setHours(0, 0, 0, 0);
	endDate?.setHours(0, 0, 0, 0);

	const millisecondsPerDay = 24 * 60 * 60 * 1000;

	const differenceInMilliseconds = endDate - startDate;

	const differenceInDays = differenceInMilliseconds / millisecondsPerDay;

	return differenceInDays;
};

// Calculate total subService of hotel
export const calculateSubService = (listService) => {
	let count = 0;
	listService?.map((service) => {
		return service?.subServices?.map((subService) => {
			if (subService) {
				count++;
			}
			return count;
		});
	});
	return count;
};

// Calculate total quantity of room of hotel
export const calculateTotalRoom = (listRoom) => {
	let count = 0;
	listRoom?.map((element) => {
		return (count += element?.quantity);
	});
	return count;
};

// Calculate average rating
export const calculateAverageRating = (listReviews) => {
	const totalStars = listReviews?.reduce((acc, review) => acc + review?.rating, 0);
	return totalStars / listReviews?.length;
};

// Calculate total bookings
export const calculateTotalBookings = (listBookings) => {
	let count = 0;
	listBookings?.map((element) => {
		return (count += element?.data);
	});
	return count;
};

// Calculate total revenues - admin
export const calculateTotalRevenuesAdmin = (listRevenues) => {
	let count = 0;
	listRevenues?.map((element) => {
		return (count += element?.data);
	});
	return count;
};

// Calculate total revenues - partner
export const calculateTotalRevenuesPartner = (data) => {
	let count = 0;
	data?.map((element) => {
		return (count += element?.revenue);
	});
	return count;
};

//  Calculate before 24 hours and check-in date => allow user cancel booking
export const compareDates = (givenDateStr) => {
	const givenDate = new Date(givenDateStr);
	const currentDate = new Date();

	const differenceInMs = givenDate - currentDate;
	const differenceInHours = differenceInMs / (1000 * 60 * 60);

	return differenceInHours > 24;
};

// Render star
export const renderStars = (rating) => {
	let stars = [];
	for (let i = 0; i < rating; i++) {
		stars.push(<img key={i} src={AssetImages.ICONS.STAR} alt='' style={{ width: 24, height: 24 }} />);
	}
	return stars;
};

export const checkLogin = () => {
	const token = localStorage.getItem('token');
	if (token) {
		return true;
	} else {
		return false;
	}
};

export const checkPermisson = (navigate) => {
	switch (secureLocalStorage.getItem('role')) {
		case 'Admin':
			navigate(routes.admin.dashboard);
			break;
		case 'Manager':
			navigate(routes.partner.dashboard);
			break;
		case 'User':
			navigate(routes.home.root);
			break;
		default:
			break;
	}
};
