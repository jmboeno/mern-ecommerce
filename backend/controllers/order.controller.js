import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate("user", "name email")
			.populate("products.product", "name price image");
		res.json(orders);
	} catch (error) {
		console.log("Error in getAllOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// --- NOVA FUNÇÃO: Obter pedidos para o utilizador autenticado ---
export const getMyOrders = async (req, res) => {
	try {
		const userId = req.user._id;
		const orders = await Order.find({ user: userId })
			.populate("products.product", "name price image")
			.sort({ createdAt: -1 }); // Ordena do mais novo para o mais antigo

		res.json(orders);
	} catch (error) {
		console.log("Error in getMyOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedOrder = await Order.findByIdAndDelete(id);
		if (!deletedOrder) {
			return res.status(404).json({ message: "Order not found" });
		}
		res.status(200).json({ message: "Order deleted successfully" });
	} catch (error) {
		console.log("Error in deleteOrder controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};