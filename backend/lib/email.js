// mern-ecommerce/backend/lib/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Crie o transportador (transporter) do Nodemailer
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: process.env.EMAIL_PORT == 465, // Use true para 465, false para outras portas (como 587)
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendEmail = async (options) => {
	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: options.email,
		subject: options.subject,
		html: options.html,
	};

	await transporter.sendMail(mailOptions);
};