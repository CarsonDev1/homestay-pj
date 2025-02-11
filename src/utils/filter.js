// Filter post
// 1. Pending
export const filterPostsPending = (listPost) => {
	let listPending = [];
	listPost?.forEach((element) => {
		if (element?.status === 'Awaiting Approval') {
			listPending.push(element);
		}
	});
	return listPending;
};

// 2. Approved
export const filterPostsApproved = (listPost) => {
	let listApproved = [];
	listPost?.forEach((element) => {
		if (element?.status === 'Approved') {
			listApproved.push(element);
		}
	});
	return listApproved;
};

// 3. Rejected
export const filterPostsRejected = (listPost) => {
	let listRejected = [];
	listPost?.forEach((element) => {
		if (element?.status === 'Rejected') {
			listRejected.push(element);
		}
	});
	return listRejected;
};

// Filter vouchers
// 1. Used
export const filterVoucherUsed = (listVoucher) => {
	let listUsed = [];
	listVoucher?.forEach((element) => {
		if (element?.isVoucher === false) {
			listUsed.push(element);
		}
	});
	return listUsed;
};

// 2. Unused
export const filterVoucherUnused = (listVoucher) => {
	let listUnused = [];
	listVoucher?.forEach((element) => {
		if (element?.isVoucher === true) {
			listUnused.push(element);
		}
	});
	return listUnused;
};

// Filter booking partner
// 1. Awaiting check-in
export const filterBookingCheckIn = (listBooking) => {
	let listCheckIn = [];
	listBooking?.forEach((element) => {
		if (element?.status === 'Awaiting Check-in') {
			listCheckIn.push(element);
		}
	});
	return listCheckIn;
};

// 2. Awaiting payment
export const filterBookingPayment = (listBooking) => {
	let listPayment = [];
	listBooking.forEach((element) => {
		if (element?.status === 'Awaiting Payment') {
			listPayment.push(element);
		}
	});
	return listPayment;
};

// 3. Completed
export const filterBookingCompleted = (listBooking) => {
	let listCompleted = [];
	listBooking.forEach((element) => {
		if (element?.status === 'Completed') {
			listCompleted.push(element);
		}
	});
	return listCompleted;
};

// 4. Canceled
export const filterBookingCanceled = (listBooking) => {
	let listCanceled = [];
	listBooking.forEach((element) => {
		if (element?.status === 'Canceled') {
			listCanceled.push(element);
		}
	});
	return listCanceled;
};

// Filter account
// 1. Inactive
export const filterAccountInactive = (listAccounts) => {
	let listInactiveAccount = [];
	listAccounts?.forEach((element) => {
		if (element?.isActive === false) {
			listInactiveAccount.push(element);
		}
	});
	return listInactiveAccount;
};

// 2. Active
export const filterAccountActive = (listAccounts) => {
	let listActiveAccount = [];
	listAccounts?.forEach((element) => {
		if (element?.isActive === true) {
			listActiveAccount.push(element);
		}
	});
	return listActiveAccount;
};

// 3. Role customer
export const filterAccountCustomer = (listAccounts) => {
	let listAccountCustomer = [];
	listAccounts?.forEach((element) => {
		if (element?.role?.name === 'Customer') {
			listAccountCustomer.push(element);
		}
	});
	return listAccountCustomer;
};

// 4. Role partner
export const filterAccountPartner = (listAccounts) => {
	let listAccountPartner = [];
	listAccounts?.forEach((element) => {
		if (element?.role?.name === 'Partner') {
			listAccountPartner.push(element);
		}
	});
	return listAccountPartner;
};

// Filter images
// 1. Hotel View
export const filterImageHotelView = (listImages) => {
	let listHotelView = [];
	listImages.forEach((element) => {
		if (element?.title === 'Hotel View') {
			listHotelView.push(element);
		}
	});
	return listHotelView;
};

// 2. Rooms
export const filterImageRooms = (listImages) => {
	let listRooms = [];
	listImages.forEach((element) => {
		if (element?.title === 'Rooms') {
			listRooms.push(element);
		}
	});
	return listRooms;
};

// 3. Spa
export const filterImageSpa = (listImages) => {
	let listSpa = [];
	listImages.forEach((element) => {
		if (element?.title === 'Spa') {
			listSpa.push(element);
		}
	});
	return listSpa;
};

