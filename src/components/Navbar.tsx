import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Search, Home, LayoutGrid, BookOpen, Zap, ZapOff, TrendingUp } from 'lucide-react';
import styles from './Navbar.module.css';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { language, setLanguage, t } = useLanguage();
    const [isLiteMode, setIsLiteMode] = useState(localStorage.getItem('liteMode') === 'true');

    const toggleLiteMode = () => {
        const newVal = !isLiteMode;
        setIsLiteMode(newVal);
        localStorage.setItem('liteMode', newVal.toString());
        window.location.reload(); // Reload to apply visual changes globally
    };
    const location = useLocation();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={styles.navbar}
            >
                <div className={styles.logo}>
                    <Link to="/">{language === 'en' ? 'KisanBazaar' : 'किसानबजार'}</Link>
                </div>

                <div className={styles.mobileActions}>
                    <button
                        className={styles.langToggle}
                        onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
                    >
                        {language === 'en' ? '🇳🇵' : '🇺🇸'}
                    </button>
                </div>

                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        id="produce-search"
                        name="q"
                        type="text"
                        placeholder={language === 'en' ? "Search fresh produce..." : "ताजा उपज खोज्नुहोस्..."}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.navLinks}>
                    <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
                        {t.nav.home}
                        {location.pathname === '/' && (
                            <motion.div layoutId="liquid-pill" className={styles.liquidIndicator} transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                        )}
                    </Link>
                    <Link to="/marketplace" className={`${styles.navLink} ${location.pathname === '/marketplace' ? styles.active : ''}`}>
                        {t.nav.marketplace}
                        {location.pathname === '/marketplace' && (
                            <motion.div layoutId="liquid-pill" className={styles.liquidIndicator} transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                        )}
                    </Link>
                    <Link to="/live-rates" className={`${styles.navLink} ${location.pathname === '/live-rates' ? styles.active : ''}`}>
                        {language === 'en' ? 'Live Rates' : 'प्रत्यक्ष मूल्य'}
                        {location.pathname === '/live-rates' && (
                            <motion.div layoutId="liquid-pill" className={styles.liquidIndicator} transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                        )}
                    </Link>
                    <Link to="/about-us" className={`${styles.navLink} ${location.pathname === '/about-us' ? styles.active : ''}`}>
                        {language === 'en' ? 'About' : 'बारेमा'}
                        {location.pathname === '/about-us' && (
                            <motion.div layoutId="liquid-pill" className={styles.liquidIndicator} transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                        )}
                    </Link>
                    <Link to="/contact-us" className={`${styles.navLink} ${location.pathname === '/contact-us' ? styles.active : ''}`}>
                        {language === 'en' ? 'Contact' : 'सम्पर्क'}
                        {location.pathname === '/contact-us' && (
                            <motion.div layoutId="liquid-pill" className={styles.liquidIndicator} transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                        )}
                    </Link>
                    <Link to="/learning-hub" className={`${styles.navLink} ${location.pathname === '/learning-hub' ? styles.active : ''}`}>
                        {language === 'en' ? 'Guides' : 'निर्देशिकाहरू'}
                        {location.pathname === '/learning-hub' && (
                            <motion.div layoutId="liquid-pill" className={styles.liquidIndicator} transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                        )}
                    </Link>
                </div>

                <ul className={styles.navActions}>
                    {user ? (
                        <>
                            <li className={styles.desktopOnly}>
                                <span className={styles.welcome}>{language === 'en' ? 'Hi' : 'नमस्ते'}, {user.name}</span>
                            </li>
                            <li><Link to="/my-orders">{language === 'en' ? 'My Orders' : 'मेरो अर्डरहरू'}</Link></li>
                            {user.role === 'farmer' && <li><Link to="/seller-dashboard">{t.nav.dashboard}</Link></li>}
                            {user.role === 'admin' && <li><Link to="/admin-dashboard" className={styles.roleLink}>Admin</Link></li>}
                            <li>
                                <button onClick={logout} className={styles.iconBtn} title={t.nav.logout}>
                                    <LogOut size={20} />
                                </button>
                            </li>
                        </>
                    ) : (
                        <li><Link to="/login" className={styles.loginBtn}><User size={18} /> {t.nav.login}</Link></li>
                    )}

                    <li className={styles.divider}></li>

                    <li>
                        <button
                            className={`${styles.iconBtn} ${isLiteMode ? styles.liteActive : ''}`}
                            onClick={toggleLiteMode}
                            title={isLiteMode ? "Disable Lite Mode" : "Enable Lite Mode"}
                        >
                            {isLiteMode ? <ZapOff size={20} /> : <Zap size={20} />}
                        </button>
                    </li>


                    <li>
                        <button
                            className={styles.langToggle}
                            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
                        >
                            {language === 'en' ? '🇳🇵' : '🇺🇸'}
                        </button>
                    </li>

                    <li>
                        <Link to="/cart" className={styles.cartBtn}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                        </Link>
                    </li>
                </ul>
            </motion.nav>

            {/* Floating Bottom Portal for Mobile */}
            <nav className={styles.mobilePortal}>
                <Link to="/" className={`${styles.portalLink} ${location.pathname === '/' ? styles.portalActive : ''}`}>
                    <Home size={22} />
                    <span>{t.nav.home}</span>
                </Link>
                <Link to="/marketplace" className={`${styles.portalLink} ${location.pathname === '/marketplace' ? styles.portalActive : ''}`}>
                    <LayoutGrid size={22} />
                    <span>{t.nav.marketplace}</span>
                </Link>
                <Link to="/live-rates" className={`${styles.portalLink} ${location.pathname === '/live-rates' ? styles.portalActive : ''}`}>
                    <TrendingUp size={22} />
                    <span>{language === 'en' ? 'Rates' : 'मूल्य'}</span>
                </Link>
                <Link to="/about-us" className={`${styles.portalLink} ${location.pathname === '/about-us' ? styles.portalActive : ''}`}>
                    <User size={22} />
                    <span>{language === 'en' ? 'About' : 'बारे'}</span>
                </Link>
                <Link to="/contact-us" className={`${styles.portalLink} ${location.pathname === '/contact-us' ? styles.portalActive : ''}`}>
                    <BookOpen size={22} />
                    <span>{language === 'en' ? 'Contact' : 'सम्पर्क'}</span>
                </Link>
                <Link to="/cart" className={`${styles.portalLink} ${location.pathname === '/cart' ? styles.portalActive : ''}`}>
                    <div style={{ position: 'relative' }}>
                        <ShoppingCart size={22} />
                        {cartCount > 0 && <span className={styles.badge} style={{ top: -5, right: -10 }}>{cartCount}</span>}
                    </div>
                    <span>{t.nav.cart}</span>
                </Link>
            </nav>
        </>
    );
};

export default Navbar;
