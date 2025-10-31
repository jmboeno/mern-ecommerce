import User from "../models/user.model.js";
import { redis } from "../lib/redis.js"; 

export const getAllUsers = async (req, res) => {
	try {
		// Encontra todos os utilizadores, excluindo o administrador logado e a senha
		const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
		res.json(users);
	} catch (error) {
		console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createUserByAdmin = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		
		// Garante que a função seja válida e padrão para 'customer'
		const finalRole = role && ["customer", "admin"].includes(role) ? role : 'customer';

		const user = await User.create({ name, email, password, role: finalRole });

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			message: "User created successfully"
		});
	} catch (error) {
		console.log("Error in createUserByAdmin controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, role, password } = req.body;

		if (req.user._id.toString() === id) {
			return res.status(403).json({ message: "Cannot modify your own account details here" });
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		// 1. Atualiza campos básicos
		if (name) user.name = name;
		if (email) user.email = email;
		
		// 2. Atualiza função (role)
		if (role && ["customer", "admin"].includes(role)) {
			 user.role = role;
		}

		// 3. Atualiza senha (se fornecida - o hook pre-save fará o hash)
		if (password) {
			user.password = password;
		}
		
		await user.save();
		
		// CORREÇÃO: Converte o documento Mongoose para objeto JS e remove a senha.
		const userObject = user.toObject();
		delete userObject.password;
		
		res.json({ message: "User updated successfully", user: userObject });
	} catch (error) {
		console.log("Error in updateUser controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// --- NOVA FUNÇÃO: Atualizar Perfil para Utilizador Logado ---
export const updateUserProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const { name, email, password, confirmPassword } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// 1. Atualiza campos básicos
		if (name) user.name = name;
		if (email) user.email = email;
		
		// 2. Atualiza senha (se fornecida)
		if (password) {
			if (password !== confirmPassword) {
				return res.status(400).json({ message: "Passwords do not match" });
			}
			if (password.length < 6) {
				return res.status(400).json({ message: "Password must be at least 6 characters long" });
			}
			// O hook pre-save fará o hash da nova senha
			user.password = password; 
		}
		
		await user.save();

		// Sanitize e retorna o objeto do utilizador
		const userObject = user.toObject();
		delete userObject.password;
		
		res.json({ message: "Profile updated successfully", user: userObject });
	} catch (error) {
		console.log("Error in updateUserProfile controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleUserVerification = async (req, res) => {
	try {
		const { id } = req.params;

		if (req.user._id.toString() === id) {
			return res.status(403).json({ message: "Cannot change your own verification status" });
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.isVerified = !user.isVerified;
		
		// Limpa tokens se o usuário for ativado
		if (user.isVerified) {
			 user.emailVerificationToken = undefined;
			 user.emailVerificationExpires = undefined;
		}

		await user.save();
		
		const userObject = user.toObject();
		delete userObject.password;
		
		res.json({ 
			message: `User verification status updated to ${user.isVerified ? 'verified' : 'unverified'}`, 
			user: userObject 
		});
	} catch (error) {
		console.log("Error in toggleUserVerification controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		// Impedir que o administrador apague a sua própria conta
		if (req.user._id.toString() === id) {
			return res.status(403).json({ message: "Cannot delete your own account" });
		}

		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser) {
			return res.status(404).json({ message: "User not found" });
		}
		
		// Remove o token de atualização do Redis para encerrar a sessão
		await redis.del(`refresh_token:${id}`);
		
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.log("Error in deleteUser controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};