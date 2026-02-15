import { motion } from 'framer-motion';
import { Award, Target, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './AboutUs.module.css';

const AboutUs = () => {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "About KisanBazaar",
            subtitle: "Empowering Nepal's Agricultural Future",
            mission: {
                title: "Our Mission",
                text: "To create a transparent, trust-first digital marketplace that connects farmers directly with buyers, ensuring fair prices and eliminating middlemen while supporting local agriculture."
            },
            founder: {
                title: "Meet Our Founder",
                name: "Sunar Saimon",
                role: "CEO & Co-Founder",
                company: "INFINITTE",
                age: "14 years old",
                bio: "At just 14 years old, Sunar Saimon is the visionary CEO and Co-Founder of INFINITTE, driving innovation in Nepal's agricultural technology sector. With a passion for empowering farmers and creating sustainable solutions, Sunar leads KisanBazaar's mission to revolutionize how agricultural commerce works in Nepal."
            },
            values: {
                title: "Our Values",
                items: [
                    {
                        icon: "transparency",
                        title: "Transparency",
                        description: "Real-time market prices and verified farmer information"
                    },
                    {
                        icon: "trust",
                        title: "Trust",
                        description: "Every farmer verified through citizenship documentation"
                    },
                    {
                        icon: "innovation",
                        title: "Innovation",
                        description: "Leveraging technology to solve agricultural challenges"
                    },
                    {
                        icon: "community",
                        title: "Community",
                        description: "Supporting local farmers and sustainable agriculture"
                    }
                ]
            }
        },
        ne: {
            title: "किसानबजारको बारेमा",
            subtitle: "नेपालको कृषि भविष्यलाई सशक्त बनाउँदै",
            mission: {
                title: "हाम्रो मिशन",
                text: "किसानहरूलाई सीधा क्रेताहरूसँग जोड्ने पारदर्शी, विश्वास-प्रथम डिजिटल बजार सिर्जना गर्न, उचित मूल्य सुनिश्चित गर्दै र बिचौलियाहरू हटाउँदै स्थानीय कृषिलाई समर्थन गर्दै।"
            },
            founder: {
                title: "हाम्रो संस्थापकलाई भेट्नुहोस्",
                name: "सुनार साइमन",
                role: "सीईओ र सह-संस्थापक",
                company: "INFINITTE",
                age: "१४ वर्ष",
                bio: "मात्र १४ वर्षको उमेरमा, सुनार साइमन INFINITTE का दूरदर्शी सीईओ र सह-संस्थापक हुन्, नेपालको कृषि प्रविधि क्षेत्रमा नवाचार चलाउँदै। किसानहरूलाई सशक्त बनाउने र दिगो समाधानहरू सिर्जना गर्ने जुनूनका साथ, सुनारले नेपालमा कृषि वाणिज्य कसरी काम गर्छ भनेर क्रान्तिकारी बनाउन किसानबजारको मिशनको नेतृत्व गर्दछन्।"
            },
            values: {
                title: "हाम्रा मूल्यहरू",
                items: [
                    {
                        icon: "transparency",
                        title: "पारदर्शिता",
                        description: "वास्तविक समय बजार मूल्य र प्रमाणित किसान जानकारी"
                    },
                    {
                        icon: "trust",
                        title: "विश्वास",
                        description: "प्रत्येक किसान नागरिकता कागजात मार्फत प्रमाणित"
                    },
                    {
                        icon: "innovation",
                        title: "नवाचार",
                        description: "कृषि चुनौतीहरू समाधान गर्न प्रविधिको उपयोग"
                    },
                    {
                        icon: "community",
                        title: "समुदाय",
                        description: "स्थानीय किसान र दिगो कृषिलाई समर्थन"
                    }
                ]
            }
        }
    };

    const t = language === 'en' ? content.en : content.ne;

    const iconMap = {
        transparency: Target,
        trust: Award,
        innovation: Sparkles,
        community: Users
    };

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

                {/* Mission */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.mission}
                >
                    <h2>{t.mission.title}</h2>
                    <p>{t.mission.text}</p>
                </motion.section>

                {/* Founder Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={styles.founder}
                >
                    <h2>{t.founder.title}</h2>
                    <div className={styles.founderContent}>
                        <div className={styles.founderImage}>
                            <img src="/webpic.png" alt={t.founder.name} />
                        </div>
                        <div className={styles.founderInfo}>
                            <h3>{t.founder.name}</h3>
                            <p className={styles.role}>{t.founder.role}</p>
                            <p className={styles.company}>{t.founder.company}</p>
                            <p className={styles.age}>{t.founder.age}</p>
                            <p className={styles.bio}>{t.founder.bio}</p>
                        </div>
                    </div>
                </motion.section>

                {/* Values */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={styles.values}
                >
                    <h2>{t.values.title}</h2>
                    <div className={styles.valuesGrid}>
                        {t.values.items.map((item, idx) => {
                            const Icon = iconMap[item.icon as keyof typeof iconMap];
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    className={styles.valueCard}
                                >
                                    <div className={styles.valueIcon}>
                                        <Icon size={28} />
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default AboutUs;
