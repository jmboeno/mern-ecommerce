// mern-ecommerce/frontend/src/pages/VerifyEmailPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";

const VerifyEmailPage = () => {
	const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
	const location = useLocation();
	const navigate = useNavigate();
	const { checkAuth } = useUserStore();
	
	const query = new URLSearchParams(location.search);
	const token = query.get('token');
	const email = query.get('email');

	useEffect(() => {
		if (!token || !email) {
			setStatus('error');
			return;
		}

		const verify = async () => {
			try {
				const res = await axios.post("/auth/verify-email", { token, email });
				setStatus('success');
				// O backend autentica o utilizador, atualizamos o estado
				await checkAuth(); 
				
				// Redireciona para home após 3 segundos
				setTimeout(() => navigate("/"), 3000);
				
			} catch (error) {
				// Aqui é onde o erro é capturado.
				// O erro ocorre se o token tiver expirado ou for inválido.
				setStatus('error');
			}
		};
		verify();
	}, [token, email, navigate, checkAuth]);

	const renderContent = () => {
		switch (status) {
			case 'verifying':
				return (
					<div className="text-center">
						<Loader className="h-16 w-16 text-emerald-400 mx-auto animate-spin" />
						<h2 className='mt-6 text-3xl font-extrabold text-emerald-400'>Verifying Account...</h2>
						<p className="mt-2 text-gray-400">Please wait while we confirm your email address.</p>
					</div>
				);
			case 'success':
				return (
					<div className="text-center">
						<CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
						<h2 className='mt-6 text-3xl font-extrabold text-emerald-400'>Verification Successful!</h2>
						<p className="mt-2 text-gray-400">Your account is now active. Redirecting to home page...</p>
					</div>
				);
			case 'error':
				return (
					<div className="text-center">
						<XCircle className="h-16 w-16 text-red-500 mx-auto" />
						<h2 className='mt-6 text-3xl font-extrabold text-red-500'>Verification Failed</h2>
						<p className="mt-2 text-gray-400">The verification link is invalid or has expired.</p>
						<a href="/signup" className="mt-4 inline-block text-emerald-400 hover:text-emerald-300">
							Back to Signup
						</a>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className='flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 min-h-screen'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md bg-gray-800 py-12 px-4 shadow-xl sm:rounded-lg'
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{renderContent()}
			</motion.div>
		</div>
	);
};
export default VerifyEmailPage;