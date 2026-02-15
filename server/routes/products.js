const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { data, error } = await db
            .from('products')
            .select(`
                *,
                users (
                    is_verified
                )
            `);

        if (error) {
            console.error('Fetch products error:', error.message);
            return res.status(500).json({ error: 'Database error' });
        }

        // Map data to match the format expected by the frontend
        const products = data.map(p => ({
            ...p,
            farmer: p.farmer_name,
            isVerified: p.users ? p.users.is_verified : false
        }));

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a product (Authenticated)
router.post('/', auth, async (req, res) => {
    const { name, category, price, unit, image, description } = req.body;
    const productId = Math.random().toString(36).substr(2, 9);

    try {
        const { error } = await db.from('products').insert([{
            id: productId,
            name,
            category,
            price,
            unit,
            image,
            farmer_id: req.user.id,
            farmer_name: req.user.name,
            description
        }]);

        if (error) {
            console.error('Add product error:', error.message);
            return res.status(500).json({ error: 'Failed to add product' });
        }
        res.status(201).json({ id: productId, message: 'Product added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a product (Authenticated)
router.put('/:id', auth, async (req, res) => {
    const { name, category, price, unit, image, description } = req.body;

    try {
        const { error } = await db
            .from('products')
            .update({ name, category, price, unit, image, description })
            .eq('id', req.params.id)
            .eq('farmer_id', req.user.id);

        if (error) {
            console.error('Update product error:', error.message);
            return res.status(500).json({ error: 'Update failed' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a product (Authenticated)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { error } = await db
            .from('products')
            .delete()
            .eq('id', req.params.id)
            .eq('farmer_id', req.user.id);

        if (error) {
            console.error('Delete product error:', error.message);
            return res.status(500).json({ error: 'Delete failed' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
