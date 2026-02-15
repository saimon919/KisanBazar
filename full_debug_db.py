import sqlite3
import json
import os

db_path = os.path.join('server', 'database.sqlite')

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute("SELECT id, name, role, email FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    print("\n--- USERS ---")
    print(json.dumps(users, indent=2))
    
    # Get all orders
    cursor.execute("SELECT id, buyer_id, total, status, payment_status, created_at FROM orders")
    orders = [dict(row) for row in cursor.fetchall()]
    print("\n--- ORDERS ---")
    print(json.dumps(orders, indent=2))
    
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
