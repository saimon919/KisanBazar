import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Package, Calendar, Clock, CheckCircle, XCircle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './MyOrders.module.css';

interface Order {
    id: string;
    items: string;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
}

const MyOrders = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/my-orders', {
                headers: {
                    'x-auth-token': localStorage.getItem('kb_token') || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.error || (language === 'en' ? `Error ${response.status}: Failed to load orders` : `त्रुटि ${response.status}: अर्डरहरू लोड गर्न असफल भयो`));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(language === 'en' ? 'Network error: Cannot reach server' : 'नेटवर्क त्रुटि: सर्भरमा पुग्न सकिएन');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: { class: string; label: string } } = {
            'pending': { class: styles.pending, label: language === 'en' ? 'Pending' : 'पेन्डिङ' },
            'paid': { class: styles.paid, label: language === 'en' ? 'Paid' : 'भुक्तानी भयो' },
            'payment_failed': { class: styles.failed, label: language === 'en' ? 'Failed' : 'असफल' },
            'approved': { class: styles.approved, label: language === 'en' ? 'Approved' : 'स्वीकृत' },
            'rejected': { class: styles.rejected, label: language === 'en' ? 'Rejected' : 'अस्वीकृत' }
        };

        const config = statusMap[status.toLowerCase()] || statusMap['pending'];
        return <span className={`${styles.badge} ${config.class}`}>{config.label}</span>;
    };

    if (loading && orders.length === 0) return (
        <div className={styles.container} style={{ textAlign: 'center', padding: '5rem' }}>
            <RefreshCcw className={styles.spinner} size={48} color="var(--color-primary)" />
            <p style={{ marginTop: '1rem' }}>{language === 'en' ? 'Loading orders...' : 'अर्डरहरू लोड हुँदैछ...'}</p>
        </div>
    );

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.title}
                    style={{ margin: 0 }}
                >
                    {language === 'en' ? 'My Orders' : 'मेरो अर्डरहरू'}
                </motion.h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchOrders}
                    className={styles.refreshBtn}
                    disabled={loading}
                >
                    <RefreshCcw size={18} className={loading ? styles.spinner : ''} />
                    {language === 'en' ? 'Sync' : 'सिंक'}
                </motion.button>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <Package size={64} color="var(--color-primary)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                    <p>{language === 'en' ? "You haven't placed any orders yet." : "तपाईंले अहिलेसम्म कुनै अर्डर गर्नुभएको छैन।"}</p>
                    <Link to="/marketplace" className={styles.shopBtn}>
                        {language === 'en' ? 'Start Shopping' : 'किनमेल सुरु गर्नुहोस्'}
                    </Link>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.orderCard}
                        >
                            <div className={styles.header}>
                                <div>
                                    <span className={styles.orderId}>{order.id}</span>
                                    <span className={styles.date}>
                                        <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles.statusGroup}>
                                    {getStatusBadge(order.status)}
                                    {getStatusBadge(order.payment_status)}
                                </div>
                            </div>

                            <div className={styles.items}>
                                {JSON.parse(order.items).map((item: any) => (
                                    <div key={item.id} className={styles.itemRow}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>Rs. {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.total}>
                                    Total: Rs. {order.total}
                                </div>
                                {order.payment_status === 'approved' ? (
                                    <div style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                        <CheckCircle size={18} />
                                        {language === 'en' ? 'Verified Purchase' : 'प्रमाणित खरिद'}
                                    </div>
                                ) : order.payment_status === 'rejected' ? (
                                    <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                        <XCircle size={18} />
                                        {language === 'en' ? 'Payment Rejected' : 'भुक्तानी अस्वीकृत'}
                                    </div>
                                ) : (
                                    <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                        <Clock size={18} />
                                        {language === 'en' ? 'Awaiting Verification' : 'प्रमाणिकरणको पर्खाइमा'}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
