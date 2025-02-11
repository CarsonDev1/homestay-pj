import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from '.';
import Account from '../modules/Home/isLogged/Account/Account';

const HomePage = lazy(() => import('../modules/Home/Home.Container'));

const HotelsListPage = lazy(() => import('../modules/Home/HotelsList/HotelsList.Container'));

const ListMomentPage = lazy(() => import('../modules/Home/MomentList/MomentList.Container'));

const ListVoucherPage = lazy(() => import('../modules/Home/VoucherList/VoucherList.Container'));

const FilterMomentPage = lazy(() => import('../modules/Home/FilterMomentByCity/FilterMoment.Container'));

const MomentDetailsPage = lazy(() => import('../modules/Home/MomentDetails/MomentDetails.Container'));

const HotelDetailsPage = lazy(() => import('../modules/Home/HotelDetails/HotelDetails.Container'));
const AboutUsPage = lazy(() => import('../modules/Home/AboutUs/AboutUs.Container'));

const CreateMomentPage = lazy(() => import('../modules/Home/isLogged/createMoment/CreateMoment.Container'));

const CreateBookingPage = lazy(() => import('../modules/Home/isLogged/createBooking/CreateBooking.Container'));

const BookingDetailsPage = lazy(() => import('../modules/Home/isLogged/BookingDetails/BookingDetails.Container'));

const MyAccountPage = lazy(() => import('../modules/Home/isLogged/MyAccount/MyAccount.Container'));

const NotFoundPage = lazy(() => import('../modules/Error/NotFound.Container'));

const UserRoutes = () => {
	return (
		<Suspense>
			<Routes>
				<Route path={routes.home.root} element={<HomePage />} />
				<Route path={routes.home.listMoments} element={<ListMomentPage />} />
				<Route path={routes.home.listVouchers} element={<ListVoucherPage />} />
				<Route path={routes.home.filterMoment} element={<FilterMomentPage />} />
				<Route path={routes.home.momentDetails} element={<MomentDetailsPage />} />
				<Route path={routes.home.listHotels} element={<HotelsListPage />} />
				<Route path={routes.home.hotelDetails} element={<HotelDetailsPage />} />
				<Route path={routes.home.aboutUs} element={<AboutUsPage />} />

				<Route path={routes.home.createMoment} element={<CreateMomentPage />} />
				<Route path={routes.home.createBooking} element={<CreateBookingPage />} />
				{/* <Route path={routes.home.myAccount} element={<MyAccountPage />} /> */}
				<Route path='/account' element={<Account />} />
				<Route path={routes.home.bookingDetails} element={<BookingDetailsPage />} />
				<Route path={'*'} element={<NotFoundPage />} />
			</Routes>
		</Suspense>
	);
};

export default UserRoutes;
