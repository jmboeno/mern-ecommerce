import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
    }, [product]);

    if (!product) return null;

    const formattedPrice = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(product.price);
    
    const formattedTotalPrice = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(product.price * quantity);

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        onClose(); 
    };

    return (
        // Overlay (fundo escuro - inalterado)
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300"
            onClick={onClose} 
        >
            {/* Modal Content - CORREÇÃO: bg-gray-800 */}
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header e Botão Fechar */}
                <div className="flex justify-between items-start p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                    <h2 className="text-3xl font-extrabold text-emerald-400">{product.name}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition p-1"
                        aria-label="Fechar"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Corpo do Modal (Conteúdo e Imagem) */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Imagem */}
                        <div className="md:w-1/3 bg-gray-900 rounded-lg p-2 flex items-center justify-center">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-auto object-contain max-h-56 rounded-lg shadow-md"
                            />
                        </div>

                        {/* Detalhes */}
                        <div className="md:w-2/3">
                            {/* Descrição */}
                            <p className="text-gray-300 mb-4">{product.description}</p>
                            
                            {/* Valor Unitário */}
                            <p className="text-xl font-bold text-white mb-3">
                                Preço Unitário: <span className="text-emerald-400">{formattedPrice}</span>
                            </p>
                            
                            {/* Seletor de Quantidade */}
                            <div className="flex items-center space-x-4 mb-6">
                                <label className="text-lg font-semibold text-white">Quantidade:</label>
                                <div className="flex items-center border border-gray-600 rounded-lg bg-gray-700">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-3 text-gray-300 hover:bg-gray-600 rounded-l-lg transition disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg border-x border-gray-600 text-white py-2">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-3 text-gray-300 hover:bg-gray-600 rounded-r-lg transition"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Valor Total */}
                            <div className="mt-4 border-t border-gray-700 pt-4">
                                <p className="text-xl font-bold text-white">
                                    Total: <span className="text-3xl text-red-400 font-extrabold">{formattedTotalPrice}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Botão Adicionar ao Carrinho */}
                <div className="p-6 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 transition duration-300 shadow-xl"
                    >
                        <ShoppingCart className="w-6 h-6 mr-2" />
                        Adicionar ao Carrinho ({quantity})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;