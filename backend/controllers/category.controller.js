// mern-ecommerce/backend/controllers/category.controller.js
import Category from "../models/category.model.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const createCategory = async (req, res) => {
	try {
		const { name, image } = req.body;
		if (!name || !image) {
			return res.status(400).json({ message: "Name and image are required" });
		}

		// Altere a verificação para ser insensível a maiúsculas e minúsculas
		const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
		if (existingCategory) {
			return res.status(400).json({ message: "Category with this name already exists" });
		}

		let cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "categories" });

		const newCategory = new Category({
			name: name, // Remova a conversão para minúsculas
			imageUrl: cloudinaryResponse.secure_url,
		});

		await newCategory.save();
		res.status(201).json(newCategory);
	} catch (error) {
		console.log("Error in createCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({});
		res.json(categories);
	} catch (error) {
		console.log("Error in getAllCategories controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, image } = req.body;
		const category = await Category.findById(id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		// Verifique se o novo nome já existe (ignorando a própria categoria)
		if (name && name.toLowerCase() !== category.name.toLowerCase()) {
			const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
			if (existingCategory) {
				return res.status(400).json({ message: "Another category with this name already exists" });
			}
		}

		let imageUrl = category.imageUrl;
		if (image) {
			if (category.imageUrl) {
				const publicId = category.imageUrl.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(`categories/${publicId}`);
			}
			const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "categories" });
			imageUrl = cloudinaryResponse.secure_url;
		}

		category.name = name; // Remova a conversão para minúsculas
		category.imageUrl = imageUrl;
		await category.save();

		res.status(200).json(category);
	} catch (error) {
		console.log("Error in updateCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const category = await Category.findByIdAndDelete(id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		if (category.imageUrl) {
			const publicId = category.imageUrl.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(`categories/${publicId}`);
		}

		await Product.updateMany({ category: category.name }, { category: "uncategorized" });

		res.status(200).json({ message: "Category deleted successfully" });
	} catch (error) {
		console.log("Error in deleteCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};