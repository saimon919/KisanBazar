import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Plus, Package, DollarSign, TrendingUp, Trash2, Edit, X, ShoppingBag } from 'lucide-react';
import styles from './SellerDashboard.module.css';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
const SellerDashboard = () => {
    const { products, addProduct, updateProduct, deleteProduct, logOfflineSale } = useProducts();
    const { user, updateProfile } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);

    const [qrBase64, setQrBase64] = useState(user?.payment_qr || '');

    const myProducts = products.filter(p =>
        (p.farmer_id && p.farmer_id === user?.id) ||
        (!p.farmer_id && p.farmer === user?.name)
    );

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Vegetable' as const,
        description: '',
        unit: 'kg',
        image: ''
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        await updateProfile({ payment_qr: qrBase64 });
        setShowProfileSettings(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const productData = {
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            description: formData.description,
            unit: formData.unit,
            farmer: user.name,
            image: formData.image || `https://placehold.co/400x300/e8f5e9/2e7d32?text=${formData.name.replace(/\s+/g, '+')}`
        };

        if (editingId) {
            updateProduct({ ...productData, id: editingId });
        } else {
            addProduct(productData);
        }

        setShowAddForm(false);
        setEditingId(null);
        setFormData({ name: '', price: '', category: 'Vegetable', description: '', unit: 'kg', image: '' });
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            description: product.description,
            unit: product.unit,
            image: product.image
        });
        setEditingId(product.id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOfflineSale = async (product: any) => {
        const qty = prompt(`How many ${product.unit} of ${product.name} did you sell offline?`, "1");
        if (qty && !isNaN(Number(qty))) {
            const success = await logOfflineSale(product.id, Number(qty), product.price * Number(qty));
            if (success) {
                alert(`Logged offline sale of ${qty} ${product.unit} ${product.name}.`);
            } else {
                alert("Failed to log offline sale. Please try again.");
            }
        }
    };

    const stats = {
        totalSales: 24500,
        totalOrders: 68,
        products: myProducts.length,
    };

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Revenue (Rs)',
                data: [4200, 5900, 3000, 7000, 4000, 8500, 9000],
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.container}
        >
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <div className={styles.titleRow}>
                        <motion.h1 variants={itemVariants}>Harvest Hub</motion.h1>
                        {user?.is_verified && (
                            <motion.span variants={itemVariants} className={styles.verifiedBadge}>
                                <CheckCircle size={18} /> Verified Producer
                            </motion.span>
                        )}
                    </div>
                    <motion.p variants={itemVariants}>Managing your farm's digital presence, {user?.name}.</motion.p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.addBtn}
                        style={{
                            background: 'rgba(16, 185, 129, 0.05)',
                            color: 'var(--color-primary)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            boxShadow: 'none'
                        }}
                        onClick={() => setShowProfileSettings(!showProfileSettings)}
                    >
                        <DollarSign size={20} />
                        Profile Payments
                    </motion.button>
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.addBtn}
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingId(null);
                            setFormData({ name: '', price: '', category: 'Vegetable', description: '', unit: 'kg', image: '' });
                        }}
                    >
                        {showAddForm ? <X size={20} /> : <Plus size={20} />}
                        {showAddForm ? 'Close Portal' : 'List New Produce'}
                    </motion.button>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <StatCard variants={itemVariants} icon={<DollarSign size={28} />} label="Gross Revenue" value={`Rs. ${stats.totalSales.toLocaleString()}`} />
                <StatCard variants={itemVariants} icon={<Package size={28} />} label="Active Stock" value={stats.products.toString()} />
                <StatCard variants={itemVariants} icon={<TrendingUp size={28} />} label="Total Deliveries" value={stats.totalOrders.toString()} />
            </div>

            <div className={styles.mainContent}>
                <motion.div variants={itemVariants} className={styles.cardSection}>
                    <AnimatePresence mode="wait">
                        {showProfileSettings && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={styles.addForm}
                                style={{ borderLeft: '4px solid #0ea5e9' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>
                                        Payment Verification Settings
                                    </h3>
                                    <button onClick={() => setShowProfileSettings(false)} className={styles.actionBtn}>
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formInputs}>
                                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                            Ensure your eSewa QR code is up-to-date to receive P2P payments from the platform.
                                        </p>
                                        <div className={styles.fileUpload} onClick={() => document.getElementById('qr-upload')?.click()}>
                                            <span className={styles.fileLabel} style={{ color: '#0ea5e9' }}>📲 Update eSewa QR</span>
                                            <input
                                                id="qr-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleQrUpload}
                                                className={styles.fileInput}
                                            />
                                        </div>
                                        <button
                                            onClick={handleUpdateProfile}
                                            className={styles.submitBtn}
                                            style={{ marginTop: '1.5rem', background: '#0ea5e9' }}
                                        >
                                            Save Payment Settings
                                        </button>
                                    </div>
                                    <div className={styles.imagePreviewContainer}>
                                        {qrBase64 ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <img src={qrBase64} alt="QR Preview" className={styles.imagePreview} style={{ maxHeight: '150px', objectFit: 'contain' }} />
                                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#0ea5e9' }}>Current/New QR Code</p>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                <TrendingUp size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
                                                <p>No QR Registered</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={styles.addForm}
                            >
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem' }}>
                                    {editingId ? 'Refine Product' : 'Register New Crop'}
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formInputs}>
                                            <input
                                                id="produce-name"
                                                name="name"
                                                type="text"
                                                placeholder="Produce Name"
                                                className={styles.input}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                            <div className={styles.row}>
                                                <input
                                                    id="produce-price"
                                                    name="price"
                                                    type="number"
                                                    placeholder="Price"
                                                    className={styles.input}
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                />
                                                <select
                                                    id="produce-category"
                                                    name="category"
                                                    className={styles.input}
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                                >
                                                    <option value="Vegetable">Vegetable</option>
                                                    <option value="Fruit">Fruit</option>
                                                    <option value="Grain">Grain</option>
                                                </select>
                                            </div>
                                            <input
                                                id="produce-unit"
                                                name="unit"
                                                type="text"
                                                placeholder="Unit (e.g., kg, quintal, crate)"
                                                className={styles.input}
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                required
                                            />
                                            <div className={styles.fileUpload} onClick={() => document.getElementById('file-input')?.click()}>
                                                <span className={styles.fileLabel}>📸 Visual Sample</span>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Upload high-poly photo from your gallery</p>
                                                <input
                                                    id="file-input"
                                                    name="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className={styles.fileInput}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.imagePreviewContainer}>
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className={styles.imagePreview} />
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                    <Plus size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
                                                    <p>Awaiting Media</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <textarea
                                        id="produce-description"
                                        name="description"
                                        placeholder="Detailed Description (Benefits, freshness, location...)"
                                        className={styles.input}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                    />
                                    <button type="submit" className={styles.submitBtn}>
                                        {editingId ? 'Finalize Changes' : 'Launch to Marketplace'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={styles.sectionHeader}>
                        <h2>Inventory Explorer</h2>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Sample</th>
                                    <th>Article</th>
                                    <th>Tier</th>
                                    <th>Value</th>
                                    <th>Offline</th>
                                    <th>Strategy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myProducts.map((product, idx) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <td><img src={product.image} alt={product.name} className={styles.thumb} /></td>
                                        <td><strong>{product.name}</strong></td>
                                        <td><span className={styles.badge}>{product.category}</span></td>
                                        <td>Rs. {product.price} / {product.unit}</td>
                                        <td>
                                            <button
                                                className={`${styles.actionBtn} ${styles.offline}`}
                                                onClick={() => handleOfflineSale(product)}
                                                title="Log Offline Sale"
                                            >
                                                <ShoppingBag size={18} />
                                            </button>
                                        </td>
                                        <td>
                                            <button className={styles.actionBtn} onClick={() => handleEdit(product)}><Edit size={18} /></button>
                                            <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => deleteProduct(product.id)}><Trash2 size={18} /></button>
                                        </td>
                                    </motion.tr>
                                ))}
                                {myProducts.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '5rem' }}>Your digital inventory is empty. Start by listing your crops!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className={styles.analyticsSection}>
                    <h2>Market Velocity</h2>
                    <div className={styles.chartWrapper}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { display: false } },
                                    x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>AI Insight</p>
                        <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.6 }}>
                            Your sales of {myProducts[0]?.name || 'produce'} surged by 12% this week. Consider increasing stock for Saturday's high-demand window.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, variants }: any) => (
    <motion.div variants={variants} className={styles.statCard}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={styles.statInfo}>
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    </motion.div>
);

export default SellerDashboard;
