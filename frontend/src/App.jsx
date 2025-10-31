// mern-ecommerce/frontend/src/App.jsx
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Páginas
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ClientDashboard from "./pages/ClientDashboard";
import ShopPage from "./pages/ShopPage";
import DownloadsPage from "./pages/DownloadsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; 
import ResetPasswordPage from "./pages/ResetPasswordPage"; 
import VerifyEmailPage from "./pages/VerifyEmailPage"; 
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";

// Stores
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	const location = useLocation();

	// Efeito para checar autenticação na montagem
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// Efeito para buscar itens do carrinho após o login
	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	// Lógica para inicializar a aba do Dashboard do Cliente com base na query string (ex: /profile?tab=codes)
	const initialTab = new URLSearchParams(location.search).get('tab');

	return (
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50'>
				<Navbar />
				
				<main>
					<Routes>
						{/* Rotas de Conteúdo Principal */}
						<Route path='/' element={<HomePage />} />
						<Route path='/shop' element={<ShopPage />} />
						<Route path='/downloads' element={<DownloadsPage />} />
						<Route path='/category/:category' element={<CategoryPage />} />

						{/* Rotas de Autenticação */}
						<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
						<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
						<Route path='/forgot-password' element={!user ? <ForgotPasswordPage /> : <Navigate to='/' />} />
						<Route path='/reset-password' element={!user ? <ResetPasswordPage /> : <Navigate to='/' />} />
						<Route path='/verify-email' element={<VerifyEmailPage />} />

						{/* Rotas Protegidas (Cliente) */}
						<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
						<Route
							path='/profile' 
							element={user ? <ClientDashboard initialTab={initialTab} /> : <Navigate to='/login' />}
						/>
						<Route
							path='/purchase-success'
							element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
						/>
						<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />

						{/* Rotas Protegidas (Admin) */}
						<Route
							path='/secret-dashboard'
							element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
						/>
					</Routes>
				</main>
			</div>
			
			<Footer />
			<Toaster />
		</div>
	);
}

export default App;