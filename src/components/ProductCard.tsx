import { useCart } from '../context/CartContext';
import type { Product } from '../context/ProductContext';
import { ShoppingCart, CheckCircle, Clock, Truck, AlertTriangle } from 'lucide-react';
import styles from './ProductCard.module.css';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { t, language } = useLanguage();

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = `https://placehold.co/400x300/e8f5e9/2e7d32?text=${product.name.replace(/\s+/g, '+')}`;
    };

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 300 };

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

    // Internal Parallax: Image moves opposite to tilt
    const imgX = useSpring(useTransform(x, [-0.5, 0.5], [10, -10]), springConfig);
    const imgY = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
    const imgScale = useSpring(useTransform(y, [-0.5, 0.5], [1.1, 1.15]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            layout
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={styles.card}
        >
            <div className={styles.imageContainer}>
                <motion.img
                    layoutId={`product-image-${product.id}`}
                    src={product.image}
                    alt={product.name}
                    className={styles.image}
                    onError={handleImageError}
                    loading="lazy"
                    style={{
                        transform: "translateZ(50px)",
                        x: imgX,
                        y: imgY,
                        scale: imgScale
                    }}
                    transition={{ duration: 0.2 }}
                />
                <span className={styles.badge}>{t.marketplace.categories[product.category.toLowerCase() as keyof typeof t.marketplace.categories] || product.category}</span>
            </div>
            <div className={styles.content} style={{ transform: "translateZ(30px)" }}>
                <div className={styles.header}>
                    <span className={styles.category}>{product.category}</span>
                    <h3 className={styles.name}>{product.name}</h3>
                </div>

                <div className={styles.farmerInfo}>
                    <span>{t.product.by} {product.farmer}</span>
                    {product.isVerified && (
                        <span
                            className={styles.verifiedBadge}
                            title={language === 'en'
                                ? "Verified Farmer - Citizenship verified by admin"
                                : "प्रमाणित किसान - प्रशासकद्वारा नागरिकता प्रमाणित"}
                        >
                            <CheckCircle size={16} fill="var(--color-primary)" color="white" />
                            <span className={styles.verifiedText}>
                                {language === 'en' ? 'Verified' : 'प्रमाणित'}
                            </span>
                        </span>
                    )}
                </div>

                {/* Freshness & Logistics Transparency */}
                <div className={styles.transparencyLayer}>
                    {product.harvestDate && (
                        <div className={`${styles.infoBit} ${(new Date().getTime() - new Date(product.harvestDate).getTime()) / (1000 * 3600 * 24) > 5
                            ? styles.warning : ''
                            }`}>
                            <Clock size={14} />
                            <span>
                                {Math.floor((new Date().getTime() - new Date(product.harvestDate).getTime()) / (1000 * 3600 * 24))} {language === 'en' ? 'days ago' : 'दिन अघि'}
                                {(new Date().getTime() - new Date(product.harvestDate).getTime()) / (1000 * 3600 * 24) > 5 && (
                                    <AlertTriangle size={12} className={styles.warningIcon} />
                                )}
                            </span>
                        </div>
                    )}
                    <div className={styles.infoBit}>
                        <Truck size={14} />
                        <span>Rs. 45 {language === 'en' ? 'Delivery' : 'ढुवानी'}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.price}>
                        <div className={styles.mainPrice}>
                            <span className={styles.amount}>
                                {language === 'en' ? 'Rs.' : 'रू'} {product.price}
                            </span>
                            <span className={styles.unit}>
                                /{product.unit === 'kg' ? (language === 'en' ? 'kg' : 'केजी') : product.unit}
                            </span>
                        </div>
                        <div className={styles.deliveryNote}>
                            {language === 'en' ? 'Arrives within 24h' : '२४ घण्टा भित्र आइपुग्छ'}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={styles.cartBtn}
                        onClick={() => addToCart(product)}
                        title={t.product.addToCart}
                    >
                        <ShoppingCart size={20} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
