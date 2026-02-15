import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './ContactUs.module.css';

const ContactUs = () => {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Get in Touch",
            subtitle: "Have questions? We'd love to hear from you.",
            email: "Email",
            phone: "Phone",
            location: "Location",
            formTitle: "Send us a Message",
            namePlaceholder: "Your Name",
            emailPlaceholder: "Your Email",
            messagePlaceholder: "Your Message",
            sendButton: "Send Message"
        },
        ne: {
            title: "सम्पर्कमा रहनुहोस्",
            subtitle: "प्रश्नहरू छन्? हामी तपाईंबाट सुन्न चाहन्छौं।",
            email: "इमेल",
            phone: "फोन",
            location: "स्थान",
            formTitle: "हामीलाई सन्देश पठाउनुहोस्",
            namePlaceholder: "तपाईंको नाम",
            emailPlaceholder: "तपाईंको इमेल",
            messagePlaceholder: "तपाईंको सन्देश",
            sendButton: "सन्देश पठाउनुहोस्"
        }
    };

    const t = language === 'en' ? content.en : content.ne;

    return (
        <div className={styles.page}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.container}
            >
                <div className={styles.header}>
                    <h1 className={styles.title}>{t.title}</h1>
                    <p className={styles.subtitle}>{t.subtitle}</p>
                </div>

                <div className={styles.content}>
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={styles.contactInfo}
                    >
                        <h2>{language === 'en' ? 'Contact Information' : 'सम्पर्क जानकारी'}</h2>

                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3>{t.email}</h3>
                                <a href="mailto:sunarsaimon.43244@gmail.com">sunarsaimon.43244@gmail.com</a>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3>{t.phone}</h3>
                                <a href="tel:+9779867309193">+977-9867309193</a>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3>{t.location}</h3>
                                <p>{language === 'en' ? 'Pokhara, Nepal' : 'पोखरा, नेपाल'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={styles.formSection}
                    >
                        <h2>{t.formTitle}</h2>
                        <form className={styles.form}>
                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                placeholder={t.namePlaceholder}
                                className={styles.input}
                                required
                            />
                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                placeholder={t.emailPlaceholder}
                                className={styles.input}
                                required
                            />
                            <textarea
                                id="contact-message"
                                name="message"
                                placeholder={t.messagePlaceholder}
                                className={styles.textarea}
                                rows={6}
                                required
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={styles.submitButton}
                                type="submit"
                            >
                                <Send size={20} />
                                {t.sendButton}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactUs;
