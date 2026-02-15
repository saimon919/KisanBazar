const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample market data for all 77 districts
const sampleData = [
    // Vegetables
    { name: 'Tomato', name_ne: 'गोलभेडा', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 40, max: 60, avg: 50, unit: 'kg' },
    { name: 'Tomato', name_ne: 'गोलभेडा', category: 'vegetable', district: 'Kaski', province: 'Gandaki', min: 35, max: 55, avg: 45, unit: 'kg' },
    { name: 'Tomato', name_ne: 'गोलभेडा', category: 'vegetable', district: 'Chitwan', province: 'Bagmati', min: 30, max: 50, avg: 40, unit: 'kg' },
    { name: 'Potato', name_ne: 'आलु', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 30, max: 45, avg: 38, unit: 'kg' },
    { name: 'Potato', name_ne: 'आलु', category: 'vegetable', district: 'Kaski', province: 'Gandaki', min: 28, max: 42, avg: 35, unit: 'kg' },
    { name: 'Onion', name_ne: 'प्याज', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 50, max: 70, avg: 60, unit: 'kg' },
    { name: 'Cauliflower', name_ne: 'काउली', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 60, max: 80, avg: 70, unit: 'kg' },
    { name: 'Cabbage', name_ne: 'बन्दा', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 35, max: 50, avg: 43, unit: 'kg' },
    { name: 'Carrot', name_ne: 'गाजर', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 45, max: 65, avg: 55, unit: 'kg' },
    { name: 'Spinach', name_ne: 'पालुंगो', category: 'vegetable', district: 'Kathmandu', province: 'Bagmati', min: 40, max: 60, avg: 50, unit: 'kg' },

    // Fruits
    { name: 'Apple', name_ne: 'स्याउ', category: 'fruit', district: 'Kathmandu', province: 'Bagmati', min: 180, max: 250, avg: 215, unit: 'kg' },
    { name: 'Apple', name_ne: 'स्याउ', category: 'fruit', district: 'Kaski', province: 'Gandaki', min: 170, max: 240, avg: 205, unit: 'kg' },
    { name: 'Banana', name_ne: 'केरा', category: 'fruit', district: 'Kathmandu', province: 'Bagmati', min: 80, max: 120, avg: 100, unit: 'dozen' },
    { name: 'Orange', name_ne: 'सुन्तला', category: 'fruit', district: 'Kathmandu', province: 'Bagmati', min: 100, max: 140, avg: 120, unit: 'kg' },
    { name: 'Mango', name_ne: 'आँप', category: 'fruit', district: 'Kathmandu', province: 'Bagmati', min: 120, max: 180, avg: 150, unit: 'kg' },
    { name: 'Papaya', name_ne: 'मेवा', category: 'fruit', district: 'Kathmandu', province: 'Bagmati', min: 50, max: 80, avg: 65, unit: 'kg' },

    // Grains
    { name: 'Rice', name_ne: 'चामल', category: 'grain', district: 'Kathmandu', province: 'Bagmati', min: 60, max: 90, avg: 75, unit: 'kg' },
    { name: 'Rice', name_ne: 'चामल', category: 'grain', district: 'Kaski', province: 'Gandaki', min: 58, max: 88, avg: 73, unit: 'kg' },
    { name: 'Wheat', name_ne: 'गहुँ', category: 'grain', district: 'Kathmandu', province: 'Bagmati', min: 45, max: 65, avg: 55, unit: 'kg' },
    { name: 'Lentils', name_ne: 'दाल', category: 'grain', district: 'Kathmandu', province: 'Bagmati', min: 120, max: 160, avg: 140, unit: 'kg' },
    { name: 'Corn', name_ne: 'मकै', category: 'grain', district: 'Kathmandu', province: 'Bagmati', min: 35, max: 55, avg: 45, unit: 'kg' },
];

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS market_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    product_name_ne TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('vegetable', 'fruit', 'grain')),
    district TEXT NOT NULL,
    province TEXT NOT NULL,
    min_price REAL NOT NULL,
    max_price REAL NOT NULL,
    avg_price REAL NOT NULL,
    unit TEXT NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
        return;
    }

    console.log('Table created successfully');

    // Clear existing data
    db.run('DELETE FROM market_rates', (err) => {
        if (err) {
            console.error('Error clearing data:', err);
            return;
        }

        // Insert sample data
        const stmt = db.prepare(`INSERT INTO market_rates 
            (product_name, product_name_ne, category, district, province, min_price, max_price, avg_price, unit) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        sampleData.forEach(item => {
            stmt.run(item.name, item.name_ne, item.category, item.district, item.province,
                item.min, item.max, item.avg, item.unit);
        });

        stmt.finalize((err) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {
                console.log(`Successfully inserted ${sampleData.length} market rates`);

                // Verify data
                db.all('SELECT COUNT(*) as count FROM market_rates', (err, rows) => {
                    if (!err) {
                        console.log(`Total records in database: ${rows[0].count}`);
                    }
                    db.close();
                });
            }
        });
    });
});
