const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Submit payment proof for an order
router.post('/submit', auth, async (req, res) => {
    const { orderId, screenshot } = req.body;

    if (!orderId || !screenshot) {
        return res.status(400).json({ error: 'Order ID and screenshot are required' });
    }

    try {
        const { error } = await db
            .from('orders')
            .update({
                payment_screenshot: screenshot,
                payment_status: 'pending'
            })
            .eq('id', orderId)
            .eq('buyer_id', req.user.id);

        if (error) {
            console.error('Payment submission error:', error.message);
            return res.status(500).json({ error: 'Failed to submit payment proof' });
        }
        res.json({ message: 'Payment proof submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Get all pending payments
router.get('/pending', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized. Admin only.' });
    }

    try {
        const { data, error } = await db
            .from('orders')
            .select(`
                *,
                users (
                    name,
                    email
                )
            `)
            .eq('payment_status', 'pending')
            .not('payment_screenshot', 'is', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch pending payments error:', error.message);
            return res.status(500).json({ error: 'Database error' });
        }

        // Map data to match the format expected by the frontend
        const payments = data.map(o => ({
            ...o,
            buyer_name: o.users ? o.users.name : 'Unknown',
            buyer_email: o.users ? o.users.email : 'Unknown'
        }));

        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Verify payment (Approve/Reject)
router.put('/verify/:orderId', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized. Admin only.' });
    }

    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const orderStatus = status === 'approved' ? 'paid' : 'payment_failed';

    try {
        const { error } = await db
            .from('orders')
            .update({
                payment_status: status,
                status: orderStatus
            })
            .eq('id', req.params.orderId);

        if (error) {
            console.error('Verify payment error:', error.message);
            return res.status(500).json({ error: 'Update failed' });
        }

        res.json({ message: `Payment ${status} successfully` });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
