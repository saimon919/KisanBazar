import { Shield, TrendingUp, Lock, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './TrustPillars.module.css';
import { motion } from 'framer-motion';

const TrustPillars = () => {
    const { language } = useLanguage();

    const pillars = {
        en: [
            {
                icon: Shield,
                title: "Verified Farmers",
                description: "Every farmer is verified through citizenship documentation and admin approval before listing products."
            },
            {
                icon: TrendingUp,
                title: "Price Transparency",
                description: "Real-time market rates from Kalimati, Bharatpur, and Lalitpur boards for informed decisions."
            },
            {
                icon: Lock,
                title: "Secure Platform",
                description: "Your data and transactions are protected with industry-standard security measures."
            },
            {
                icon: Users,
                title: "Direct from Farm",
                description: "Connect directly with farmers, eliminating middlemen and ensuring fair prices for all."
            }
        ],
        ne: [
            {
                icon: Shield,
                title: "प्रमाणित किसानहरू",
                description: "उत्पादन सूचीबद्ध गर्नु अघि प्रत्येक किसान नागरिकता कागजात र प्रशासक अनुमोदन मार्फत प्रमाणित हुन्छन्।"
            },
            {
                icon: TrendingUp,
                title: "मूल्य पारदर्शिता",
                description: "सूचित निर्णयहरूको लागि कालिमाटी, भरतपुर र ललितपुर बोर्डहरूबाट वास्तविक समय बजार दरहरू।"
            },
            {
                icon: Lock,
                title: "सुरक्षित प्लेटफर्म",
                description: "तपाईंको डेटा र लेनदेनहरू उद्योग-मानक सुरक्षा उपायहरूद्वारा सुरक्षित छन्।"
            },
            {
                icon: Users,
                title: "सीधा खेतबाट",
                description: "किसानहरूसँग सीधा जडान गर्नुहोस्, बिचौलियाहरू हटाउनुहोस् र सबैका लागि उचित मूल्य सुनिश्चित गर्नुहोस्।"
            }
        ]
    };

    const currentPillars = language === 'en' ? pillars.en : pillars.ne;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.title}
                >
                    {language === 'en' ? 'Why Trust KisanBazaar' : 'किसानबजारमा किन विश्वास गर्ने'}
                </motion.h2>
                <div className={styles.grid}>
                    {currentPillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={styles.pillar}
                        >
                            <div className={styles.iconWrapper}>
                                <pillar.icon size={32} className={styles.icon} />
                            </div>
                            <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                            <p className={styles.pillarDescription}>{pillar.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustPillars;
