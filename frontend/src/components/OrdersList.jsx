// mern-ecommerce/frontend/src/components/OrdersList.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const OrdersList = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [expandedOrder, setExpandedOrder] = useState(null);

	const toggleExpand = (orderId) => {
		setExpandedOrder(expandedOrder === orderId ? null : orderId);
	};

	const fetchOrders = async () => {
		try {
			const response = await axios.get("/orders");
			setOrders(response.data);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch orders");
			console.error("Error fetching orders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleDeleteOrder = async (orderId) => {
		try {
			await axios.delete(`/orders/${orderId}`);
			toast.success("Order deleted successfully!");
			setOrders(orders.filter((order) => order._id !== orderId));
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete order");
		}
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300 px-6 py-4'>All Orders</h2>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'></th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Order ID</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>User</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Total Amount</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Date</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>
					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{orders.length === 0 ? (
							<tr>
								<td colSpan='6' className='px-6 py-4 text-center text-gray-400'>
									No orders found.
								</td>
							</tr>
						) : (
							orders.map((order) => (
								<>
									<tr key={order._id} className='hover:bg-gray-700'>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>
											<button onClick={() => toggleExpand(order._id)}>
												{expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
											</button>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{order._id}</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm font-medium text-white'>{order.user.name}</div>
											<div className='text-sm text-gray-400'>{order.user.email}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${order.totalAmount.toFixed(2)}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{new Date(order.createdAt).toLocaleDateString()}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											<button onClick={() => handleDeleteOrder(order._id)} className='text-red-400 hover:text-red-300'>
												<Trash2 className='h-5 w-5' />
											</button>
										</td>
									</tr>
									{expandedOrder === order._id && (
										<tr className='bg-gray-700'>
											<td colSpan='6' className='p-4'>
												<h3 className='text-md font-semibold mb-2 text-emerald-300'>Order Items:</h3>
												<div className='space-y-2'>
													{order.products.map((item) => (
														<div key={item.product?._id || Math.random()} className='flex items-center gap-4 p-2 bg-gray-600 rounded-md'>
															{item.product ? (
																<>
																	<img src={item.product.image} alt={item.product.name} className='w-12 h-12 object-cover rounded-md' />
																	<div className='flex-1'>
																		<p className='font-medium text-white'>{item.product.name}</p>
																		<p className='text-sm text-gray-300'>Quantity: {item.quantity}</p>
																	</div>
																	<p className='font-semibold text-emerald-300'>${item.price.toFixed(2)}</p>
																</>
															) : (
																<p className='text-red-400'>Product not found or has been deleted.</p>
															)}
														</div>
													))}
												</div>
											</td>
										</tr>
									)}
								</>
							))
						)}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default OrdersList;