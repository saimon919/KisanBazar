import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import styles from './Hero.module.css';

const Hero = () => {
    const { t } = useLanguage();
    const { scrollY } = useScroll();

    // Variable Font Stretching on scroll
    const fontWeight = useTransform(scrollY, [0, 300], [900, 300]);
    const titleScale = useTransform(scrollY, [0, 500], [1, 0.9]);

    return (
        <section className={styles.hero}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.15 } }
                }}
                className={styles.content}
            >
                <div className={styles.titleWrapper}>
                    <motion.h1
                        style={{ fontWeight, scale: titleScale }}
                        variants={{
                            hidden: { y: 150, opacity: 0 },
                            visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                        }}
                        className={styles.title}
                    >
                        {t.hero.title}
                    </motion.h1>
                </div>
                <motion.p
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className={styles.subtitle}
                >
                    {t.hero.subtitle}
                </motion.p>
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { delay: 0.5 } }
                    }}
                    className={styles.actions}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.ctaButton}
                    >
                        {t.hero.ctaShop}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.secondaryButton}
                    >
                        {t.hero.ctaStartSelling}
                    </motion.button>
                </motion.div>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className={styles.imageContainer}
            >
                <div className={styles.aurora}></div>
                <div className={styles.blob}></div>
                <motion.div
                    style={{ perspective: 1000 }}
                    className={styles.perspectiveWrap}
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.8, filter: "url(#liquid-distortion) blur(20px)" },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                filter: "url(#liquid-distortion) blur(0px)",
                                transition: { duration: 2.5, ease: [0.16, 1, 0.3, 1] }
                            }
                        }}
                    >
                        <motion.img
                            variants={{
                                hidden: { rotateY: 30, z: -100 },
                                visible: {
                                    rotateY: 0,
                                    z: 0,
                                    transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
                                }
                            }}
                            src="https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=800&auto=format&fit=crop"
                            alt="Fresh Cabbage"
                            className={styles.heroImage}
                        />
                    </motion.div>
                </motion.div>
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className={styles.floatingBadge}
                >
                    <span>100% Organic</span>
                </motion.div>

                {/* Mesh Distortion Filter */}
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <filter id="liquid-distortion">
                        <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="2" result="turb">
                            <animate attributeName="baseFrequency" dur="10s" values="0.015;0.025;0.015" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="turb" scale="20" />
                    </filter>
                </svg>
            </motion.div>
        </section>
    );
};

export default Hero;
