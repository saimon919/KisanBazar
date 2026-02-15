import sqlite3
import json
import os

db_path = os.path.join('server', 'database.sqlite')

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute("SELECT id, name FROM users")
    users = {row['id']: row['name'] for row in cursor.fetchall()}
    
    # Get all orders
    cursor.execute("SELECT id, buyer_id FROM orders")
    orders = cursor.fetchall()
    
    print("\n--- ORDER ANALYSIS ---")
    for order in orders:
        bid = order['buyer_id']
        bname = users.get(bid, "UNKNOWN USER")
        print(f"Order: {order['id']} | Buyer ID: {bid} | Buyer Name: {bname}")
    
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
