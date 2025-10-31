// mern-ecommerce/frontend/src/components/MyCodesTab.jsx
import { motion } from "framer-motion";
import { ListChecks, AlertTriangle } from "lucide-react";

// NOTA: A lógica para buscar códigos (licenças) não está implementada no backend.
// Este componente serve como um placeholder de layout.

const MyCodesTab = () => {
	// Aqui você faria a lógica para buscar os códigos/licenças do usuário.
	// const [codes, setCodes] = useState([]);
	// useEffect(() => { /* fetch logic */ }, []);
	
	// Simulação de dados:
	const codes = [
		{ id: 1, name: "TV Express - Recarga Mensal", code: "AX5R-B2H9-C4W6-T3J8", status: "Active" },
		{ id: 2, name: "BTV Box - Licença Anual", code: "Z1K9-M8P7-N6L5-Q4F3", status: "Used" },
	];
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className='mx-auto space-y-6'
		>
			<div className='bg-gray-800 rounded-lg shadow-xl p-6'>
				<h3 className="text-2xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
					<ListChecks className="w-6 h-6"/> Your Activation Codes
				</h3>
				
				{codes.length === 0 ? (
					<div className="text-center py-8 text-gray-400">
						<AlertTriangle className="w-10 h-10 mx-auto mb-3 text-yellow-500"/>
						<p>No activation codes found yet.</p>
					</div>
				) : (
					<div className="space-y-4">
						{codes.map(codeItem => (
							<div key={codeItem.id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center border-l-4 border-emerald-500">
								<div>
									<p className="text-lg font-medium text-white">{codeItem.name}</p>
									<p className="text-sm text-gray-300 select-all font-mono mt-1">{codeItem.code}</p>
								</div>
								<span className={`px-3 py-1 text-xs font-semibold rounded-full ${
									codeItem.status === "Active" ? "bg-green-500 text-gray-900" : "bg-red-500 text-white"
								}`}>
									{codeItem.status}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
};
export default MyCodesTab;