// mern-ecommerce/frontend/src/pages/DownloadsPage.jsx
import { motion } from "framer-motion";
import { Download, Monitor, Smartphone, Tablet } from "lucide-react";

const downloadItems = [
	{ name: "Main Client App (Windows)", description: "Download the primary application for Windows desktop users.", icon: Monitor, link: "#" },
	{ name: "Main Client App (Android TV)", description: "Optimized APK for Android Boxes and Smart TVs.", icon: Tablet, link: "#" },
	{ name: "Mobile Viewer (Android)", description: "Mobile-friendly APK for Android phones and tablets.", icon: Smartphone, link: "#" },
];

const DownloadsPage = () => {
	return (
		<div className='relative z-10 container mx-auto px-4 py-16 min-h-screen'>
			<motion.h1
				className='text-4xl font-bold mb-4 text-emerald-400 text-center'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				Download Applications
			</motion.h1>
			
			<p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
				Get the latest version of our required client applications for various platforms.
			</p>

			<div className="max-w-3xl mx-auto space-y-6">
				{downloadItems.map((item, index) => (
					<motion.div
						key={item.name}
						className="bg-gray-800 p-6 rounded-lg shadow-xl flex items-center justify-between border-l-4 border-emerald-500"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
					>
						<div className="flex items-center gap-4">
							<item.icon className="w-8 h-8 text-emerald-400 flex-shrink-0" />
							<div>
								<h3 className="text-xl font-semibold text-white">{item.name}</h3>
								<p className="text-gray-400 text-sm">{item.description}</p>
							</div>
						</div>
						<a 
							href={item.link} 
							target="_blank" 
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
						>
							<Download className="w-5 h-5" />
							Download
						</a>
					</motion.div>
				))}
			</div>
			
			<p className="text-center text-gray-500 mt-12 text-sm">
				If you encounter any issues during installation, please contact support.
			</p>
		</div>
	);
};
export default DownloadsPage;