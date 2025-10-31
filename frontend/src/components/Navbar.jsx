// mern-ecommerce/frontend/src/components/Navbar.jsx
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, LayoutDashboard, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react"; // Importar useState
import MobileMenuDrawer from "./MobileMenuDrawer"; // Importar o Drawer
import logoSvg from "/logo3.svg";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const isLogged = !!user;
	const { cart } = useCartStore();
	const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do menu

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='items-center space-x-2 flex'>
						<img src={logoSvg} alt="Site Logo" className="h-8 w-auto" />
					</Link>

					{/* Botão Sanduíche (Visível apenas em Mobile) */}
					<button 
						className="text-gray-300 lg:hidden p-2"
						onClick={() => setIsMenuOpen(true)}
						aria-label="Toggle navigation menu"
					>
						<Menu size={24} />
					</button>

					{/* Navegação Desktop (Escondida em Mobile) */}
					<nav className='hidden lg:flex flex-wrap items-center gap-4'>
						
						{/* 1. HOME */}
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
						>
							Home
						</Link>

						{/* 2. LOJA (Recargas) */}
						<Link
							to={"/shop"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
						>
							Loja
						</Link>
						
						{/* 3. MEUS CÓDIGOS */}
						<Link
							to={isLogged ? "/profile?tab=codes" : "/login"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
						>
							Meus Códigos
						</Link>
						
						{/* 4. DOWNLOADS */}
						<Link
							to={"/downloads"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
						>
							Downloads
						</Link>
						
						{/* 5. CARRINHO */}
						{isLogged && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								title="Cart"
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						
						{/* --- Botões de Ação Condicionais --- */}
						
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
								title="Admin Dashboard"
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Admin</span>
							</Link>
						)}
						
						{isLogged ? (
							<>
								{/* 6. MINHA CONTA */}
								<Link
									className='bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md font-medium
									 transition duration-300 ease-in-out flex items-center'
									to={"/profile"}
									title="My Account"
								>
									<LayoutDashboard className='inline-block mr-1' size={18} />
									<span className='hidden sm:inline'>Minha Conta</span>
								</Link>
								
								{/* LOGOUT */}
								<button
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={logout}
									title="Log Out"
								>
									<LogOut size={18} />
									<span className='hidden sm:inline ml-2'>Log Out</span>
								</button>
							</>
						) : (
							<>
								{/* 6. LOGIN */}
								<Link
									to={"/login"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
									title="Login"
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
								
								<Link
									to={"/signup"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
									title="Sign Up"
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
			{/* Drawer do Menu (Apenas Mobile) */}
			<MobileMenuDrawer
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				user={user}
				logout={logout}
			/>
		</header>
	);
};
export default Navbar;