// 4. Weddings
export const filterImageWedding = (listImages) => {
	let listWedding = [];
	listImages.forEach((element) => {
		if (element?.title === 'Weddings') {
			listWedding.push(element);
		}
	});
	return listWedding;
};

// 5. Dining
export const filterImageDining = (listImages) => {
	let listDining = [];
	listImages.forEach((element) => {
		if (element?.title === 'Dining') {
			listDining.push(element);
		}
	});
	return listDining;
};

// Filter hotels
// 1. 5 stars
export const filterHotelFiveStars = (listHotels) => {
	let listFiveStars = [];
	listHotels?.forEach((element) => {
		if (element?.hotel?.hotelStandar === 5) {
			listFiveStars.push(element);
		}
	});
	return listFiveStars;
};

// 2. 4 stars
export const filterHotelFourStars = (listHotels) => {
	let listFourStars = [];
	listHotels?.forEach((element) => {
		if (element?.hotel?.hotelStandar === 4) {
			listFourStars.push(element);
		}
	});
	return listFourStars;
};

// 3. 3 stars
export const filterHotelThreeStars = (listHotels) => {
	let listThreeStars = [];
	listHotels?.forEach((element) => {
		if (element?.hotel?.hotelStandar === 3) {
			listThreeStars.push(element);
		}
	});
	return listThreeStars;
};

// 4. 2 stars
export const filterHotelTwoStars = (listHotels) => {
	let listTwoStars = [];
	listHotels?.forEach((element) => {
		if (element?.hotel?.hotelStandar === 2) {
			listTwoStars.push(element);
		}
	});
	return listTwoStars;
};

// 5. 1 stars
export const filterHotelOneStar = (listHotels) => {
	let listOneStar = [];
	listHotels?.forEach((element) => {
		if (element?.hotel?.hotelStandar === 1) {
			listOneStar.push(element);
		}
	});
	return listOneStar;
};

// 6. Active
export const filterHotelActive = (listHotels) => {
	let listActive = [];
	listHotels.forEach((element) => {
		if (element.hotel?.status === true) {
			listActive.push(element);
		}
	});
	return listActive;
};

// 7. Inactive
export const filterHotelInactive = (listHotels) => {
	let listInactive = [];
	listHotels.forEach((element) => {
		if (element.hotel?.status === false) {
			listInactive.push(element);
		}
	});
	return listInactive;
};

// Filter report feedback
// 1. Awaiting Approval
export const filterReportFeedbackAwaitingApproval = (listReports) => {
	let listAwaitingApproval = [];
	listReports.forEach((element) => {
		if (element?.status === 'Awaiting Approval') {
			listAwaitingApproval.push(element);
		}
	});
	return listAwaitingApproval;
};

// 2. Approved
export const filterReportFeedbackApproved = (listReports) => {
	let listApproved = [];
	listReports.forEach((element) => {
		if (element?.status === 'Approved') {
			listApproved.push(element);
		}
	});
	return listApproved;
};

// 3. Rejected
export const filterReportFeedbackRejected = (listReports) => {
	let listRejected = [];
	listReports.forEach((element) => {
		if (element?.status === 'Rejected') {
			listRejected.push(element);
		}
	});
	return listRejected;
};

// Filter hotel by city
// 1. Can Tho
export const filterHotelInCanTho = (listHotels) => {
	let listCanThoHotel = [];
	listHotels?.forEach((element) => {
		if (element?.hotelAddress?.city === 'Can Tho') {
			listCanThoHotel.push(element);
		}
	});
	return listCanThoHotel;
};

// 2. Ho Chi Minh
export const filterHotelInHoChiMinh = (listHotels) => {
	let listHoChiMinhHotel = [];
	listHotels?.forEach((element) => {
		if (element?.hotelAddress?.city === 'Ho Chi Minh') {
			listHoChiMinhHotel.push(element);
		}
	});
	return listHoChiMinhHotel;
};

// 3. Da Nang
export const filterHotelInDaNang = (listHotels) => {
	let listDaNangHotel = [];
	listHotels?.forEach((element) => {
		if (element?.hotelAddress?.city === 'Da Nang') {
			listDaNangHotel.push(element);
		}
	});
	return listDaNangHotel;
};

