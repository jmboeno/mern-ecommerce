// mern-ecommerce/frontend/src/components/UserManager.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { Trash2, Edit, Plus, CheckCircle, XCircle } from "lucide-react"; 
import UserFormModal from "./UserFormModal"; 

const UserManager = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState(null);

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/users");
			setUsers(response.data);
		} catch (error) {
			toast.error("Failed to fetch users");
			console.error("Error fetching users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleSaveUser = async (formData, userId) => {
		try {
			if (userId) {
				await axios.put(`/users/${userId}`, formData); 
				toast.success("User updated successfully!");
			} else {
				await axios.post("/users", formData);
				toast.success("User created successfully!");
			}
			fetchUsers();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save user");
		}
	};

	const handleEditClick = (user) => {
		setUserToEdit(user);
		setIsModalOpen(true);
	};

	const handleDeleteUser = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
			return;
		}

		try {
			await axios.delete(`/users/${userId}`);
			toast.success("User deleted successfully!");
			
			setUsers(users.filter(u => u._id !== userId));

		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete user");
		}
	};

	// --- NOVA FUNÇÃO: Toggle Verification Status ---
	const handleToggleVerification = async (userId, currentStatus) => {
		const newStatus = !currentStatus;
		const action = newStatus ? "activate" : "deactivate";
		
		if (!window.confirm(`Are you sure you want to ${action} this user's account?`)) {
			return;
		}

		try {
			const response = await axios.patch(`/users/${userId}/verify`);
			toast.success(response.data.message);
			
			// Atualiza o estado local
			setUsers(users.map(u => u._id === userId ? { ...u, isVerified: newStatus } : u));

		} catch (error) {
			toast.error(error.response?.data?.message || `Failed to ${action} user.`);
		}
	};
	
	if (isLoading) return <LoadingSpinner />;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className='mx-auto space-y-8'
		>
			<div className='flex justify-end'>
				<motion.button
					onClick={() => {
						setUserToEdit(null);
						setIsModalOpen(true);
					}}
					className='flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Plus className='mr-2 h-5 w-5' /> Create New User
				</motion.button>
			</div>
			
			<div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
				<h2 className='text-2xl font-semibold mb-4 text-emerald-300 px-6 py-4'>Manage Users</h2>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Name</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Email</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Role</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Status</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Joined Date</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>
					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{users.length === 0 ? (
							<tr>
								<td colSpan='6' className='px-6 py-4 text-center text-gray-400'>
									No other users found.
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr key={user._id} className='hover:bg-gray-700'>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>{user.name}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{user.email}</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span 
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "admin" ? "bg-red-500 text-white" : "bg-emerald-500 text-gray-900"}`}
										>
											{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
										</span>
									</td>
									{/* Exibir Status */}
									<td className='px-6 py-4 whitespace-nowrap'>
										<span 
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? "bg-green-500 text-gray-900" : "bg-yellow-500 text-gray-900"}`}
										>
											{user.isVerified ? "Active" : "Inactive"}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{new Date(user.createdAt).toLocaleDateString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4'>
										{/* Botão de Toggle Verification */}
										<button 
											onClick={() => handleToggleVerification(user._id, user.isVerified)} 
											className={`transition-colors duration-200 ${user.isVerified ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
											title={user.isVerified ? "Deactivate Account" : "Activate Account"}
										>
											{user.isVerified ? <XCircle className='h-5 w-5' /> : <CheckCircle className='h-5 w-5' />}
										</button>
										<button 
											onClick={() => handleEditClick(user)} 
											className='text-emerald-400 hover:text-emerald-300'
											title="Edit User Details"
										>
											<Edit className='h-5 w-5' />
										</button>
										<button 
											onClick={() => handleDeleteUser(user._id)} 
											className='text-red-400 hover:text-red-300'
											title="Delete User"
										>
											<Trash2 className='h-5 w-5' />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			
			<UserFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveUser}
				userToEdit={userToEdit}
			/>
		</motion.div>
	);
};

export default UserManager;