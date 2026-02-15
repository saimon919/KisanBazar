import { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Camera, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import TrustNotice from '../components/TrustNotice.tsx';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    const [isPaymentStep, setIsPaymentStep] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinalSubmit = async () => {
        if (!screenshot) {
            alert(language === 'en' ? 'Please upload your payment screenshot' : 'कृपया आफ्नो भुक्तानीको स्क्रिनसट अपलोड गर्नुहोस्');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('kb_token');
            // 1. Create Order
            const orderRes = await fetch('/api/auth/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    items: JSON.stringify(cart),
                    total: total * 1.1, // Including 10% fee
                })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

            // 2. Submit Payment Proof
            const paymentRes = await fetch('/api/payments/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    orderId: orderData.id,
                    screenshot: screenshot
                })
            });

            if (paymentRes.ok) {
                alert(language === 'en' ? 'Order submitted! Redirecting to your orders...' : 'अर्डर पठाइयो! तपाईंको अर्डरहरूमा रिडिरेक्ट गर्दै...');
                clearCart();
                // Short delay to ensure DB sync
                setTimeout(() => navigate('/my-orders'), 1000);
            } else {
                const payData = await paymentRes.json();
                throw new Error(payData.error || 'Failed to submit payment proof');
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.emptyCart}
            >
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <ShoppingCart size={80} strokeWidth={1} color="var(--color-primary)" />
                </div>
                <h2>{t.cart.title} {t.cart.empty}</h2>
                <p>{language === 'en' ? "Looks like you haven't added any fresh produce yet." : "तपाईंले अहिलेसम्म कुनै पनि वस्तु कार्टमा थप्नुभएको छैन।"}</p>
                <Link to="/marketplace" className={styles.shopBtn}>
                    <ArrowLeft size={20} /> {language === 'en' ? 'Start Shopping' : 'बजारमा जानुहोस्'}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className={styles.container}
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
        >
            <motion.h2 className={styles.title}>
                {isPaymentStep ? (language === 'en' ? 'Complete Payment' : 'भुक्तानी पूरा गर्नुहोस्') : t.cart.title}
            </motion.h2>

            <div className={styles.content}>
                <AnimatePresence mode="wait">
                    {!isPaymentStep ? (
                        <motion.div
                            key="cart-items"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={styles.cartItems}
                        >
                            {cart.map((item) => (
                                <motion.div key={item.id} className={styles.item} layout>
                                    <img src={item.image} alt={item.name} className={styles.image} />
                                    <div className={styles.itemInfo}>
                                        <h3>{item.name}</h3>
                                        <p className={styles.price}>{language === 'en' ? 'Rs.' : 'रू'} {item.price} / {item.unit === 'kg' ? (language === 'en' ? 'kg' : 'केजी') : item.unit}</p>
                                        <p className={styles.subtotal}>{language === 'en' ? 'Subtotal' : 'जम्मा'}: {language === 'en' ? 'Rs.' : 'रू'} {item.price * item.quantity}</p>
                                    </div>
                                    <div className={styles.controls}>
                                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className={styles.qtyBtn}><Minus size={18} /></button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.qtyBtn}><Plus size={18} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}><Trash2 size={24} /></button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="payment-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.paymentSection}
                        >
                            <div className={styles.qrCard}>
                                <h3>{language === 'en' ? 'Scan to Pay' : 'स्क्यान गरेर भुक्तानी गर्नुहोस्'}</h3>
                                <div className={styles.qrPlaceholder}>
                                    <img src="/qr.png" alt="eSewa QR" className={styles.qrImage} onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = `<div style="padding: 2rem; border: 2px dashed #ccc; color: #666">${language === 'en' ? 'QR Code Not Found. Please add qr.png to the public folder.' : 'QR कोड फेला परेन। कृपया public फोल्डरमा qr.png थप्नुहोस्।'}</div>`;
                                    }} />
                                </div>
                                <div className={styles.paymentInstructions}>
                                    <div className={styles.instructionItem}>
                                        <span className={styles.stepNumber}>1</span>
                                        <p>{language === 'en' ? 'Open eSewa or any Fonepay app' : 'eSewa वा कुनै पनि Fonepay एप खोल्नुहोस्'}</p>
                                    </div>
                                    <div className={styles.instructionItem}>
                                        <span className={styles.stepNumber}>2</span>
                                        <p>{language === 'en' ? 'Scan the QR code above' : 'माथिको QR कोड स्क्यान गर्नुहोस्'}</p>
                                    </div>
                                    <div className={styles.instructionItem}>
                                        <span className={styles.stepNumber}>3</span>
                                        <p>{language === 'en' ? `Pay Rs. ${Math.round(total * 1.1)}` : `रू. ${Math.round(total * 1.1)} भुक्तानी गर्नुहोस्`}</p>
                                    </div>
                                    <div className={styles.instructionItem}>
                                        <span className={styles.stepNumber}>4</span>
                                        <p>{language === 'en' ? 'Take a screenshot of the success screen' : 'सफल भुक्तानीको स्क्रिनसट लिनुहोस्'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.uploadArea}>
                                <label className={styles.uploadLabel}>
                                    {screenshot ? (
                                        <div className={styles.screenshotPreview}>
                                            <img src={screenshot} alt="Payment Proof" />
                                            <div className={styles.previewOverlay}>
                                                <Check size={32} />
                                                <span>{language === 'en' ? 'Ready to Submit' : 'बुझाउन तयार'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.dropZone}>
                                            <Camera size={48} />
                                            <p>{language === 'en' ? 'Upload Payment Screenshot' : 'भुक्तानीको स्क्रिनसट अपलोड गर्नुहोस्'}</p>
                                            <span>{language === 'en' ? 'PNG, JPG supported' : 'PNG, JPG समर्थन गर्दछ'}</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleFileChange} className={styles.hiddenInput} />
                                </label>
                                {screenshot && (
                                    <button onClick={() => setScreenshot(null)} className={styles.changeBtn}>
                                        {language === 'en' ? 'Change Image' : 'फोटो परिवर्तन गर्नुहोस्'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={styles.summary}
                >
                    <h3>{t.cart.summary}</h3>
                    <div className={styles.summaryRow}>
                        <span>{t.cart.subtotal}</span>
                        <span>{language === 'en' ? 'Rs.' : 'रू'} {total}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{language === 'en' ? 'Platform Fee (10%)' : 'प्लेटफर्म शुल्क (१०%)'}</span>
                        <span>{language === 'en' ? 'Rs.' : 'रू'} {Math.round(total * 0.1)}</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span>{t.cart.total}</span>
                        <span>{language === 'en' ? 'Rs.' : 'रू'} {Math.round(total * 1.1)}</span>
                    </div>

                    <TrustNotice />

                    {!isPaymentStep ? (
                        <button
                            className={styles.checkoutBtn}
                            onClick={() => setIsPaymentStep(true)}
                        >
                            {t.cart.checkout}
                        </button>
                    ) : (
                        <div className={styles.paymentActions}>
                            <button
                                className={styles.backBtn}
                                onClick={() => setIsPaymentStep(false)}
                                disabled={isSubmitting}
                            >
                                <ArrowLeft size={18} /> {language === 'en' ? 'Back' : 'फिर्ता जानुहोस्'}
                            </button>
                            <button
                                className={styles.submitBtn}
                                onClick={handleFinalSubmit}
                                disabled={!screenshot || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><RefreshCw className={styles.spinner} size={18} /> {language === 'en' ? 'Submitting...' : 'पठाउँदै...'}</>
                                ) : (
                                    language === 'en' ? 'Place Order' : 'अर्डर गर्नुहोस्'
                                )}
                            </button>
                        </div>
                    )}

                    {isPaymentStep && !screenshot && (
                        <div className={styles.warningBox}>
                            <AlertCircle size={16} />
                            <span>{language === 'en' ? 'Please upload proof to proceed' : 'अगाडि बढ्नको लागि प्रमाण अपलोड गर्नुहोस्'}</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Cart;
