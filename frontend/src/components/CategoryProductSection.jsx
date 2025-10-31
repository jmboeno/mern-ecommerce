// mern-ecommerce/frontend/src/components/CategoryProductSection.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// --- NOVO: Adiciona onCardClick e onBuyClick nas props ---
const CategoryProductSection = ({ title, categoryName, products = [], onCardClick, onBuyClick }) => {
    const displayProducts = products.slice(0, 4); 

    if (displayProducts.length === 0) {
        return null; 
    }

    return (
        <motion.section 
            className="py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-3">
                <h2 className="text-3xl font-bold text-white">
                    {title}
                </h2>
                <Link 
                    to={`/category/${categoryName}`}
                    className="text-emerald-400 hover:text-emerald-300 transition duration-300 font-medium text-lg"
                >
                    View All &rarr;
                </Link>
            </div>

            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
            >
                {displayProducts.map(product => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        // --- NOVO: Passando as props para o ProductCard ---
                        onCardClick={onCardClick}
                        onBuyClick={onBuyClick}
                        // ------------------------------------------------
                    />
                ))}
            </motion.div>
        </motion.section>
    );
};

export default CategoryProductSection;