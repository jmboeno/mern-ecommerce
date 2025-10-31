import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onCardClick, onBuyClick }) => {
    // Formatação do valor para BRL (Brasileiro Real)
    const formattedPrice = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(product.price);

    return (
        <div 
            // CORREÇÃO: bg-gray-800 com borda esmeralda sutil
            className="group bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden border border-emerald-800"
        >
            {/* 1. Imagem (Clicável para o Modal) */}
            <div 
                // Adicionado fundo cinza escuro para áreas vazias de object-contain
                className="relative cursor-pointer overflow-hidden bg-gray-900" 
                onClick={() => onCardClick(product)}
            >
                <img 
                    src={product.image} 
                    alt={product.name} 
                    // Fundo da imagem escuro e padding para object-contain
                    className="w-full h-48 object-contain group-hover:scale-105 transition duration-500 ease-in-out p-2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Ver Detalhes
                    </span>
                </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-4 flex flex-col justify-between h-auto">
                
                {/* 2. Nome (Texto branco/claro) */}
                <h3 
                    className="text-xl font-bold text-white mb-1 line-clamp-2 cursor-pointer hover:text-emerald-400 transition"
                    onClick={() => onCardClick(product)}
                >
                    {product.name}
                </h3>
                
                {/* 3. Descrição */}
                <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                    {product.description}
                </p>

                {/* Bloco de Valor e Botão */}
                <div>
                    {/* 4. Valor */}
                    <p className="text-2xl font-extrabold text-emerald-400 mb-3">
                        {formattedPrice}
                    </p>
                    
                    {/* 5. Botão de Comprar */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onBuyClick(product, 1); 
                        }}
                        className="w-full flex items-center justify-center bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300 shadow-md hover:shadow-lg"
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;