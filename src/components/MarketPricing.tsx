import styles from './MarketPricing.module.css';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MarketPricing = () => {
    const { language } = useLanguage();

    // Mock data based on wholesale markets in Nepal
    // This structure is ready for future API integration (Kalimati Board etc.)
    const pricingData = [
        { crop: 'Tomato (Local)', market: 'Kalimati', price: 65, trend: 'up' },
        { crop: 'Potato (Red)', market: 'Bharatpur', price: 42, trend: 'down' },
        { crop: 'Onion (Dry)', market: 'Lalitpur', price: 85, trend: 'stable' },
        { crop: 'Cauliflower', market: 'Kalimati', price: 55, trend: 'up' },
    ];

    const translations = {
        en: {
            title: "Today's Market Rates",
            subtitle: "Wholesale reference prices from regional boards",
            crop: "Crop Name",
            market: "Market",
            price: "Price",
            updated: "Last updated: 1 hour ago",
            liteNote: "Prices are indicative for transparency."
        },
        ne: {
            title: "आजको बजार भाउ",
            subtitle: "क्षेत्रीय बोर्डहरूबाट थोक सन्दर्भ मूल्यहरू",
            crop: "बालीको नाम",
            market: "बजार",
            price: "मूल्य",
            updated: "अन्तिम अपडेट: १ घण्टा अघि",
            liteNote: "पारदर्शिताका लागि मूल्यहरू सांकेतिक हुन्।"
        }
    };

    const t = language === 'en' ? translations.en : translations.ne;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <TrendingUp className={styles.titleIcon} size={28} />
                    <div>
                        <h2 className={styles.title}>{t.title}</h2>
                        <p className={styles.subtitle}>{t.subtitle}</p>
                    </div>
                </div>
                <div className={styles.timestamp}>
                    <Clock size={16} />
                    <span>{t.updated}</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t.crop}</th>
                            <th>{t.market}</th>
                            <th className={styles.priceHeader}>{t.price} (Rs/kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pricingData.map((item, idx) => (
                            <motion.tr
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <td className={styles.cropCell}>{item.crop}</td>
                                <td className={styles.marketCell}>
                                    <MapPin size={14} />
                                    {item.market}
                                </td>
                                <td className={styles.priceCell}>
                                    <span className={styles.currency}>Rs.</span>
                                    <span className={styles.value}>{item.price}</span>
                                    <span className={`${styles.trend} ${styles[item.trend]}`}>
                                        {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '•'}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className={styles.liteNote}>* {t.liteNote}</p>
        </section>
    );
};

export default MarketPricing;
