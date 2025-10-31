import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { Package, XCircle } from "lucide-react";

const MyOrdersTab = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await axios.get("/orders/my");
				setOrders(response.data);
			} catch (error) {
				toast.error("Failed to fetch your orders.");
				console.error("Error fetching my orders:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchOrders();
	}, []);

	if (isLoading) return <LoadingSpinner />;

	if (orders.length === 0) {
		return (
			<div className="text-center py-12 bg-gray-800 rounded-lg max-w-2xl mx-auto shadow-xl">
				<Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-white">No Orders Found</h3>
				<p className="text-gray-400 mt-2">Looks like you haven't placed any orders yet.</p>
			</div>
		);
	}
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className='mx-auto space-y-6'
		>
			{orders.map((order) => (
				<div key={order._id} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-emerald-600/30">
					<div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
						<h3 className="text-lg font-semibold text-emerald-400">Order #{order._id.slice(-6)}</h3>
						<p className="text-sm text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
					</div>
					
					<div className="space-y-3">
						{order.products.map(item => (
							<div key={item.product?._id || Math.random()} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
								{item.product ? (
									<>
										<div className="flex items-center gap-3">
											<img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-sm" />
											<p className="text-sm font-medium text-white">{item.product.name}</p>
										</div>
										<p className="text-sm text-gray-300">
											${item.price.toFixed(2)} x {item.quantity}
										</p>
									</>
								) : (
									<div className="flex items-center text-sm text-red-400 gap-2">
										<XCircle size={16} /> Product Deleted
									</div>
								)}
							</div>
						))}
					</div>
					
					<div className="text-right pt-4 mt-4 border-t border-gray-700">
						<p className="text-lg font-bold text-emerald-400">Total: ${order.totalAmount.toFixed(2)}</p>
					</div>
				</div>
			))}
		</motion.div>
	);
};
export default MyOrdersTab;