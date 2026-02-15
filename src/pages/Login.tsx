import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, 'customer', password);
        navigate('/');
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
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={styles.card}
            >
                <h2 className={styles.title}>{t.auth.loginTitle}</h2>
                <p className={styles.subtitle}>Welcome back to the elite agriculture network.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>{t.auth.email}</label>
                        <div className={styles.inputWrapper}>
                            <User className={styles.icon} size={20} />
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
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
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={styles.button}
                    >
                        {t.auth.submitLogin} <ArrowRight size={18} />
                    </motion.button>
                </form>

                <p className={styles.footerText}>
                    {t.nav.home === 'Home' ? "Don't have an account?" : "खाता छैन?"} <Link to="/register" className={styles.link}>{t.nav.register}</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Login;
