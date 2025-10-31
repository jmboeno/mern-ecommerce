// mern-ecommerce/frontend/src/components/CategoryManager.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { Plus, Trash2, Edit } from "lucide-react";
import CategoryFormModal from "./CategoryFormModal";

const CategoryManager = () => {
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState(null);

	const fetchCategories = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/categories");
			setCategories(response.data);
		} catch (error) {
			toast.error("Failed to fetch categories");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleSaveCategory = async (formData, categoryId) => {
		try {
			if (categoryId) {
				await axios.put(`/categories/${categoryId}`, formData); // Alterado: Envia o objeto diretamente
				toast.success("Category updated successfully!");
			} else {
				await axios.post("/categories", formData); // Alterado: Envia o objeto diretamente
				toast.success("Category created successfully!");
			}
			fetchCategories();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save category");
		}
	};

	const handleDeleteCategory = async (categoryId) => {
		try {
			await axios.delete(`/categories/${categoryId}`);
			toast.success("Category deleted successfully!");
			fetchCategories();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete category");
		}
	};

	const handleEditClick = (category) => {
		setCategoryToEdit(category);
		setIsModalOpen(true);
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
						setCategoryToEdit(null);
						setIsModalOpen(true);
					}}
					className='flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Plus className='mr-2 h-5 w-5' /> Create New Category
				</motion.button>
			</div>

			<div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
				<h2 className='text-2xl font-semibold mb-4 text-emerald-300 px-6 py-4'>Manage Categories</h2>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<table className='min-w-full divide-y divide-gray-700'>
						<thead className='bg-gray-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Category</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{categories.length === 0 ? (
								<tr>
									<td colSpan='2' className='px-6 py-4 text-center text-gray-400'>
										No categories found.
									</td>
								</tr>
							) : (
								categories.map((category) => (
									<tr key={category._id} className='hover:bg-gray-700'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<img className='h-10 w-10 rounded-full object-cover' src={category.imageUrl} alt={category.name} />
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-white'>{category.name}</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											<button onClick={() => handleEditClick(category)} className='text-emerald-400 hover:text-emerald-300 mr-4'>
												<Edit className='h-5 w-5' />
											</button>
											<button onClick={() => handleDeleteCategory(category._id)} className='text-red-400 hover:text-red-300'>
												<Trash2 className='h-5 w-5' />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>

			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveCategory}
				categoryToEdit={categoryToEdit}
			/>
		</motion.div>
	);
};

export default CategoryManager;