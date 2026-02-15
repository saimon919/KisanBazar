import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function resetPassword() {
    const email = 'sunarsaimon355@gmail.com';
    const newPassword = 'password123';
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], function (err) {
            if (err) {
                console.error('Error resetting password:', err.message);
            } else if (this.changes > 0) {
                console.log(`Password reset for ${email} to 'password123'`);
            } else {
                console.log(`User ${email} not found`);
            }
            db.close();
        });
    } catch (e) {
        console.error('Hashing failed:', e);
        db.close();
    }
}

resetPassword();
