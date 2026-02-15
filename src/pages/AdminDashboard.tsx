import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext.tsx';
import { Users, DollarSign, Activity, ShoppingBag, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import styles from './AdminDashboard.module.css';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
const AdminDashboard = () => {
    const { user } = useAuth();
    const { products } = useProducts();
    const [unverifiedFarmers, setUnverifiedFarmers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verification' | 'payments'>('overview');
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchUnverified = async () => {
        try {
            const token = localStorage.getItem('kb_token');
            const res = await fetch('/api/auth/unverified', {
                headers: { 'x-auth-token': token || '' }
            });
            const data = await res.json();
            if (res.ok) {
                setUnverifiedFarmers(data);
                setError(null);
            } else {
                setError(data.error || `Error ${res.status}: Failed to fetch verification queue`);
            }
        } catch (err) {
            setError("Cannot connect to server. Make sure the backend is running on port 5000.");
        }
    };

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('kb_token');
            const res = await fetch('/api/auth/all-users', {
                headers: { 'x-auth-token': token || '' }
            });
            const data = await res.json();
            if (res.ok) {
                setAllUsers(data);
                setError(null);
            } else {
                setError(data.error || `Error ${res.status}: Failed to fetch user list`);
            }
        } catch (err) {
            setError("Cannot connect to server. Make sure the backend is running on port 5000.");
        }
    };

    const fetchPendingPayments = async () => {
        try {
            const token = localStorage.getItem('kb_token');
            const res = await fetch('/api/payments/pending', {
                headers: { 'x-auth-token': token || '' }
            });
            const data = await res.json();
            if (res.ok) {
                setPendingPayments(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUnverified();
        fetchAllUsers();
        fetchPendingPayments();
    }, []);

    const handleVerify = async (id: string, isVerified: boolean) => {
        try {
            const token = localStorage.getItem('kb_token');
            const res = await fetch(`/api/auth/verify/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({ is_verified: isVerified })
            });
            if (res.ok) {
                fetchUnverified();
                fetchAllUsers();
                alert(isVerified ? 'Farmer Verified Successfully' : 'Status Updated');
            } else {
                const data = await res.json();
                alert(data.error || 'Verification failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update verification status');
        }
    };

    const handleResetPassword = async (id: string, name: string) => {
        const newPassword = prompt(`Enter new password for ${name}:`);
        if (!newPassword) return;
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const token = localStorage.getItem('kb_token');
            const res = await fetch(`/api/auth/reset-password/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({ newPassword })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Password for ${name} has been reset successfully.`);
            } else {
                alert(data.error || 'Reset failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to reset password');
        }
    };

    const handleVerifyPayment = async (orderId: string, status: 'approved' | 'rejected') => {
        try {
            const token = localStorage.getItem('kb_token');
            const res = await fetch(`/api/payments/verify/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                alert(`Payment ${status} successfully`);
                fetchPendingPayments();
                fetchAllUsers(); // To update GMV/Stats if needed
            } else {
                const data = await res.json();
                alert(data.error || 'Verification failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update payment status');
        }
    };

    const totalRevenue = products.reduce((sum, p) => sum + (p.price * 10), 125000);
    const stats = {
        totalRevenue: totalRevenue,
        activeUsers: allUsers.length || 850,
        transactions: 342,
        commission: Math.round(totalRevenue * 0.1),
    };

    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Platform Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 32000],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
            },
        ],
    };

    const userData = {
        labels: ['Customers', 'Farmers', 'Admins'],
        datasets: [
            {
                data: [
                    allUsers.filter(u => u.role === 'customer').length || 45,
                    allUsers.filter(u => u.role === 'farmer').length || 12,
                    allUsers.filter(u => u.role === 'admin').length || 3,
                ],
                backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <motion.h1 {...fadeInUp}>Admin Command Center</motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.1 }}>
                        Welcome, {user?.name}. Overseeing the future of agriculture.
                    </motion.p>
                </div>
                <div className={styles.tabs}>
                    {(['overview', 'users', 'verification', 'payments'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'verification' && ` (${unverifiedFarmers.filter(f => !f.is_verified).length})`}
                            {tab === 'payments' && ` (${pendingPayments.length})`}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={styles.errorBanner}
                        style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            marginBottom: '2rem',
                            fontWeight: 700,
                            border: '1px solid #fecaca',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <XCircle size={20} /> {error}
                    </motion.div>
                )}

                {activeTab === 'overview' && (
                    <motion.div key="overview" {...fadeInUp}>
                        <div className={styles.statsGrid}>
                            <StatCard icon={<DollarSign size={24} />} label="Total Commission" value={`Rs. ${stats.commission.toLocaleString()}`} />
                            <StatCard icon={<Users size={24} />} label="Active Users" value={stats.activeUsers.toString()} />
                            <StatCard icon={<Activity size={24} />} label="Total Orders" value={stats.transactions.toString()} />
                            <StatCard icon={<ShoppingBag size={24} />} label="Gross Merch Value" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} />
                        </div>

                        <div className={styles.chartsRow}>
                            <div className={styles.chartCard}>
                                <h3>Revenue Trajectory</h3>
                                <div className={styles.chartContainer}>
                                    <Line data={salesData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { grid: { display: false } }, x: { grid: { display: false } } }
                                    }} />
                                </div>
                            </div>
                            <div className={styles.chartCard}>
                                <h3>Ecosystem Balance</h3>
                                <div className={styles.chartContainer}>
                                    <Doughnut data={userData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div key="users" {...fadeInUp} className={styles.recentActivity}>
                        <div className={styles.sectionHeader}>
                            <h3>Global User Network ({allUsers.length})</h3>
                            <button className={styles.refreshBtn} onClick={fetchAllUsers}>
                                <RefreshCw size={16} /> Sync Data
                            </button>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.verifyTable}>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Credential</th>
                                        <th>Authorization</th>
                                        <th>P2P Channel</th>
                                        <th>Security</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.length > 0 ? (
                                        allUsers.map((u, idx) => (
                                            <motion.tr
                                                key={u.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <td><strong>{u.name}</strong></td>
                                                <td>{u.email}</td>
                                                <td><span className={`${styles.roleBadge} ${styles[u.role]}`}>{u.role}</span></td>
                                                <td>
                                                    {u.role === 'farmer' && u.payment_qr ? (
                                                        <img
                                                            src={u.payment_qr}
                                                            alt="QR"
                                                            className={styles.docThumbnail}
                                                            onClick={() => window.open(u.payment_qr, '_blank')}
                                                            style={{ height: '32px', width: '32px' }}
                                                        />
                                                    ) : '—'}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        {u.role === 'farmer' && (
                                                            u.is_verified ?
                                                                <CheckCircle size={18} color="#10b981" /> :
                                                                <Activity size={18} color="#f59e0b" />
                                                        )}
                                                        <button
                                                            className={styles.resetBtn}
                                                            onClick={() => handleResetPassword(u.id, u.name)}
                                                        >
                                                            Reset Key
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing users...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'verification' && (
                    <motion.div key="verification" {...fadeInUp} className={styles.recentActivity}>
                        <div className={styles.sectionHeader}>
                            <h3>Strategic Verifications</h3>
                            <p>{unverifiedFarmers.filter(f => !f.is_verified).length} awaiting clearance</p>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.verifyTable}>
                                <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Territory</th>
                                        <th>Documentation</th>
                                        <th>eSewa QR</th>
                                        <th>Authorization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unverifiedFarmers.filter(f => !f.is_verified).map((farmer, idx) => (
                                        <motion.tr
                                            key={farmer.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <td>
                                                <strong>{farmer.name}</strong><br />
                                                <small style={{ color: 'var(--color-text-muted)' }}>{farmer.email}</small>
                                            </td>
                                            <td>{farmer.farm_location || 'N/A'}</td>
                                            <td>
                                                <div className={styles.docCell}>
                                                    {farmer.citizenship_doc ? (
                                                        <img
                                                            src={farmer.citizenship_doc}
                                                            alt="ID"
                                                            className={styles.docThumbnail}
                                                            onClick={() => window.open(farmer.citizenship_doc, '_blank')}
                                                        />
                                                    ) : 'MISSING'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.docCell}>
                                                    {farmer.payment_qr ? (
                                                        <img
                                                            src={farmer.payment_qr}
                                                            alt="QR"
                                                            className={styles.docThumbnail}
                                                            onClick={() => window.open(farmer.payment_qr, '_blank')}
                                                            style={{ border: '1px solid #0ea5e9' }}
                                                        />
                                                    ) : 'MISSING'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button
                                                        className={styles.approveBtn}
                                                        onClick={() => handleVerify(farmer.id, true)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className={styles.rejectBtn}
                                                        onClick={() => handleVerify(farmer.id, false)}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {unverifiedFarmers.filter(f => !f.is_verified).length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '4rem' }}>All clearances complete.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'payments' && (
                    <motion.div key="payments" {...fadeInUp} className={styles.recentActivity}>
                        <div className={styles.sectionHeader}>
                            <h3>Payment Verifications</h3>
                            <p>{pendingPayments.length} pending manual reviews</p>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.verifyTable}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Buyer</th>
                                        <th>Amount</th>
                                        <th>Proof</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingPayments.map((order, idx) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <td><code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{order.id}</code></td>
                                            <td>
                                                <strong>{order.buyer_name}</strong><br />
                                                <small>{order.buyer_email}</small>
                                            </td>
                                            <td>Rs. {order.total.toLocaleString()}</td>
                                            <td>
                                                <div className={styles.docCell}>
                                                    <img
                                                        src={order.payment_screenshot}
                                                        alt="Payment Proof"
                                                        className={styles.docThumbnail}
                                                        onClick={() => window.open(order.payment_screenshot, '_blank')}
                                                        style={{ cursor: 'pointer', border: '1px solid #e2e8f0' }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button
                                                        className={styles.approveBtn}
                                                        onClick={() => handleVerifyPayment(order.id, 'approved')}
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        className={styles.rejectBtn}
                                                        onClick={() => handleVerifyPayment(order.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {pendingPayments.length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '4rem' }}>No pending payments to review.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <motion.div whileHover={{ y: -5 }} className={styles.statCard}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={styles.statInfo}>
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    </motion.div>
);

export default AdminDashboard;
