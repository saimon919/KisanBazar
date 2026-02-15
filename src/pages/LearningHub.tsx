import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './LearningHub.module.css';
import { Users, Search, Droplets, Sprout, ShieldCheck, X, Info, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tutorial {
    id: number;
    title_en: string;
    title_ne: string;
    description_en: string;
    description_ne: string;
    full_content_en: string;
    full_content_ne: string;
    icon: any;
    type: 'Article' | 'Video' | 'Guide';
    category: string;
}

const LearningHub = () => {
    const { language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
    const [showContribute, setShowContribute] = useState(false);

    const categories = ['All', 'Organic', 'Irrigation', 'Pest Control', 'Livestock', 'Soil Health'];

    const initialTutorials: Tutorial[] = [
        {
            id: 1,
            title_en: 'Organic Pest Control (Jholmal)',
            title_ne: 'जैविक कीटनाशक (झोलमोल)',
            description_en: 'Learn how to make Jholmal, a traditional and powerful bio-pesticide.',
            description_ne: 'परम्परागत र शक्तिशाली जैविक विषादी झोलमोल बनाउने तरिका सिक्नुहोस्।',
            full_content_en: `Jholmal is a traditional bio-fertilizer and insecticide used widely in Nepal. 
            ### Recipe for Jholmal-1:
            1. **Ingredients**: 50L Cow Urine, 50L Water, 1kg Local Plants (Neem, Titepati, Asuro).
            2. **Method**: Mix all ingredients in a 200L plastic drum. Stir daily for 15-20 days.
            3. **Usage**: Dilute 1L of Jholmal in 5-10L of water before spraying on crops.
            ### Benefits:
            - Repels aphids, thrips, and whiteflies.
            - Enhances soil microbial activity.
            - Zero chemical residue.`,
            full_content_ne: `झोलमोल नेपालमा व्यापक रूपमा प्रयोग हुने परम्परागत जैविक मल र कीटनाशक हो।
            ### झोलमोल-१ बनाउने विधि:
            १. **सामग्रीहरू**: ५० लिटर गाईको गहुँत, ५० लिटर पानी, १ केजी स्थानीय बिरुवाहरू (निम, तितेपाती, असुरो)।
            २. **तरिका**: सबै सामग्रीहरूलाई २०० लिटरको प्लास्टिकको ड्रममा मिसाउनुहोस्। १५-२० दिनसम्म दैनिक चलाउनुहोस्।
            ३. **प्रयोग**: बालीमा स्प्रे गर्नु अघि १ लिटर झोलमोल ५-१० लिटर पानीमा मिसाउनुहोस्।
            ### फाइदाहरू:
            - लाही कीरा र सेतो झिँगा भगाउँछ।
            - माटोको सूक्ष्मजीव गतिविधिलाई बढाउँछ।
            - रासायनिक अवशेष रहँदैन।`,
            icon: <ShieldCheck size={28} />,
            type: 'Guide',
            category: 'Pest Control'
        },
        {
            id: 2,
            title_en: 'Smart Drip Irrigation',
            title_ne: 'स्मार्ट थोपा सिँचाइ',
            description_en: 'Efficient water usage for high-value crops using low-cost drip sets.',
            description_ne: 'कम लागतको थोपा सिँचाइ सेटको प्रयोग गरी उच्च मूल्यका बालीहरूको लागि कुशल पानीको प्रयोग।',
            full_content_en: `Drip irrigation is ideal for Nepal's hilly terrain and water-scarce regions.
            ### Steps to Setup:
            1. **Source**: Use a gravity-fed tank or a small plastic pond (1000L).
            2. **Components**: Main pipe, lateral pipes, and emitters (inline or button).
            3. **Installation**: Layout pipes along crop rows. Pierce holes at 30cm intervals for emitters.
            ### Maintenance:
            - Flush the system weekly to prevent clogging.
            - Clean filters regularly.
            ### Saving:
            Saves up to 70% water compared to flood irrigation.`,
            full_content_ne: `थोपा सिँचाइ नेपालको पहाडी भूभाग र पानीको अभाव भएका क्षेत्रका लागि उपयुक्त छ।
            ### सेटअप गर्ने चरणहरू:
            १. **स्रोत**: गुरुत्वाकर्षणबाट चल्ने ट्याङ्की वा सानो प्लास्टिक पोखरी (१००० लिटर) प्रयोग गर्नुहोस्।
            २. **सामग्री**: मुख्य पाइप, शाखा पाइप र इमिटरहरू।
            ३. **स्थापना**: बालीको लहर अनुसार पाइप बिछ्याउनुहोस्। इमिटरका लागि ३० सेन्टिमिटरको अन्तरालमा प्वाल पार्नुहोस्।
            ### मर्मत सम्भार:
            - अवरोध रोक्न हप्तामा एक पटक प्रणाली सफा गर्नुहोस्।
            - फिल्टरहरू नियमित रूपमा सफा गर्नुहोस्।
            ### बचत:
            सतह सिँचाइको तुलनामा ७०% सम्म पानी बचत गर्छ।`,
            icon: <Droplets size={28} />,
            type: 'Article',
            category: 'Irrigation'
        },
        {
            id: 3,
            title_en: 'Vermicomposting for Soil Health',
            title_ne: 'माटोको स्वास्थ्यका लागि गड्यौला मल',
            description_en: 'Transform farm waste into black gold using earthworms.',
            description_ne: 'गड्यौलाको प्रयोग गरी कृषि फोहोरलाई कालो सुनमा परिणत गर्नुहोस्।',
            full_content_en: `Vermicomposting is the process of using earthworms to digest organic waste.
            ### Process:
            1. **Bedding**: Use cow dung, agricultural waste, and dry leaves.
            2. **Worms**: Eudrilus eugeniae (African Nightcrawler) is best for Nepal.
            3. **Environment**: Keep moisture at 60-70% and protect from direct sun/rain.
            ### Result:
            Ready in 60-90 days. High in nitrogen and plant growth hormones.`,
            full_content_ne: `गड्यौला मल जैविक फोहोर पचाउन गड्यौला प्रयोग गर्ने प्रक्रिया हो।
            ### प्रक्रिया:
            १. **बेडिङ**: गाईको गोबर, कृषि फोहोर र सुख्खा पातहरू प्रयोग गर्नुहोस्।
            २. **गड्यौला**: नेपालका लागि युड्रीलस युजेनिया उत्तम हुन्छ।
            ३. **वातावरण**: आर्द्रता ६०-७०% मा राख्नुहोस् र सीधा घाम/पानीबाट बचाउनुहोस्।
            ### नतिजा:
            ६०-९० दिनमा तयार हुन्छ। नाइट्रोजन र वनस्पति वृद्धि हार्मोनमा उच्च हुन्छ।`,
            icon: <Sprout size={28} />,
            type: 'Article',
            category: 'Soil Health'
        },
        {
            id: 4,
            title_en: 'Livestock Vaccination Guide',
            title_ne: 'पशुपालन खोप निर्देशिका',
            description_en: 'Essential vaccination schedule for Cattle, Goats and Poultry.',
            description_ne: 'गाईवस्तु, बाख्रा र कुखुराको लागि आवश्यक खोप तालिका।',
            full_content_en: `Prevention is better than cure. Follow this schedule to protect your livestock.
            ### Essential Vaccines:
            - **FMD (Foot and Mouth Disease)**: Twice a year for Cattle/Buffalo.
            - **PPR**: Every 3 years for Goats.
            - **Newcastle Disease**: For Poultry (Ranikhet).
            ### Best Practices:
            - Buy vaccines from certified agrovets.
            - Maintain cold chain (keep in ice).
            - Observe animals for 24h after vaccination.`,
            full_content_ne: `उपचार भन्दा रोकथाम राम्रो हो। आफ्नो पशुधन जोगाउन यो तालिका पछ्याउनुहोस्।
            ### आवश्यक खोपहरू:
            - **खोरेत (FMD)**: गाई/भैंसीको लागि वर्षमा दुई पटक।
            - **पीपीआर (PPR)**: बाख्राको लागि प्रत्येक ३ वर्षमा।
            - **रानीखेत**: कुखुराको लागि।
            ### उत्तम अभ्यासहरू:
            - प्रमाणित एग्रोभेटहरूबाट खोप किन्नुहोस्।
            - कोल्ड चेन कायम राख्नुहोस् (बरफमा राख्नुहोस्)।
            - खोप लगाएपछि २४ घण्टासम्म जनावरहरूलाई अवलोकन गर्नुहोस्।`,
            icon: <Info size={28} />,
            type: 'Guide',
            category: 'Livestock'
        }
    ];

    const [allTutorials, setAllTutorials] = useState<Tutorial[]>(initialTutorials);

    const [newContribution, setNewContribution] = useState({
        title_en: '',
        title_ne: '',
        description_en: '',
        description_ne: '',
        category: 'Organic',
        content_en: '',
        content_ne: ''
    });

    const handleContribute = (e: React.FormEvent) => {
        e.preventDefault();
        const tutorial: Tutorial = {
            id: allTutorials.length + 1,
            title_en: newContribution.title_en,
            title_ne: newContribution.title_ne,
            description_en: newContribution.description_en,
            description_ne: newContribution.description_ne,
            full_content_en: newContribution.content_en,
            full_content_ne: newContribution.content_ne,
            icon: <BookOpen size={28} />,
            type: 'Guide',
            category: newContribution.category
        };
        setAllTutorials([tutorial, ...allTutorials]);
        setShowContribute(false);
        setNewContribution({
            title_en: '',
            title_ne: '',
            description_en: '',
            description_ne: '',
            category: 'Organic',
            content_en: '',
            content_ne: ''
        });
        alert(language === 'en' ? 'Thank you for contributing! Your guide is now live.' : 'योगदानको लागि धन्यवाद! तपाईंको निर्देशिका अब प्रत्यक्ष छ।');
    };

    const filteredTutorials = allTutorials.filter(tut => {
        const matchesSearch = (language === 'en' ? tut.title_en : tut.title_ne).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || tut.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={styles.container}
        >
            <header className={styles.header}>
                <motion.h1 variants={cardVariants}>{language === 'en' ? 'Learning Hub' : 'सिक्ने केन्द्र'}</motion.h1>
                <motion.p variants={cardVariants}>{language === 'en' ? 'Community-driven farming knowledge and premium tutorials.' : 'समुदाय-आधारित खेती ज्ञान र प्रिमium ट्यूटोरियलहरू।'}</motion.p>

                <motion.div variants={cardVariants} className={styles.searchBar}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        id="hub-search"
                        name="hub-search"
                        type="text"
                        placeholder={language === 'en' ? 'Search tutorials...' : 'ट्यूटोरियलहरू खोज्नुहोस्...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>

                <motion.div variants={cardVariants} className={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.catBtn} ${activeCategory === cat ? styles.activeCat : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
            </header>

            <motion.div layout className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filteredTutorials.map(tut => (
                        <motion.div
                            layout
                            key={tut.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -10 }}
                            className={styles.card}
                        >
                            <div className={styles.typeBadge}>{tut.type}</div>
                            <div className={styles.icon}>{tut.icon}</div>
                            <h3>{language === 'en' ? tut.title_en : tut.title_ne}</h3>
                            <p>{language === 'en' ? tut.description_en : tut.description_ne}</p>
                            <button className={styles.readBtn} onClick={() => setSelectedTutorial(tut)}>
                                {language === 'en' ? 'Read More' : 'थप पढ्नुहोस्'}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredTutorials.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.noResults}>
                    <Search size={48} opacity={0.3} />
                    <p>{language === 'en' ? 'No tutorials found matching your search.' : 'तपाईंको खोजीसँग मिल्ने कुनै ट्यूटोरियलहरू भेटिएन।'}</p>
                </motion.div>
            )}

            <AnimatePresence>
                {selectedTutorial && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedTutorial(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeBtn} onClick={() => setSelectedTutorial(null)}>
                                <X size={24} />
                            </button>
                            <div className={styles.modalHeader}>
                                <div className={styles.modalIcon}>{selectedTutorial.icon}</div>
                                <div>
                                    <span className={styles.modalBadge}>{selectedTutorial.type}</span>
                                    <h2>{language === 'en' ? selectedTutorial.title_en : selectedTutorial.title_ne}</h2>
                                </div>
                            </div>
                            <div className={styles.modalBody}>
                                {(language === 'en' ? selectedTutorial.full_content_en : selectedTutorial.full_content_ne).split('\n').map((line, i) => {
                                    if (line.trim().startsWith('###')) {
                                        return <h3 key={i}>{line.replace('###', '').trim()}</h3>;
                                    }
                                    if (line.trim().match(/^\d\./)) {
                                        return <p key={i} className={styles.listItem}>{line.trim()}</p>;
                                    }
                                    if (line.trim().startsWith('-')) {
                                        return <p key={i} className={styles.bulletItem}>{line.trim()}</p>;
                                    }
                                    return <p key={i}>{line.trim()}</p>;
                                })}
                            </div>
                            <div className={styles.modalFooter}>
                                <button className={styles.finishBtn} onClick={() => setSelectedTutorial(null)}>
                                    {language === 'en' ? 'Completed' : 'पूरा भयो'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showContribute && (
                    <div className={styles.modalOverlay} onClick={() => setShowContribute(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeBtn} onClick={() => setShowContribute(false)}>
                                <X size={24} />
                            </button>
                            <div className={styles.modalHeader}>
                                <div className={styles.modalIcon}><Users size={28} /></div>
                                <div>
                                    <h2>{language === 'en' ? 'Contribute Knowledge' : 'ज्ञान योगदान गर्नुहोस्'}</h2>
                                    <p>{language === 'en' ? 'Help fellow farmers by sharing your expertise.' : 'आफ्नो विशेषज्ञता साझा गरेर साथी किसानहरूलाई मद्दत गर्नुहोस्।'}</p>
                                </div>
                            </div>
                            <form className={styles.contributeForm} onSubmit={handleContribute}>
                                <div className={styles.formGroup}>
                                    <label>{language === 'en' ? 'Title (English)' : 'शीर्षक (अंग्रेजी)'}</label>
                                    <input
                                        id="contribute-title-en"
                                        name="title_en"
                                        required
                                        type="text"
                                        value={newContribution.title_en}
                                        onChange={e => setNewContribution({ ...newContribution, title_en: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{language === 'en' ? 'Title (Nepali)' : 'शीर्षक (नेपाली)'}</label>
                                    <input
                                        id="contribute-title-ne"
                                        name="title_ne"
                                        required
                                        type="text"
                                        value={newContribution.title_ne}
                                        onChange={e => setNewContribution({ ...newContribution, title_ne: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>{language === 'en' ? 'Category' : 'वर्ग'}</label>
                                        <select
                                            id="contribute-category"
                                            name="category"
                                            value={newContribution.category}
                                            onChange={e => setNewContribution({ ...newContribution, category: e.target.value })}
                                        >
                                            {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{language === 'en' ? 'Short Description (English)' : 'छोटो विवरण (अंग्रेजी)'}</label>
                                    <input
                                        id="contribute-desc-en"
                                        name="description_en"
                                        required
                                        type="text"
                                        value={newContribution.description_en}
                                        onChange={e => setNewContribution({ ...newContribution, description_en: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{language === 'en' ? 'Full Content (English)' : 'पूर्ण सामग्री (अंग्रेजी)'}</label>
                                    <textarea
                                        id="contribute-content-en"
                                        name="content_en"
                                        required
                                        rows={4}
                                        placeholder="Use ### for headers, - for bullets"
                                        value={newContribution.content_en}
                                        onChange={e => setNewContribution({ ...newContribution, content_en: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{language === 'en' ? 'Full Content (Nepali)' : 'पूर्ण सामग्री (नेपाली)'}</label>
                                    <textarea
                                        id="contribute-content-ne"
                                        name="content_ne"
                                        required
                                        rows={4}
                                        placeholder="शीर्षकका लागि ###, बुलेटका लागि - प्रयोग गर्नुहोस्"
                                        value={newContribution.content_ne}
                                        onChange={e => setNewContribution({ ...newContribution, content_ne: e.target.value })}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className={styles.submitBtn}
                                >
                                    {language === 'en' ? 'Publish Tutorial' : 'ट्यूटोरियल प्रकाशित गर्नुहोस्'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div variants={cardVariants} className={styles.communityCall}>
                <Users size={48} />
                <h2>{language === 'en' ? 'Join our Community' : 'हाम्रो समुदायमा सामेल हुनुहोस्'}</h2>
                <p>{language === 'en' ? 'Share your expertise with 5,000+ fellow farmers from across Nepal.' : 'नेपालभरिका ५,०००+ साथी किसानहरूसँग आफ्नो विशेषज्ञता साझा गर्नुहोस्।'}</p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={styles.joinBtn}
                    onClick={() => setShowContribute(true)}
                >
                    {language === 'en' ? 'Start Contributing' : 'योगदान सुरु गर्नुहोस्'}
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default LearningHub;
