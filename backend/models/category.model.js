// mern-ecommerce/backend/models/category.model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		imageUrl: {
			type: String,
			required: [true, "Image is required"],
		},
	},
	{ timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;