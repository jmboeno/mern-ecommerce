// mern-ecommerce/frontend/src/components/BannerCarousel.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dados de banners (Mantenha o caminho na pasta public)
const bannerData = [
	{
		id: 1,
		image: '/banner1.jpg', 
		title: 'Recargas Imediatas. Entrega Digital.',
		subtitle: 'Obtenha seus códigos de licença em segundos. Sem espera, sem complicações.',
		cta: 'Ver Recargas',
		link: '/shop',
	},
	{
		id: 2,
		image: '/banner2.jpg', 
		title: 'Descontos Exclusivos na Loja.',
		subtitle: 'Aproveite ofertas especiais em licenças e planos de longa duração.',
		cta: 'Descobrir Ofertas',
		link: '/shop',
	},
	{
		id: 3,
		image: '/banner3.jpg', 
		title: 'Suporte 24/7. Seu Serviço, Ativo.',
		subtitle: 'Nossa equipa está pronta para ajudar com qualquer dúvida sobre ativação.',
		cta: 'Falar com Suporte',
		link: '#', 
	},
];

const BannerCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + bannerData.length) % bannerData.length);
	};

	// Auto-play
	useEffect(() => {
		const interval = setInterval(nextSlide, 8000); 
		return () => clearInterval(interval);
	}, []);

	const currentBanner = bannerData[currentIndex];

	return (
		// Ocupa 100% da altura da viewport e largura total
		<div className="relative w-full h-screen overflow-hidden"> 
			<AnimatePresence initial={false} mode="wait">
				<motion.div
					key={currentBanner.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.8 }}
					className="absolute inset-0"
				>
					{/* Imagem de Fundo e Overlay */}
					<img
						src={currentBanner.image}
						alt={currentBanner.title}
						className="w-full h-full object-cover"
						loading="eager"
					/>
					<div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-[1px]"></div>

					{/* Contêiner de Alinhamento (max-w-7xl mx-auto) */}
					<div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						
						{/* Wrapper para centralizar verticalmente */}
						<div className="relative w-full h-full flex justify-center items-center">
							
							{/* Bloco de Texto e CTA */}
							<motion.div
								// CORREÇÃO 1: Adicionar mx-auto e mudar para text-center
								// mx-auto centraliza o bloco na largura, text-center centraliza o texto dentro do bloco
								className="max-w-xl text-center mx-auto mt-20" 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								<motion.h2
									initial={{ y: -50, opacity: 0 }} // Mudança da animação X para Y para melhor efeito em centralização
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.6 }}
									className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
								>
									{currentBanner.title}
								</motion.h2>
								<motion.p
									initial={{ y: -50, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.4, duration: 0.6 }}
									className="mt-4 text-lg sm:text-xl text-emerald-200"
								>
									{currentBanner.subtitle}
								</motion.p>
								{/* O CTA (a) agora herda o alinhamento central devido a text-center na div pai */}
								<motion.a
									href={currentBanner.link}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.6, duration: 0.6 }}
									className="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-gray-900 bg-emerald-400 hover:bg-emerald-300 transition-colors duration-300 transform hover:scale-[1.03]"
								>
									{currentBanner.cta}
									<ChevronRight className="w-5 h-5 ml-2" />
								</motion.a>
							</motion.div>
						</div>
						
					</div>
				</motion.div>
			</AnimatePresence>
			

			{/* --- BOTÕES DE NAVEGAÇÃO NA LARGURA TOTAL DA TELA --- */}
			{/* O posicionamento é feito em relação à div 'relative w-full h-screen' */}
			<button 
				onClick={prevSlide}
				className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full z-20 transition-colors"
				aria-label="Previous slide"
			>
				<ChevronLeft size={24} />
			</button>
			<button 
				onClick={nextSlide}
				className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full z-20 transition-colors"
				aria-label="Next slide"
			>
				<ChevronRight size={24} />
			</button>
			{/* --------------------------------------------------- */}
			

			{/* Indicadores de Paginação */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
				{bannerData.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentIndex(index)}
						className={`h-2 rounded-full transition-all duration-300 ${
							index === currentIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-gray-300 bg-opacity-50 hover:bg-opacity-75'
						}`}
						aria-label="Go to slide"
					/>
				))}
			</div>
		</div>
	);
};

export default BannerCarousel;