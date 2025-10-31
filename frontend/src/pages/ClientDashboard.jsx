// mern-ecommerce/frontend/src/pages/ClientDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListOrdered, UserCircle, ListChecks } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import MyOrdersTab from "../components/MyOrdersTab";
import ProfileSettingsTab from "../components/ProfileSettingsTab";
import MyCodesTab from "../components/MyCodesTab";

const tabs = [
	{ id: "orders", label: "My Orders", icon: ListOrdered },
	{ id: "codes", label: "My Codes", icon: ListChecks },
	{ id: "profile", label: "Profile Settings", icon: UserCircle },
];

const ClientDashboard = ({ initialTab }) => {
	const { user } = useUserStore();
	// Define a aba inicial como orders
	const [activeTab, setActiveTab] = useState(initialTab && tabs.some(t => t.id === initialTab) ? initialTab : "orders");

	useEffect(() => {
		if (initialTab && tabs.some(t => t.id === initialTab)) {
			setActiveTab(initialTab);
		}
	}, [initialTab]);
	
	// Função auxiliar para renderizar o componente ativo
	const renderActiveComponent = () => {
		switch (activeTab) {
			case "orders": return <MyOrdersTab />;
			case "codes": return <MyCodesTab />; // NOVO CASO
			case "profile": return <ProfileSettingsTab />;
			default: return null;
		}
	};
	
	if (!user) return null;
	
	if (!user) return null;

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-2 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Welcome, {user.name.split(' ')[0]}
				</motion.h1>
				<p className="text-center text-gray-400 mb-8">Manage your account and view your order history.</p>

				{/* --- LAYOUT SIDEBAR / CONTENT (Layout de duas colunas) --- */}
				{/* min-h-calc força a altura mínima para esticar o contentor */}
				<div className="flex flex-col lg:flex-row gap-6 lg:min-h-[calc(100vh-14rem)]">
					
					{/* Navegação Sidebar */}
					<nav className="w-full lg:w-60 flex-shrink-0 bg-gray-800 rounded-lg p-3 shadow-xl lg:h-full">
						<h3 className="text-lg font-semibold text-gray-300 mb-4 px-3 hidden lg:block">Navigation</h3>
						{/* Flex-wrap para mobile, flex-col para desktop */}
						<div className="flex flex-wrap lg:flex-col gap-2 justify-center">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
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
export default ClientDashboard;