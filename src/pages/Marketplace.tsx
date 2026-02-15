import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Search, Sparkles } from 'lucide-react';
import WeatherAlert from '../components/WeatherAlert';
import styles from './Marketplace.module.css';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = () => {
    const { products } = useProducts();
    const { t, language } = useLanguage();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Mock buyer location (Kathmandu)
    const buyerLoc = { lat: 27.7172, lng: 85.3240 };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const categories = ['All', 'Vegetable', 'Fruit', 'Grain'];

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'nearest' && a.latitude && b.latitude) {
                const distA = calculateDistance(buyerLoc.lat, buyerLoc.lng, a.latitude, a.longitude || 0);
                const distB = calculateDistance(buyerLoc.lat, buyerLoc.lng, b.latitude, b.longitude || 0);
                return distA - distB;
            }
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'newest') return -1;
            return 0;
        });


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.container}
        >
            <WeatherAlert />

            <header className={styles.header}>
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.title}
                >
                    {t.marketplace.title}
                </motion.h2>

                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            id="marketplace-search"
                            name="marketplace-search"
                            type="text"
                            placeholder={t.marketplace.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <div className={styles.categories}>
                            {categories.map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
                                >
                                    {t.marketplace.categories[cat.toLowerCase() as keyof typeof t.marketplace.categories] || cat}
                                </motion.button>
                            ))}
                        </div>

                        <select
                            id="marketplace-sort"
                            name="sort"
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">{language === 'en' ? 'Newest Arrival' : 'नयाँ उत्पादन'}</option>
                            <option value="nearest">{language === 'en' ? 'Nearest First' : 'नजिकको किसान'}</option>
                            <option value="price-low">{language === 'en' ? 'Lowest Price' : 'सस्तो मूल्य'}</option>
                        </select>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="popLayout">
                {searchTerm === '' && selectedCategory === 'All' && (
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={styles.suggestions}
                    >
                        <div className={styles.aiBadge}>
                            <Sparkles size={16} />
                            {t.marketplace.newArrivals}
                        </div>
                        <div className={styles.grid}>
                            {[...products].reverse().slice(0, 3).map(product => (
                                <ProductCard key={`suggest-${product.id}`} product={product} />
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <motion.div
                layout
                className={styles.grid}
            >
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className={styles.noResults}>
                        <p>{t.marketplace.noResults}</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Marketplace;
