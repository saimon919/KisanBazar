const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking database at:', dbPath);

db.all('SELECT * FROM orders', [], (err, rows) => {
    if (err) {
        console.error('DATABASE ERROR:', err);
    } else {
        console.log('ORDERS IN DB (count:', rows.length, '):');
        console.log(JSON.stringify(rows, null, 2));
    }
    db.close();
});
