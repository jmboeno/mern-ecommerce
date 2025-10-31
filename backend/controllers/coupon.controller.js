// mern-ecommerce/backend/controllers/coupon.controller.js
import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		
		// A consulta agora usa $or para procurar um cupom que seja:
		// 1. Ativo E (sem userId OU userId = null) (Cupom genérico)
		// 2. OU Ativo E userId = ID do utilizador logado (Cupom personalizado)
		const coupon = await Coupon.findOne({ 
			code: code, 
			isActive: true,
			$or: [
				{ userId: { $exists: false } }, // Cupom genérico (campo userId ausente)
				{ userId: null },			  // Cupom genérico (campo userId é null)
				{ userId: req.user._id }	   // Cupom personalizado
			]
		});

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createCoupon = async (req, res) => {
	try {
		const { code, discountPercentage, expirationDate } = req.body;
		if (!code || !discountPercentage || !expirationDate) {
			return res.status(400).json({ message: "All fields are required" });
		}
		
		// Corrige a data de expiração para o final do dia em UTC
		const parts = expirationDate.split('-'); 
		const expiryDate = new Date();
		expiryDate.setUTCFullYear(parseInt(parts[0]));
		expiryDate.setUTCMonth(parseInt(parts[1]) - 1);
		expiryDate.setUTCDate(parseInt(parts[2]));
		expiryDate.setUTCHours(23, 59, 59, 999);

		const newCoupon = new Coupon({ 
			code, 
			discountPercentage, 
			expirationDate: expiryDate, 
			// userId: req.user._id  <-- REMOVIDO PARA CRIAR CUPONS GENÉRICOS
		});
		await newCoupon.save();
		res.status(201).json(newCoupon);
	} catch (error) {
		console.log("Error in createCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllCoupons = async (req, res) => {
	try {
		const coupons = await Coupon.find({});

		// Verifique a validade de cada cupom e atualize o status se necessário
		for (const coupon of coupons) {
			if (coupon.isActive && coupon.expirationDate < new Date()) {
				coupon.isActive = false;
				await coupon.save();
			}
		}

		// Busque novamente os cupons para garantir que todos os estados estejam atualizados
		const updatedCoupons = await Coupon.find({});
		res.json(updatedCoupons);
	} catch (error) {
		console.log("Error in getAllCoupons controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// --- Função updateCoupon (Corrigida) ---
export const updateCoupon = async (req, res) => {
	try {
		const { id } = req.params;
		const { code, discountPercentage, expirationDate } = req.body;
		
		let updateFields = { code, discountPercentage };

		if (expirationDate) {
			// CORREÇÃO DE DATA: Constrói a data de expiração para 23:59:59 no FUSO HORÁRIO UTC (Z).
			const parts = expirationDate.split('-'); 
			const expiryDate = new Date();
			expiryDate.setUTCFullYear(parseInt(parts[0]));
			expiryDate.setUTCMonth(parseInt(parts[1]) - 1);
			expiryDate.setUTCDate(parseInt(parts[2]));
			expiryDate.setUTCHours(23, 59, 59, 999);

			updateFields.expirationDate = expiryDate;

			// Reativa o cupom se a nova data for no futuro
			if (expiryDate > new Date()) {
				updateFields.isActive = true;
			}
		}

		const updatedCoupon = await Coupon.findByIdAndUpdate(
			id,
			updateFields, 
			{ new: true, runValidators: true }
		);

		if (!updatedCoupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}
		res.status(200).json(updatedCoupon);
	} catch (error) {
		console.log("Error in updateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const deleteCoupon = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedCoupon = await Coupon.findByIdAndDelete(id);
		if (!deletedCoupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}
		res.status(200).json({ message: "Coupon deleted successfully" });
	} catch (error) {
		console.log("Error in deleteCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};