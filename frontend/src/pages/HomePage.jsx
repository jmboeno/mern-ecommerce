// mern-ecommerce/frontend/src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import BannerCarousel from "../components/BannerCarousel";
import CategoryProductSection from "../components/CategoryProductSection";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductModal from "../components/ProductModal";
import { toast } from "react-hot-toast";


const HomePage = () => {
	const { fetchAllProducts, products, loading } = useProductStore();
    const { addToCart } = useCartStore(); 
	const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
        toast.success(`Adicionado ${quantity}x de "${product.name}" ao carrinho!`);
    };

	useEffect(() => {
		fetchAllProducts();
		
		const fetchCategories = async () => {
			try {
				const response = await axios.get("/categories");
				setCategories(response.data);
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			}
		};
		fetchCategories();

	}, [fetchAllProducts]);
    
    const getProductsByCategory = (categoryName) => {
        return products.filter(p => p.category === categoryName);
    };


	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
            
            {/* 1. BANNER CAROUSEL - Fora do contêiner centralizado */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <BannerCarousel />
            </motion.div>
            
            {/* 2. CONTEÚDO RESTANTE (Centralizado) */}
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                
                <h1 className="text-center text-4xl font-bold text-gray-300 mb-12 mt-16">
                    Explore nossos Produtos por Categoria
                </h1>

                {/* SEÇÕES DE PRODUTOS POR CATEGORIA */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-16">
                        {categories.map(category => (
                            <CategoryProductSection
                                key={category._id}
                                title={`${category.name.charAt(0).toUpperCase() + category.name.slice(1)} Recargas`}
                                categoryName={category.name}
                                products={getProductsByCategory(category.name)}
                                onCardClick={setSelectedProduct} 
                                onBuyClick={handleAddToCart}
                            />
                        ))}
                        
                        {categories.length === 0 && (
                             <div className="text-center py-20 text-gray-400">
                                <p className="text-xl">No categories found. Please add categories via the Admin Dashboard.</p>
                            </div>
                        )}
                    </div>
                )}
			</div>
            
            {/* Modal de Detalhes do Produto */}
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)} 
                    onAddToCart={handleAddToCart}
                />
            )}
		</div>
	);
};
export default HomePage;