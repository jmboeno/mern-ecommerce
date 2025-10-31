// mern-ecommerce/frontend/src/pages/AdminPage.jsx
import { BarChart, ShoppingBag, Gift, Shirt, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import OrdersList from "../components/OrdersList";
import CouponManager from "../components/CouponManager";
import ProductManager from "../components/ProductManager";
import CategoryManager from "../components/CategoryManager";
import UserManager from "../components/UserManager";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "analytics", label: "Analytics", icon: BarChart },
	{ id: "users", label: "Users", icon: Users },
	{ id: "categories", label: "Categories", icon: Tag },
	{ id: "products", label: "Products", icon: Shirt },
	{ id: "orders", label: "Orders", icon: ShoppingBag },
	{ id: "coupons", label: "Coupons", icon: Gift },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("analytics");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);
	
	// Função auxiliar para renderizar o componente ativo
	const renderActiveComponent = () => {
		switch (activeTab) {
			case "analytics": return <AnalyticsTab />;
			case "users": return <UserManager />;
			case "products": return <ProductManager />;
			case "categories": return <CategoryManager />;
			case "orders": return <OrdersList />;
			case "coupons": return <CouponManager />;
			default: return null;
		}
	};

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				{/* --- LAYOUT SIDEBAR / CONTENT --- */}
				{/* Adicionado lg:min-h-[calc(100vh-14rem)] para forçar o contentor flexível a ter uma altura mínima que preencha a tela abaixo do cabeçalho. */}
				<div className="flex flex-col lg:flex-row gap-6 lg:min-h-[calc(100vh-14rem)]">
					
					{/* Navegação Sidebar. Adicionado lg:h-full para preencher a altura mínima/máxima do contentor flexível. */}
					<nav className="w-full lg:w-60 flex-shrink-0 bg-gray-800 rounded-lg p-3 shadow-xl lg:h-full">
						<h3 className="text-lg font-semibold text-gray-300 mb-4 px-3 hidden lg:block">Navigation</h3>
						{/* Flex-wrap para mobile, flex-col para desktop */}
						<div className="flex flex-wrap lg:flex-col gap-2 justify-center">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									// w-full garante que o botão ocupe a largura total da sidebar no desktop
									className={`flex items-center w-full px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium whitespace-nowrap justify-center lg:justify-start
										${
											activeTab === tab.id
												? "bg-emerald-600 text-white shadow-md"
												: "text-gray-300 hover:bg-gray-700 bg-gray-700 lg:bg-transparent"
										}`
									}
								>
									<tab.icon className='mr-2 h-5 w-5' />
									{tab.label}
								</button>
							))}
						</div>
					</nav>

					{/* Área de Conteúdo Principal */}
					<div className="flex-grow w-full">
						<motion.div
							key={activeTab} // Key para permitir a animação de transição entre abas
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							{renderActiveComponent()}
						</motion.div>
					</div>

				</div>
				{/* --- FIM DO LAYOUT --- */}
			</div>
		</div>
	);
};
export default AdminPage;