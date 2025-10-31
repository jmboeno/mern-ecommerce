// mern-ecommerce/frontend/src/components/CategoryFormModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const CategoryFormModal = ({ isOpen, onClose, onSave, categoryToEdit }) => {
	const [formData, setFormData] = useState({
		name: "",
		image: null,
	});
	const [imagePreview, setImagePreview] = useState(null);

	useEffect(() => {
		if (categoryToEdit) {
			setFormData({
				name: categoryToEdit.name,
				image: null,
			});
			setImagePreview(categoryToEdit.imageUrl);
		} else {
			setFormData({ name: "", image: null });
			setImagePreview(null);
		}
	}, [categoryToEdit]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({ ...formData, image: reader.result }); // Alterado: Armazena o resultado em base64
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			setFormData({ ...formData, image: null });
			setImagePreview(null);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.image && !categoryToEdit) {
			toast.error("An image is required for new categories.");
			return;
		}
		onSave(formData, categoryToEdit?._id);
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
							{categoryToEdit ? "Edit Category" : "Create New Category"}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
									Category Name
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='image' className='block text-sm font-medium text-gray-300'>
									Category Image
								</label>
								<input
									type='file'
									id='image'
									onChange={handleImageChange}
									className='mt-1 block w-full text-white'
									accept='image/*'
								/>
								{imagePreview && (
									<div className='mt-2'>
										<img src={imagePreview} alt='Category Preview' className='w-20 h-20 object-cover rounded-lg' />
									</div>
								)}
							</div>

							<motion.button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{categoryToEdit ? <><Save className='mr-2 h-5 w-5' /> Save Changes</> : <><Plus className='mr-2 h-5 w-5' /> Create Category</>}
							</motion.button>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CategoryFormModal;