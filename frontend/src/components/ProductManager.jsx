// mern-ecommerce/frontend/src/components/ProductManager.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "./LoadingSpinner";
import { Trash2, Edit, Plus, Star } from "lucide-react";
import ProductFormModal from "./ProductFormModal";

const ProductManager = () => {
	const { products, fetchAllProducts, loading, toggleFeaturedProduct, deleteProduct } = useProductStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [productToEdit, setProductToEdit] = useState(null);
	const [categories, setCategories] = useState([]);

	const fetchCategories = async () => {
		try {
			const response = await axios.get("/categories");
			setCategories(response.data.map(cat => cat.name));
		} catch (error) {
			console.error("Failed to fetch categories:", error);
		}
	};

	useEffect(() => {
		fetchAllProducts();
		fetchCategories();
	}, [fetchAllProducts]);

	const handleSaveProduct = async (formData, productId) => {
		try {
			if (productId) {
				await axios.put(`/products/${productId}`, formData);
				toast.success("Product updated successfully!");
			} else {
				await axios.post("/products", formData);
				toast.success("Product created successfully!");
			}
			fetchAllProducts();
			setIsModalOpen(false);
			setProductToEdit(null);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save product");
		}
	};

	const handleEditClick = (product) => {
		setProductToEdit(product);
		setIsModalOpen(true);
	};

	const handleDeleteProduct = async (productId) => {
		try {
			await deleteProduct(productId);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete product");
		}
	};

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
						setProductToEdit(null);
						setIsModalOpen(true);
					}}
					className='flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Plus className='mr-2 h-5 w-5' /> Create New Product
				</motion.button>
			</div>
			{loading ? (
				<LoadingSpinner />
			) : (
				<div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead className='bg-gray-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Product</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Category</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Price</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Featured</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{products.length === 0 ? (
								<tr>
									<td colSpan='5' className='px-6 py-4 text-center text-gray-400'>
										No products found.
									</td>
								</tr>
							) : (
								products.map((product) => (
									<tr key={product._id} className='hover:bg-gray-700'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<img className='h-10 w-10 rounded-full object-cover' src={product.image} alt={product.name} />
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-white'>{product.name}</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.category}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${product.price}</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<button
												onClick={() => toggleFeaturedProduct(product._id)}
												className={`p-1 rounded-full ${
													product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
												} hover:bg-yellow-500 transition-colors duration-200`}
											>
												<Star className='h-5 w-5' />
											</button>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											<button onClick={() => handleEditClick(product)} className='text-emerald-400 hover:text-emerald-300 mr-4'>
												<Edit className='h-5 w-5' />
											</button>
											<button onClick={() => handleDeleteProduct(product._id)} className='text-red-400 hover:text-red-300'>
												<Trash2 className='h-5 w-5' />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}

			<ProductFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveProduct}
				productToEdit={productToEdit}
				categories={categories}
			/>
		</motion.div>
	);
};

export default ProductManager;