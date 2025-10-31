import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";

const ProfileSettingsTab = () => {
	const { user, checkAuth } = useUserStore();
	const [formData, setFormData] = useState({
		name: user.name,
		email: user.email,
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const dataToSubmit = {
				name: formData.name,
				email: formData.email,
			};

			if (formData.password) {
				if (formData.password !== formData.confirmPassword) {
					toast.error("Passwords do not match");
					return;
				}
				dataToSubmit.password = formData.password;
				dataToSubmit.confirmPassword = formData.confirmPassword;
			}

			const response = await axios.put("/users/profile", dataToSubmit);
			toast.success(response.data.message);
			
			// Re-fetch user data to update global state and UI
			await checkAuth(); 

			// Clear password fields on success
			setFormData(prev => ({...prev, password: "", confirmPassword: ""}));

		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl mx-auto'
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Personal Information</h2>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Full Name
					</label>
					<input
						id='name'
						type='text'
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
						required
					/>
				</div>
				
				<div>
					<label htmlFor='email' className='block text-sm font-medium text-gray-300'>
						Email Address
					</label>
					<input
						id='email'
						type='email'
						value={formData.email}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
						required
					/>
				</div>

				<div className="pt-4 border-t border-gray-700 space-y-4">
					<h3 className="text-lg font-semibold text-gray-300">Change Password</h3>
					<div className='flex gap-4'>
						<div className="flex-1">
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>
								New Password
							</label>
							<input
								type='password'
								id='password'
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
							/>
						</div>
						<div className="flex-1">
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
								Confirm New Password
							</label>
							<input
								type='password'
								id='confirmPassword'
								value={formData.confirmPassword}
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
							/>
						</div>
					</div>
				</div>

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading}
				>
					{loading ? "Saving..." : "Update Profile"}
				</button>
			</form>
		</motion.div>
	);
};
export default ProfileSettingsTab;