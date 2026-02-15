const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all market rates with optional filters
router.get('/', async (req, res) => {
    const { category, district, province, limit = 100 } = req.query;

    try {
        let query = db.from('market_rates').select('*');

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        if (district && district !== 'all') {
            query = query.eq('district', district);
        }

        if (province && province !== 'all') {
            query = query.eq('province', province);
        }

        const { data, error } = await query
            .order('product_name', { ascending: true })
            .limit(parseInt(limit));

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET market rates by category
router.get('/category/:category', async (req, res) => {
    const { category } = req.params;
    const { district, limit = 100 } = req.query;

    try {
        let query = db.from('market_rates').select('*').eq('category', category);

        if (district && district !== 'all') {
            query = query.eq('district', district);
        }

        const { data, error } = await query
            .order('product_name', { ascending: true })
            .limit(parseInt(limit));

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Search market rates
router.get('/search/:query', async (req, res) => {
    const { query: searchQuery } = req.params;
    const { category, district, limit = 50 } = req.query;

    try {
        let query = db.from('market_rates').select('*').or(`product_name.ilike.%${searchQuery}%,product_name_ne.ilike.%${searchQuery}%`);

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        if (district && district !== 'all') {
            query = query.eq('district', district);
        }

        const { data, error } = await query
            .order('product_name', { ascending: true })
            .limit(parseInt(limit));

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET market rates by district
router.get('/district/:district', async (req, res) => {
    const { district } = req.params;
    const { category, limit = 100 } = req.query;

    try {
        let query = db.from('market_rates').select('*').eq('district', district);

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query
            .order('product_name', { ascending: true })
            .limit(parseInt(limit));

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all districts
router.get('/districts', async (req, res) => {
    try {
        const { data, error } = await db
            .from('market_rates')
            .select('district, province')
            // Supabase doesn't have a direct 'DISTINCT' on select like SQL, 
            // but we can use RPC or handle it in JS for small sets.
            // For production, a view for unique districts is better.
            .order('province', { ascending: true });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Handle unique districts manually for now
        const uniqueDistricts = Array.from(new Set(data.map(d => JSON.stringify(d)))).map(s => JSON.parse(s));
        res.json(uniqueDistricts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
