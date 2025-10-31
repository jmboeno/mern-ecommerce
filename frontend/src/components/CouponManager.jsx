// mern-ecommerce/frontend/src/components/CouponManager.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { Plus, Trash2, Edit } from "lucide-react";
import CouponFormModal from "./CouponFormModal";
import LoadingSpinner from "./LoadingSpinner";

// Função para formatar a string ISO (YYYY-MM-DDT...) para DD/MM/YYYY
const formatDisplayDate = (isoDateString) => {
	if (!isoDateString) return "";
	try {
		const datePart = isoDateString.split('T')[0]; // Obtém a parte YYYY-MM-DD
		const [year, month, day] = datePart.split('-');
		return `${day}/${month}/${year}`;
	} catch (e) {
		return "Invalid Date";
	}
};

const CouponManager = () => {
	const [coupons, setCoupons] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [couponToEdit, setCouponToEdit] = useState(null);

	const fetchCoupons = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/coupons/all");
			setCoupons(response.data);
		} catch (error) {
			toast.error("Failed to fetch coupons");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCoupons();
	}, []);

	const handleSaveCoupon = async (formData, couponId) => {
		try {
			if (couponId) {
				await axios.put(`/coupons/${couponId}`, formData);
				toast.success("Coupon updated successfully!");
			} else {
				await axios.post("/coupons/create", formData);
				toast.success("Coupon created successfully!");
			}
			fetchCoupons();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save coupon");
		}
	};

	const handleDeleteCoupon = async (id) => {
		try {
			await axios.delete(`/coupons/${id}`);
			toast.success("Coupon deleted successfully!");
			fetchCoupons();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete coupon");
		}
	};

	const handleEditClick = (coupon) => {
		setCouponToEdit(coupon);
		setIsModalOpen(true);
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
						setCouponToEdit(null);
						setIsModalOpen(true);
					}}
					className='flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Plus className='mr-2 h-5 w-5' /> Create New Coupon
				</motion.button>
			</div>

			<div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
				<h2 className='text-2xl font-semibold mb-4 text-emerald-300 px-6 py-4'>Manage Coupons</h2>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Code</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Discount %</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Expires</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Active</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>
					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{coupons.length === 0 ? (
							<tr>
								<td colSpan='5' className='px-6 py-4 text-center text-gray-400'>
									No coupons found.
								</td>
							</tr>
						) : (
							coupons.map((coupon) => (
								<tr key={coupon._id} className='hover:bg-gray-700'>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>{coupon.code}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{coupon.discountPercentage}%</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{formatDisplayDate(coupon.expirationDate)} 
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm'>
										{coupon.isActive ? <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-gray-900'>Yes</span> : <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-white'>No</span>}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<button onClick={() => handleEditClick(coupon)} className='text-emerald-400 hover:text-emerald-300 mr-4'>
											<Edit className='h-5 w-5' />
										</button>
										<button onClick={() => handleDeleteCoupon(coupon._id)} className='text-red-400 hover:text-red-300'>
											<Trash2 className='h-5 w-5' />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<CouponFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveCoupon}
				couponToEdit={couponToEdit}
			/>
		</motion.div>
	);
};

export default CouponManager;