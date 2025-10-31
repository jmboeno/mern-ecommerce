import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore"; 
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";

const ShopPage = () => {
    // Stores
    const { products, fetchAllProducts, loading } = useProductStore();
    const { addToCart } = useCartStore(); 

    // Estado local para busca e modal
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // Estado para o modal

    // 1. Carregar produtos
    useEffect(() => {
        if (products.length === 0) {
            fetchAllProducts();
        }
    }, [fetchAllProducts, products.length]);

    // 2. Lógica de Filtragem (Busca)
    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = products.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearch) ||
            product.description.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);
    
    // 3. Função de Adicionar ao Carrinho (Utiliza a store real)
    const handleAddToCart = (product, quantity) => {
        // CORREÇÃO: Usamos product._id para obter apenas o ID necessário.
        addToCart(product._id, quantity);
        toast.success(`Adicionado ${quantity}x de "${product.name}" ao carrinho!`);
    };

    if (loading) return <LoadingSpinner />;


    return (
        <div className='relative z-10 container mx-auto px-4 py-16'>
            <motion.h1
                className='text-4xl font-bold mb-4 text-emerald-400 text-center'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Todos os Produtos
            </motion.h1>
            
            <p className="text-center text-gray-400 mb-8 max-w-xl mx-auto">Encontre a recarga perfeita usando a pesquisa rápida abaixo.</p>

            {/* Quick Search Bar */}
            <motion.div
                className="max-w-lg mx-auto mb-10 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Pesquisar recargas ou serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition duration-150"
                />
            </motion.div>

            {/* Product Grid */}
            <motion.div 
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            onCardClick={setSelectedProduct} // Abre o modal
                            onBuyClick={handleAddToCart}     // Botão de compra rápida (adiciona 1)
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        <p className="text-xl">Nenhum produto encontrado para "{searchTerm}".</p>
                    </div>
                )}
            </motion.div>
            
            {/* Modal de Detalhes do Produto */}
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)} // Fecha o modal
                    onAddToCart={handleAddToCart}           // Adiciona com quantidade selecionada
                />
            )}
        </div>
    );
};
export default ShopPage;