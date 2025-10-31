import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Loader, XCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [validToken, setValidToken] = useState(false);
	
	const navigate = useNavigate();
	const location = useLocation();
	
	const query = new URLSearchParams(location.search);
	const token = query.get('token');
	const email = query.get('email');

	useEffect(() => {
		// Verifica se o token e o email estão presentes no URL para exibir o formulário
		if (token && email) {
			setValidToken(true);
		}
	}, [token, email]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			const res = await axios.post("/auth/reset-password", { token, email, password, confirmPassword });
			toast.success(res.data.message || "Password reset successful. Redirecting to login...");
			
			setTimeout(() => {
				navigate("/login");
			}, 3000);

		} catch (error) {
			toast.error(error.response?.data?.message || "Token is invalid or has expired.");
			setValidToken(false); // Invalida a exibição do token para mostrar a mensagem de erro
		} finally {
			setLoading(false);
		}
	};

	if (!validToken) {
		return (
			<div className='flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 min-h-screen'>
				<div className='text-center'>
					<XCircle className='h-16 w-16 text-red-500 mx-auto' />
					<h2 className='mt-6 text-3xl font-extrabold text-red-500'>Invalid Link</h2>
					<p className="mt-2 text-gray-400">The password reset link is invalid or has expired. Please request a new one.</p>
					<Link to='/forgot-password' className='mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300'>
						Request a New Link
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Reset Password</h2>
				<p className="mt-2 text-center text-sm text-gray-400">Enter and confirm your new password for: <strong>{email}</strong></p>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>
								New Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
									minLength="6"
								/>
							</div>
						</div>

						<div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
								Confirm New Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='confirmPassword'
									type='password'
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border
									 border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
									minLength="6"
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Resetting...
								</>
							) : (
								"Reset Password"
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-400'>
						<Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
							<ArrowLeft className='inline h-4 w-4 mr-1' /> Back to Login
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default ResetPasswordPage;