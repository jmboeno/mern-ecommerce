import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"; 
import { sendEmail } from "../lib/email.js";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

const createAndSendVerificationToken = async (user) => {
	// 1. Gera token
	const verificationToken = crypto.randomBytes(32).toString('hex');
	
	// 2. Define o token e a expiração (24 horas)
	user.emailVerificationToken = verificationToken;
	user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
	
	// 3. Cria URL de verificação
	const verificationURL = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${user.email}`;

	// 4. Conteúdo do e-mail
	const message = `
		<h2>Email Verification</h2>
		<p>Welcome! Please click the link below to verify your account and complete your registration:</p>
		<p><a href="${verificationURL}">Verify Account</a></p>
		<p>This link is valid for 24 hours.</p>
		<p>If you did not sign up for this account, please ignore this email.</p>
	`;
	
	try {
		await sendEmail({
			email: user.email,
			subject: 'Verify Your E-commerce Account',
			html: message,
		});
		
		console.log(`Verification URL for ${user.email}: ${verificationURL}`);
	} catch (emailError) {
		console.error("Verification email sending failed:", emailError);
		// Limpa o token se o envio falhar
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		throw new Error("Failed to send verification email. Please contact support.");
	}

	await user.save();
};

export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		
		// 1. Cria utilizador (isVerified: false por padrão no modelo)
		const user = await User.create({ name, email, password });
		
		// 2. Gera e envia token de verificação
		await createAndSendVerificationToken(user);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			message: "Account created! Please check your email to verify your account."
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			// NOVO CHECK: Verifica se o utilizador está verificado
			if (!user.isVerified) {
				return res.status(401).json({ message: "Account not verified. Please check your email." });
			}
			
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	try {
		const { token, email } = req.body;
		
		// 1. Encontra o utilizador pelo token e e-mail, e garante que o token não expirou
		const user = await User.findOne({
			email,
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() } 
		});

		if (!user) {
			return res.status(400).json({ message: "Verification link is invalid or has expired." });
		}
		
		// 2. Define o utilizador como verificado
		user.isVerified = true;
		
		// 3. Limpa os campos de verificação
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		
		await user.save();
		
		// Autentica o utilizador imediatamente
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);

		res.status(200).json({
			status: 'success',
			message: 'Email verification successful. You are now logged in.',
			user: user
		});

	} catch (error) {
		console.log("Error in verifyEmail controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// --- NOVA FUNÇÃO: Esqueceu a Senha ---
export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found with that email." });
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		user.passwordResetToken = resetToken;
		user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hora
		
		await user.save();
		
		const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;
		
		const message = `
			<h2>Password Reset Request</h2>
			<p>You requested a password reset for your e-commerce account. Click the link below to reset your password:</p>
			<p><a href="${resetURL}">Reset Password Link</a></p>
			<p>This link is valid for 1 hour.</p>
			<p>If you did not request this, please ignore this email.</p>
		`;
		
		try {
			await sendEmail({
				email: user.email,
				subject: 'Password Reset Request (Valid for 1 hour)',
				html: message,
			});
			
			res.status(200).json({
				status: 'success',
				message: 'Password reset link sent to email.',
			});
		} catch (emailError) {
			// Se o e-mail falhar, limpamos o token para que o utilizador tente novamente
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save();
			
			console.log("Email error:", emailError);
			return res.status(500).json({ 
				message: "Email sending failed. Please check your EMAIL_HOST configuration.", 
				error: emailError.message 
			});
		}

	} catch (error) {
		console.log("Error in forgotPassword controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// --- NOVA FUNÇÃO: Redefinir Senha ---
export const resetPassword = async (req, res) => {
	try {
		const { token, email, password, confirmPassword } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match." });
		}
		
		if (password.length < 6) {
			 return res.status(400).json({ message: "Password must be at least 6 characters long." });
		}

		// 1. Encontra o utilizador pelo token e e-mail, e verifica se o token está ativo
		const user = await User.findOne({
			email,
			passwordResetToken: token,
			passwordResetExpires: { $gt: Date.now() } // Token é maior que a hora atual
		});

		if (!user) {
			return res.status(400).json({ message: "Token is invalid or has expired." });
		}
		
		// 2. Atualiza a senha (o hook pre-save do Mongoose faz o hash)
		user.password = password;
		
		// 3. Limpa os campos de reset
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		
		await user.save();
		
		res.status(200).json({
			status: 'success',
			message: 'Password reset successful. You can now log in.'
		});

	} catch (error) {
		console.log("Error in resetPassword controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};