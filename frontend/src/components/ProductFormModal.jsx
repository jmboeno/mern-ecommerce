// mern-ecommerce/frontend/src/components/ProductFormModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const ProductFormModal = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		category: categories[0] || "",
		image: null,
	});
	const [imagePreview, setImagePreview] = useState(null);

    // Efeito para inicializar o formulário quando o modal abre ou o produto muda
	useEffect(() => {
		if (productToEdit) {
			setFormData({
				name: productToEdit.name,
				description: productToEdit.description,
				// Garante que 'price' é um número ou string vazia, não undefined
				price: productToEdit.price || "", 
				category: productToEdit.category,
				image: null,
			});
			setImagePreview(productToEdit.image);
		} else {
			// Modo Criação
			setFormData({ name: "", description: "", price: "", category: categories[0] || "", image: null });
			setImagePreview(null);
		}
	}, [productToEdit, categories]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({ ...formData, image: reader.result });
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			setFormData({ ...formData, image: null });
			setImagePreview(productToEdit?.image || null); // Mantém a preview antiga se houver
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.image && !productToEdit?.image) { // Verifica se há imagem nova ou imagem antiga para edição
			toast.error("An image is required for this product.");
			return;
		}
		onSave(formData, productToEdit?._id);
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
							{productToEdit ? "Edit Product" : "Create New Product"}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
									Product Name
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
								<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
									Description
								</label>
								<textarea
									id='description'
									name='description'
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									rows='3'
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
									Price
								</label>
								<input
									type='number'
									id='price'
									name='price'
									value={formData.price}
									onChange={(e) => setFormData({ ...formData, price: e.target.value })}
									step='0.01'
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
									Category
								</label>
								<select
									id='category'
									name='category'
									value={formData.category}
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
									required
								>
									{categories?.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor='image' className='block text-sm font-medium text-gray-300'>
									Product Image
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
										<img src={imagePreview} alt='Product Preview' className='w-20 h-20 object-cover rounded-lg' />
									</div>
								)}
							</div>

							<motion.button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{productToEdit ? <><Save className='mr-2 h-5 w-5' /> Save Changes</> : <><Plus className='mr-2 h-5 w-5' /> Create Product</>}
							</motion.button>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProductFormModal;