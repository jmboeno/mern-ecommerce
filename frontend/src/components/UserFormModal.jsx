// mern-ecommerce/frontend/src/components/UserFormModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, X } from "lucide-react";

const UserFormModal = ({ isOpen, onClose, onSave, userToEdit }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "customer",
		password: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (userToEdit) {
			setFormData({
				name: userToEdit.name,
				email: userToEdit.email,
				role: userToEdit.role,
				password: "", // Nunca preencha senhas
				confirmPassword: "",
			});
		} else {
			setFormData({ name: "", email: "", role: "customer", password: "", confirmPassword: "" });
		}
	}, [userToEdit]);

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Validação de senhas para CRIAÇÃO
		if (!userToEdit && formData.password.length < 6) {
			 alert("Password must be at least 6 characters long.");
			 return;
		}

		// Validação de confirmação de senha
		if (formData.password !== formData.confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		let dataToSave = { 
			name: formData.name, 
			email: formData.email, 
			role: formData.role 
		};

		// Adiciona a senha apenas se não for vazio (para edição)
		if (formData.password) {
			dataToSave.password = formData.password;
		}

		onSave(dataToSave, userToEdit?._id);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className='bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative'
						initial={{ scale: 0.9, y: 50 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.9, y: 50 }}
					>
						<button onClick={onClose} className='absolute top-4 right-4 text-gray-400 hover:text-white'>
							<X size={24} />
						</button>
						<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>
							{userToEdit ? "Edit User" : "Create New User"}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
									Full Name
								</label>
								<input
									type='text'
									id='name'
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>
							
							<div>
								<label htmlFor='email' className='block text-sm font-medium text-gray-300'>
									Email
								</label>
								<input
									type='email'
									id='email'
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='role' className='block text-sm font-medium text-gray-300'>
									Role
								</label>
								<select
									id='role'
									value={formData.role}
									onChange={(e) => setFormData({ ...formData, role: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								>
									<option value='customer'>Customer</option>
									<option value='admin'>Admin</option>
								</select>
							</div>

							<p className="text-sm text-gray-400 pt-2">
								{userToEdit ? "Leave password fields blank to keep current password." : "Set a new password (min. 6 characters)."}
							</p>

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
										Confirm Password
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
							
							<motion.button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{userToEdit ? <><Save className='mr-2 h-5 w-5' /> Save Changes</> : <><Plus className='mr-2 h-5 w-5' /> Create User</>}
							</motion.button>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default UserFormModal;