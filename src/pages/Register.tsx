import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';
import { User, Lock, Mail, Sprout, ShoppingBag, MapPin, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

type UserRole = 'customer' | 'farmer';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [citizenshipDoc, setCitizenshipDoc] = useState('');
    const [paymentQr, setPaymentQr] = useState('');
    const [role, setRole] = useState<UserRole>('customer');

    const { register } = useAuth();
    const { t } = useLanguage();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'citizenship' | 'qr') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'citizenship') setCitizenshipDoc(reader.result as string);
                else setPaymentQr(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(name, email, role, '', password, farmLocation, citizenshipDoc, paymentQr);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.container}
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={styles.card}
                style={{ maxWidth: '550px' }}
            >
                <h2 className={styles.title}>{t.auth.registerTitle}</h2>
                <p className={styles.subtitle}>Join Nepal's most elite agriculture network.</p>

                <div className={styles.roleSelector}>
                    <div
                        className={`${styles.roleBtn} ${role === 'customer' ? styles.active : ''}`}
                        onClick={() => setRole('customer')}
                    >
                        <ShoppingBag size={24} />
                        <span>{t.auth.buyer}</span>
                    </div>
                    <div
                        className={`${styles.roleBtn} ${role === 'farmer' ? styles.active : ''}`}
                        onClick={() => setRole('farmer')}
                    >
                        <Sprout size={24} />
                        <span>{t.auth.seller}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>{t.auth.name}</label>
                        <div className={styles.inputWrapper}>
                            <User className={styles.icon} size={20} />
                            <input
                                id="register-name"
                                name="name"
                                type="text"
                                placeholder={t.auth.name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t.auth.email}</label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.icon} size={20} />
                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder={t.auth.email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t.auth.password}</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.icon} size={20} />
                            <input
                                id="register-password"
                                name="password"
                                type="password"
                                placeholder={t.auth.password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {role === 'farmer' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', overflow: 'hidden' }}
                            >
                                <div className={styles.inputGroup}>
                                    <label>{t.auth.location}</label>
                                    <div className={styles.inputWrapper}>
                                        <MapPin className={styles.icon} size={20} />
                                        <input
                                            id="register-location"
                                            name="location"
                                            type="text"
                                            placeholder={t.auth.location}
                                            value={farmLocation}
                                            onChange={(e) => setFarmLocation(e.target.value)}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.fileInputGroup}>
                                    <label className={styles.fileLabel}>
                                        <ImageIcon size={20} />
                                        <span>{citizenshipDoc ? (t.nav.home === 'Home' ? 'ID Uploaded' : 'आईडी अपलोड भयो') : (t.auth.citizenship)}</span>
                                        <input
                                            id="register-citizenship"
                                            name="citizenship"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'citizenship')}
                                            className={styles.hiddenInput}
                                            required
                                        />
                                    </label>
                                </div>

                                <div className={styles.fileInputGroup}>
                                    <label className={styles.fileLabel} style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                                        <ImageIcon size={20} />
                                        <span>{paymentQr ? (t.nav.home === 'Home' ? 'eSewa QR Registered' : 'ईसेवा QR दर्ता भयो') : (t.nav.home === 'Home' ? 'eSewa QR Code' : 'ईसेवा QR कोड')}</span>
                                        <input
                                            id="register-qr"
                                            name="paymentQr"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'qr')}
                                            className={styles.hiddenInput}
                                            required
                                        />
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={styles.button}
                    >
                        {t.auth.submitRegister}
                    </motion.button>
                </form>

                <p className={styles.footerText}>
                    {t.nav.home === 'Home' ? "Already have an account?" : "खाता पहिले नै छ?"} <Link to="/login" className={styles.link}>Login</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;
