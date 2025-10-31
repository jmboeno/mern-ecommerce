// mern-ecommerce/frontend/src/components/MobileMenuDrawer.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, ShoppingCart, Lock, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";

const navItems = [
	{ name: "Home", to: "/", protected: false },
	{ name: "Loja", to: "/shop", protected: false },
	{ name: "Meus Códigos", to: "/profile?tab=codes", protected: true },
	{ name: "Downloads", to: "/downloads", protected: false },
];

const MobileMenuDrawer = ({ isOpen, onClose, user, logout }) => {
	const isLogged = !!user;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 lg:hidden"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					{/* Overlay */}
					<div 
						className="absolute inset-0 bg-black bg-opacity-60" 
						onClick={onClose}
						aria-label="Close menu"
					/>

					{/* Drawer Content */}
					<motion.div
						className="fixed right-0 top-0 w-64 h-full bg-gray-900 shadow-2xl p-6"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "tween", duration: 0.3 }}
					>
						<button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white" aria-label="Close menu">
							<X size={24} />
						</button>
						
						<h3 className="text-2xl font-bold text-emerald-400 mb-8 pt-2 text-center">Menu</h3>

						{/* Links Principais */}
						<nav className="flex flex-col space-y-4 border-b border-gray-700 pb-6">
							{navItems.map(item => {
								if (item.protected && !isLogged) return null; // Oculta itens protegidos se deslogado
								return (
									<Link
										key={item.name}
										to={item.to}
										onClick={onClose}
										className="text-lg font-medium text-gray-300 hover:text-emerald-400 transition"
									>
										{item.name}
									</Link>
								);
							})}
						</nav>
						
						{/* Ações Condicionais */}
						<div className="flex flex-col space-y-4 pt-6">
							{isLogged ? (
								<>
									{/* Minha Conta / Dashboard Admin */}
									<Link
										to={user.role === "admin" ? "/secret-dashboard" : "/profile"}
										onClick={onClose}
										className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
									>
										{(user.role === "admin" ? <Lock size={20} /> : <LayoutDashboard size={20} />)}
										{user.role === "admin" ? "Admin" : "Minha Conta"}
									</Link>
									
									{/* Carrinho (se logado) */}
									<Link
										to="/cart"
										onClick={onClose}
										className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
									>
										<ShoppingCart size={20} /> Carrinho
									</Link>

									{/* Logout */}
									<button
										onClick={() => { logout(); onClose(); }}
										className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
									>
										<LogOut size={20} /> Log Out
									</button>
								</>
							) : (
								<>
									{/* Login / Signup */}
									<Link
										to="/login"
										onClick={onClose}
										className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
									>
										<LogIn size={20} /> Login
									</Link>
									<Link
										to="/signup"
										onClick={onClose}
										className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
									>
										<UserPlus size={20} /> Sign Up
									</Link>
								</>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default MobileMenuDrawer;