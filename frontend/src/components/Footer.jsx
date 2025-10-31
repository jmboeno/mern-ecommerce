// mern-ecommerce/frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='bg-gray-800 border-t border-emerald-800 mt-16'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8'>
					
					{/* Coluna 1: Informação da Empresa */}
					<div className="col-span-2 lg:col-span-2">
						<h3 className='text-2xl font-bold text-emerald-400 mb-4'>E-Commerce</h3>
						<p className='text-gray-400 text-sm'>
							Seu fornecedor confiável de recargas digitais e códigos de serviço. Velocidade e segurança na entrega.
						</p>
						<div className="flex space-x-4 mt-6">
							<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
								<Facebook size={20} />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
								<Instagram size={20} />
							</a>
						</div>
					</div>

					{/* Coluna 2: Navegação Rápida */}
					<div>
						<h4 className='text-lg font-semibold text-white mb-4'>Quick Links</h4>
						<ul className='space-y-3 text-sm'>
							<li><Link to="/" className='text-gray-400 hover:text-emerald-400 transition-colors'>Home</Link></li>
							<li><Link to="/shop" className='text-gray-400 hover:text-emerald-400 transition-colors'>Loja (Recargas)</Link></li>
							<li><Link to="/downloads" className='text-gray-400 hover:text-emerald-400 transition-colors'>Downloads</Link></li>
							<li><Link to="/profile" className='text-gray-400 hover:text-emerald-400 transition-colors'>Minha Conta</Link></li>
						</ul>
					</div>

					{/* Coluna 3: Ajuda e Suporte */}
					<div>
						<h4 className='text-lg font-semibold text-white mb-4'>Ajuda</h4>
						<ul className='space-y-3 text-sm'>
							<li><Link to="#" className='text-gray-400 hover:text-emerald-400 transition-colors'>Fale Conosco</Link></li>
							<li><Link to="#" className='text-gray-400 hover:text-emerald-400 transition-colors'>FAQ</Link></li>
							<li><Link to="#" className='text-gray-400 hover:text-emerald-400 transition-colors'>Termos de Serviço</Link></li>
							<li><Link to="#" className='text-gray-400 hover:text-emerald-400 transition-colors'>Política de Privacidade</Link></li>
						</ul>
					</div>

					{/* Coluna 4: Contato */}
					<div className="col-span-2 md:col-span-1">
						<h4 className='text-lg font-semibold text-white mb-4'>Contato</h4>
						<ul className='space-y-3 text-sm'>
							<li className="flex items-start gap-2 text-gray-400">
								<Mail size={16} className="mt-1 flex-shrink-0" />
								<span>suporte@ecommerce.com</span>
							</li>
							<li className="flex items-start gap-2 text-gray-400">
								<Phone size={16} className="mt-1 flex-shrink-0" />
								<span>(51) 98765-4321</span>
							</li>
							<li className="flex items-start gap-2 text-gray-400">
								<MapPin size={16} className="mt-1 flex-shrink-0" />
								<span>Av. Principal, 123 - Centro</span>
							</li>
						</ul>
					</div>
				</div>
				
				{/* Seção de Direitos Autorais */}
				<div className='mt-12 border-t border-gray-700 pt-8 text-center'>
					<p className='text-sm text-gray-500'>
						&copy; {currentYear} E-Commerce. All rights reserved. Design and Code by [Your Name].
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;