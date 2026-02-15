import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, RefreshCw, MapPin, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './LiveMarketRates.module.css';

interface MarketRate {
    id: number;
    product_name: string;
    product_name_ne: string;
    category: string;
    district: string;
    province: string;
    min_price: number;
    max_price: number;
    avg_price: number;
    unit: string;
    last_updated: string;
}

const LiveMarketRates = () => {
    const { language } = useLanguage();
    const [rates, setRates] = useState<MarketRate[]>([]);
    const [filteredRates, setFilteredRates] = useState<MarketRate[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const content = {
        en: {
            title: "Live Market Rates",
            subtitle: "Real-time prices across all districts of Nepal",
            search: "Search products...",
            category: "Category",
            district: "District",
            all: "All",
            vegetables: "Vegetables",
            fruits: "Fruits",
            grains: "Grains",
            product: "Product",
            location: "Location",
            minPrice: "Min Price",
            maxPrice: "Max Price",
            avgPrice: "Avg Price",
            unit: "Unit",
            lastUpdated: "Last Updated",
            refresh: "Refresh",
            noResults: "No products found",
            loading: "Loading market rates..."
        },
        ne: {
            title: "प्रत्यक्ष बजार मूल्य",
            subtitle: "नेपालका सबै जिल्लाहरूमा वास्तविक समय मूल्य",
            search: "उत्पादन खोज्नुहोस्...",
            category: "श्रेणी",
            district: "जिल्ला",
            all: "सबै",
            vegetables: "तरकारी",
            fruits: "फलफूल",
            grains: "अन्न",
            product: "उत्पादन",
            location: "स्थान",
            minPrice: "न्यूनतम मूल्य",
            maxPrice: "अधिकतम मूल्य",
            avgPrice: "औसत मूल्य",
            unit: "इकाई",
            lastUpdated: "अन्तिम अद्यावधिक",
            refresh: "ताजा गर्नुहोस्",
            noResults: "कुनै उत्पादन फेला परेन",
            loading: "बजार मूल्य लोड गर्दै..."
        }
    };

    const t = language === 'en' ? content.en : content.ne;

    // Nepal districts grouped by province
    const nepalDistricts = {
        'Koshi': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'],
        'Madhesh': ['Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'],
        'Bagmati': ['Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'],
        'Gandaki': ['Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Tanahun'],
        'Lumbini': ['Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Palpa', 'Parasi', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'],
        'Karnali': ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Rukum West', 'Salyan', 'Surkhet'],
        'Sudurpashchim': ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur']
    };

    const fetchMarketRates = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'all') params.append('category', selectedCategory);
            if (selectedDistrict !== 'all') params.append('district', selectedDistrict);

            const response = await fetch(`/api/market-rates?${params}`);
            const data = await response.json();
            setRates(data);
            setFilteredRates(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching market rates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketRates();
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchMarketRates, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [selectedCategory, selectedDistrict]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredRates(rates);
        } else {
            const filtered = rates.filter(rate =>
                rate.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rate.product_name_ne.includes(searchQuery)
            );
            setFilteredRates(filtered);
        }
    }, [searchQuery, rates]);

    return (
        <div className={styles.page}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.container}
            >
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>{t.title}</h1>
                    <p className={styles.subtitle}>{t.subtitle}</p>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    {/* Search */}
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={20} />
                        <label htmlFor="market-search" className="sr-only">{t.search}</label>
                        <input
                            id="market-search"
                            name="market-search"
                            type="text"
                            placeholder={t.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className={styles.filterGroup}>
                        <Filter size={18} />
                        <select
                            id="category-filter"
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="all">{t.all} {t.category}</option>
                            <option value="vegetable">{t.vegetables}</option>
                            <option value="fruit">{t.fruits}</option>
                            <option value="grain">{t.grains}</option>
                        </select>
                    </div>

                    {/* District Filter */}
                    <div className={styles.filterGroup}>
                        <MapPin size={18} />
                        <select
                            id="district-filter"
                            name="district"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className={styles.select}
                        >
                            <option value="all">{t.all} {t.district}</option>
                            {Object.entries(nepalDistricts).map(([province, districts]) => (
                                <optgroup key={province} label={province}>
                                    {districts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Refresh Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchMarketRates}
                        className={styles.refreshBtn}
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={loading ? styles.spinning : ''} />
                        {t.refresh}
                    </motion.button>
                </div>

                {/* Last Updated */}
                <div className={styles.lastUpdated}>
                    {t.lastUpdated}: {lastUpdated.toLocaleString(language === 'en' ? 'en-US' : 'ne-NP')}
                </div>

                {/* Market Rates Table */}
                {loading ? (
                    <div className={styles.loading}>{t.loading}</div>
                ) : filteredRates.length === 0 ? (
                    <div className={styles.noResults}>{t.noResults}</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t.product}</th>
                                    <th>{t.location}</th>
                                    <th>{t.minPrice}</th>
                                    <th>{t.avgPrice}</th>
                                    <th>{t.maxPrice}</th>
                                    <th>{t.unit}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRates.map((rate, index) => (
                                    <motion.tr
                                        key={rate.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td>
                                            <div className={styles.productName}>
                                                {language === 'en' ? rate.product_name : rate.product_name_ne}
                                                <span className={styles.category}>
                                                    {rate.category}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.location}>
                                                <MapPin size={14} />
                                                {rate.district}, {rate.province}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.price}>
                                                <TrendingDown size={14} className={styles.minIcon} />
                                                रू {rate.min_price}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.price}>
                                                <span className={styles.avgPrice}>रू {rate.avg_price}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.price}>
                                                <TrendingUp size={14} className={styles.maxIcon} />
                                                रू {rate.max_price}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.unitText}>{rate.unit}</div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default LiveMarketRates;
