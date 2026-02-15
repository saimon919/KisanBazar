import requests
import json

base_url = "http://localhost:5000/api/auth"

# 1. Login to get token
login_data = {
    "email": "sunarsaimon355@gmail.com",
    "password": "password123" # Default password in my previous scripts
}

print(f"Attempting login for {login_data['email']}...")
res = requests.post(f"{base_url}/login", json=login_data)
if res.status_code != 200:
    print(f"Login failed: {res.status_code} - {res.text}")
    exit()

token = res.json().get('token')
print("Login successful. Token acquired.")

# 2. Fetch orders
headers = {"x-auth-token": token}
print("Fetching orders...")
res = requests.get(f"{base_url}/my-orders", headers=headers)
print(f"Status: {res.status_code}")
print(f"Response: {res.text}")

# 3. Verify token
print("Verifying token...")
res = requests.get(f"{base_url}/verify-token", headers=headers)
print(f"Status: {res.status_code}")
print(f"Response: {res.text}")