// 4. Quy Nhon
export const filterHotelInQuyNhon = (listHotels) => {
	let listQuyNhonHotel = [];
	listHotels?.forEach((element) => {
		if (element?.hotelAddress?.city === 'Quy Nhon') {
			listQuyNhonHotel.push(element);
		}
	});
	return listQuyNhonHotel;
};

// 5. Ha Noi
export const filterHotelInHaNoi = (listHotels) => {
	let listHaNoiHotel = [];
	listHotels?.forEach((element) => {
		if (element?.hotelAddress?.city === 'Ha Noi') {
			listHaNoiHotel.push(element);
		}
	});
	return listHaNoiHotel;
};

// Filter post in city
// 1. Can Tho
export const filterPostsInCanTho = (listPosts) => {
	let listCanTho = [];
	listPosts?.forEach((element) => {
		if (element?.location === 'Can Tho') {
			listCanTho.push(element);
		}
	});
	return listCanTho;
};

// 2. Ho Chi Minh
export const filterPostsInHoChiMinh = (listPosts) => {
	let listHoChiMinh = [];
	listPosts?.forEach((element) => {
		if (element?.location === 'Ho Chi Minh') {
			listHoChiMinh.push(element);
		}
	});
	return listHoChiMinh;
};

// 3. Da Nang
export const filterPostsInDaNang = (listPosts) => {
	let listDaNang = [];
	listPosts?.forEach((element) => {
		if (element?.location === 'Da Nang') {
			listDaNang.push(element);
		}
	});
	return listDaNang;
};

// 4. Quy Nhon
export const filterPostsInQuyNhon = (listPosts) => {
	let listQuyNhon = [];
	listPosts?.forEach((element) => {
		if (element?.location === 'Quy Nhon') {
			listQuyNhon.push(element);
		}
	});
	return listQuyNhon;
};

// 5. Ha Noi
export const filterPostsInHaNoi = (listPosts) => {
	let listHaNoi = [];
	listPosts?.forEach((element) => {
		if (element?.location === 'Ha Noi') {
			listHaNoi.push(element);
		}
	});
	return listHaNoi;
};

// Filter feedback
// 1. 5 stars
export const filterFeedbackFiveStars = (listFeedback) => {
	let listFiveStars = [];
	listFeedback?.forEach((element) => {
		if (element?.rating === 5) {
			listFiveStars.push(element);
		}
	});
	return listFiveStars;
};

// 2. 4 stars
export const filterFeedbackFourStars = (listFeedback) => {
	let listFourStars = [];
	listFeedback?.forEach((element) => {
		if (element?.rating === 4) {
			listFourStars.push(element);
		}
	});
	return listFourStars;
};

// 3. 3 stars
export const filterFeedbackThreeStars = (listFeedback) => {
	let listThreeStars = [];
	listFeedback?.forEach((element) => {
		if (element?.rating === 3) {
			listThreeStars.push(element);
		}
	});
	return listThreeStars;
};

// 4. 2 stars
export const filterFeedbackTwoStars = (listFeedback) => {
	let listTwoStars = [];
	listFeedback?.forEach((element) => {
		if (element?.rating === 2) {
			listTwoStars.push(element);
		}
	});
	return listTwoStars;
};

// 5. 1 star
export const filterFeedbackOneStar = (listFeedback) => {
	let listOneStar = [];
	listFeedback?.forEach((element) => {
		if (element?.rating === 1) {
			listOneStar.push(element);
		}
	});
	return listOneStar;
};

// Filter list hotels 5 stars
export const findFiveStarsHotels = (listHotel) => {
	let listHotels = [];

	listHotel?.forEach((hotel) => {
		if (hotel?.homeStayStandar === 5 && hotel.length > 0) {
			listHotels.push({
				...hotel,
			});
		}
	});

	return listHotels;
};

// Filter list hotels have room
export const filterListHotelsHaveRoom = (listHotels) => {
	let listHotel = [];

	listHotels?.forEach((element) => {
		if (element?.rooms?.length > 0) {
			listHotel.push(element);
		}
	});

	return listHotel;
};
