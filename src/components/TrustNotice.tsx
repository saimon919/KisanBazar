import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './TrustNotice.module.css';
import { motion } from 'framer-motion';

const TrustNotice = () => {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.trustBanner}
        >
            <div className={styles.iconWrapper}>
                <ShieldCheck size={20} className={styles.icon} />
            </div>
            <div className={styles.content}>
                <strong>{t.trust.p2pTitle}:</strong> {t.trust.p2pNotice}
            </div>
        </motion.div>
    );
};

export default TrustNotice;
