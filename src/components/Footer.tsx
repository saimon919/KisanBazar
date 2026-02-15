import { useLanguage } from '../context/LanguageContext';
import styles from './Footer.module.css';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const { language } = useLanguage();

    const content = {
        en: {
            about: {
                title: "About KisanBazaar",
                description: "Nepal's trusted digital marketplace connecting farmers directly with buyers. We verify every farmer and provide transparent pricing to ensure fair trade for all."
            },
            howItWorks: {
                title: "How It Works",
                forBuyers: "For Buyers",
                buyerSteps: [
                    "Browse verified farmer products",
                    "Check real-time market prices",
                    "Order fresh produce directly",
                    "Support local agriculture"
                ],
                forSellers: "For Farmers",
                sellerSteps: [
                    "Register with citizenship docs",
                    "Get verified by admin",
                    "List your fresh produce",
                    "Receive fair prices"
                ]
            },
            safety: {
                title: "Safety & Trust",
                points: [
                    "All farmers verified through citizenship documentation",
                    "Admin approval required before listing",
                    "Real-time market price transparency",
                    "Secure platform with data protection"
                ]
            },
            contact: {
                title: "Contact Us",
                email: "sunarsaimon.43244@gmail.com",
                phone: "+977-9867309193",
                location: "Pokhara, Nepal"
            },
            quickLinks: "Quick Links",
            copyright: "All rights reserved."
        },
        ne: {
            about: {
                title: "किसानबजारको बारेमा",
                description: "नेपालको विश्वसनीय डिजिटल बजार जसले किसानहरूलाई सीधा क्रेताहरूसँग जोड्दछ। हामी प्रत्येक किसानलाई प्रमाणित गर्छौं र सबैका लागि निष्पक्ष व्यापार सुनिश्चित गर्न पारदर्शी मूल्य निर्धारण प्रदान गर्दछौं।"
            },
            howItWorks: {
                title: "यसले कसरी काम गर्छ",
                forBuyers: "क्रेताहरूका लागि",
                buyerSteps: [
                    "प्रमाणित किसान उत्पादनहरू ब्राउज गर्नुहोस्",
                    "वास्तविक समय बजार मूल्यहरू जाँच गर्नुहोस्",
                    "ताजा उपज सीधा अर्डर गर्नुहोस्",
                    "स्थानीय कृषिलाई समर्थन गर्नुहोस्"
                ],
                forSellers: "किसानहरूका लागि",
                sellerSteps: [
                    "नागरिकता कागजातसँग दर्ता गर्नुहोस्",
                    "प्रशासकद्वारा प्रमाणित हुनुहोस्",
                    "आफ्नो ताजा उपज सूचीबद्ध गर्नुहोस्",
                    "उचित मूल्य प्राप्त गर्नुहोस्"
                ]
            },
            safety: {
                title: "सुरक्षा र विश्वास",
                points: [
                    "सबै किसानहरू नागरिकता कागजात मार्फत प्रमाणित",
                    "सूचीबद्ध गर्नु अघि प्रशासक अनुमोदन आवश्यक",
                    "वास्तविक समय बजार मूल्य पारदर्शिता",
                    "डेटा सुरक्षाको साथ सुरक्षित प्लेटफर्म"
                ]
            },
            contact: {
                title: "हामीलाई सम्पर्क गर्नुहोस्",
                email: "sunarsaimon.43244@gmail.com",
                phone: "+977-9867309193",
                location: "पोखरा, नेपाल"
            },
            quickLinks: "द्रुत लिङ्कहरू",
            copyright: "सबै अधिकार सुरक्षित।"
        }
    };

    const t = language === 'en' ? content.en : content.ne;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* About Section */}
                <div className={styles.section}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>
                            {language === 'en' ? 'KisanBazaar' : 'किसानबजार'} 🥬
                        </h3>
                        <p className={styles.aboutText}>{t.about.description}</p>
                    </div>
                </div>

                {/* How It Works */}
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>{t.howItWorks.title}</h4>
                    <div className={styles.subsection}>
                        <h5>{t.howItWorks.forBuyers}</h5>
                        <ul className={styles.list}>
                            {t.howItWorks.buyerSteps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.subsection}>
                        <h5>{t.howItWorks.forSellers}</h5>
                        <ul className={styles.list}>
                            {t.howItWorks.sellerSteps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Safety & Trust */}
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>
                        <Shield size={20} className={styles.titleIcon} />
                        {t.safety.title}
                    </h4>
                    <ul className={styles.list}>
                        {t.safety.points.map((point, idx) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>{t.contact.title}</h4>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <Mail size={16} />
                            <span>{t.contact.email}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Phone size={16} />
                            <span>{t.contact.phone}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <MapPin size={16} />
                            <span>{t.contact.location}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>
                        {language === 'en' ? 'Quick Links' : 'द्रुत लिङ्कहरू'}
                    </h4>
                    <ul className={styles.list}>
                        <li>
                            <a href="/about-us">{language === 'en' ? 'About Us' : 'हाम्रो बारेमा'}</a>
                        </li>
                        <li>
                            <a href="/contact-us">{language === 'en' ? 'Contact Us' : 'सम्पर्क गर्नुहोस्'}</a>
                        </li>
                        <li>
                            <a href="/live-rates">{language === 'en' ? 'Live Market Rates' : 'प्रत्यक्ष बजार मूल्य'}</a>
                        </li>
                        <li>
                            <a href="/marketplace">{language === 'en' ? 'Marketplace' : 'बजार'}</a>
                        </li>
                        <li>
                            <a href="/learning-hub">{language === 'en' ? 'Learning Hub' : 'सिक्ने केन्द्र'}</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottom}>
                <p>&copy; 2026 {language === 'en' ? 'KisanBazaar' : 'किसानबजार'}. {t.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
