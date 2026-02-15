const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const targetEmail = 'sunarsaimon.43244@gmail.com';

db.run("UPDATE users SET role = 'admin' WHERE email = ?", [targetEmail], function (err) {
    if (err) {
        console.error('Error updating role:', err.message);
    } else if (this.changes > 0) {
        console.log(`Successfully promoted ${targetEmail} to admin.`);
    } else {
        console.log(`User ${targetEmail} not found.`);
    }
    db.close();
});
