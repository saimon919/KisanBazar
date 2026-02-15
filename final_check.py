import sqlite3
import json
import os

db_path = os.path.join('server', 'database.sqlite')

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, email, role FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    print("\nALL USERS:")
    print(json.dumps(users, indent=2))
    
    cursor.execute("SELECT id, buyer_id, total, status FROM orders")
    orders = [dict(row) for row in cursor.fetchall()]
    print("\nALL ORDERS:")
    print(json.dumps(orders, indent=2))
    
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
