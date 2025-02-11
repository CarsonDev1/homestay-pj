/* eslint-disable react-hooks/exhaustive-deps */
import { CssBaseline } from '@mui/material';
import ThemeProvider from './themes/ThemeProvider';
import NotSignInRoutes from './routes/NotSignInRoutes';
import { Bounce, ToastContainer } from 'react-toastify';
import secureLocalStorage from 'react-secure-storage';
import AdminRoutes from './routes/AdminRoutes';
import PartnerRoutes from './routes/PartnerRoutes';
import UserRoutes from './routes/UserRoutes';
import { checkLogin } from './utils/helper';
import { useEffect } from 'react';
import { authContext } from './context/AuthContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ScrollToTopComponent from './components/ScrollToTop/ScrollToTop.Component';
import Account from './modules/Home/isLogged/Account/Account';

function App() {
	const navigate = useNavigate();

	const checkRole = () => {
		switch (secureLocalStorage.getItem('role')) {
			case 'Admin':
				return <AdminRoutes />;
			case 'Manager':
				return <PartnerRoutes />;
			case 'User':
				return <UserRoutes />;
			default:
				return <NotSignInRoutes />;
		}
	};

	useEffect(() => {
		authContext(navigate);
	}, []);

	return (
		<ThemeProvider>
			<CssBaseline />
			<div className='App'>
				<Routes>
					<Route path='/account' element={<Account />} />
					<Route path='/*' element={checkLogin() ? checkRole() : <NotSignInRoutes />} />
				</Routes>
			</div>
			<ScrollToTopComponent />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover
				theme='light'
				transition={Bounce}
			/>
		</ThemeProvider>
	);
}

export default App;
