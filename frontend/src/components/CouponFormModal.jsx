import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const CouponFormModal = ({ isOpen, onClose, onSave, couponToEdit }) => {
	const [formData, setFormData] = useState({
		code: "",
		discountPercentage: 0,
		expirationDate: "",
	});

	useEffect(() => {
		if (couponToEdit) {
			setFormData({
				code: couponToEdit.code,
				discountPercentage: couponToEdit.discountPercentage,
				expirationDate: couponToEdit.expirationDate.split("T")[0],
			});
		} else {
			setFormData({ code: "", discountPercentage: 0, expirationDate: "" });
		}
	}, [couponToEdit]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData, couponToEdit?._id);
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
							{couponToEdit ? "Edit Coupon" : "Create New Coupon"}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label htmlFor='code' className='block text-sm font-medium text-gray-300'>
									Coupon Code
								</label>
								<input
									type='text'
									id='code'
									name='code'
									value={formData.code}
									onChange={(e) => setFormData({ ...formData, code: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='discount' className='block text-sm font-medium text-gray-300'>
									Discount Percentage
								</label>
								<input
									type='number'
									id='discount'
									name='discount'
									value={formData.discountPercentage}
									onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									min='0'
									max='100'
									required
								/>
							</div>

							<div>
								<label htmlFor='expirationDate' className='block text-sm font-medium text-gray-300'>
									Expiration Date
								</label>
								<input
									type='date'
									id='expirationDate'
									name='expirationDate'
									value={formData.expirationDate}
									onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>

							<motion.button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{couponToEdit ? <><Save className='mr-2 h-5 w-5' /> Save Changes</> : <><Plus className='mr-2 h-5 w-5' /> Create Coupon</>}
							</motion.button>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CouponFormModal;