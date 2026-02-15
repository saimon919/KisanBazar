const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role, phone, farm_location, citizenship_doc, payment_qr } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Math.random().toString(36).substr(2, 9);

        const { error } = await db.from('users').insert([{
            id: userId,
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            farm_location,
            citizenship_doc,
            payment_qr,
            is_verified: false
        }]);

        if (error) {
            console.error('Registration error:', error.message);
            return res.status(400).json({ error: 'Email already exists or invalid data' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await db
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify a farmer (Admin Only)
router.put('/verify/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized. Admin only.' });
    }

    const { is_verified } = req.body;
    const { error } = await db
        .from('users')
        .update({ is_verified })
        .eq('id', req.params.id);

    if (error) {
        return res.status(500).json({ error: 'Verification update failed' });
    }
    res.json({ message: 'Farmer verification status updated' });
});

// Get unverified farmers (Admin Only)
router.get('/unverified', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized.' });
    }

    const { data, error } = await db
        .from('users')
        .select('id, name, email, phone, farm_location, citizenship_doc, payment_qr, is_verified')
        .eq('role', 'farmer');

    if (error) {
        return res.status(500).json({ error: 'Database error' });
    }
    res.json(data);
});

// Get all users (Admin Only)
router.get('/all-users', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized.' });
    }

    const { data, error } = await db
        .from('users')
        .select('id, name, email, role, phone, farm_location, payment_qr, is_verified');

    if (error) {
        return res.status(500).json({ error: 'Database error' });
    }
    res.json(data);
});

// Admin Reset User Password
router.put('/reset-password/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized.' });
    }

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { error } = await db
            .from('users')
            .update({ password: hashedPassword })
            .eq('id', req.params.id);

        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new order
router.post('/orders', auth, async (req, res) => {
    const { items, total } = req.body;
    const buyer_id = req.user.id;
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const { error } = await db.from('orders').insert([{
        id: orderId,
        buyer_id,
        total,
        items, // items is already JSON object if sent correctly
        status: 'pending',
        payment_status: 'pending'
    }]);

    if (error) {
        console.error('Order creation error:', error.message);
        return res.status(500).json({ error: 'Failed to create order' });
    }
    res.status(201).json({ id: orderId, message: 'Order created successfully' });
});

// Get orders for the logged-in user
router.get('/my-orders', auth, async (req, res) => {
    const { data, error } = await db
        .from('orders')
        .select('*')
        .eq('buyer_id', req.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[MY-ORDERS] Database error:', error.message);
        return res.status(500).json({ error: 'Database error while fetching orders' });
    }
    res.json(data);
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    const { payment_qr } = req.body;
    const userId = req.user.id;

    try {
        const { error: updateError } = await db
            .from('users')
            .update({ payment_qr })
            .eq('id', userId);

        if (updateError) {
            console.error('Profile update error:', updateError.message);
            return res.status(500).json({ error: 'Failed to update profile' });
        }

        // Fetch updated user to return
        const { data: user, error: fetchError } = await db
            .from('users')
            .select('id, name, email, role, phone, farm_location, payment_qr, is_verified')
            .eq('id', userId)
            .single();

        if (fetchError) return res.status(500).json({ error: 'Error fetching updated user' });
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Debug route to verify token
router.get('/verify-token', auth, (req, res) => {
    res.json({ valid: true, user: req.user });
});

module.exports = router;
