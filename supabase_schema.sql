-- KisanBazaar Supabase Schema (PostgreSQL)

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Using TEXT to maintain compatibility with existing frontend ID generation
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    phone TEXT,
    farm_location TEXT,
    citizenship_doc TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    latitude FLOAT8,
    longitude FLOAT8,
    payment_qr TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price FLOAT8 NOT NULL,
    unit TEXT NOT NULL,
    image TEXT,
    farmer_id TEXT REFERENCES users(id),
    farmer_name TEXT,
    description TEXT,
    harvest_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT REFERENCES users(id),
    total FLOAT8 NOT NULL,
    items JSONB, -- Storing as JSONB for better query performance
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_screenshot TEXT,
    is_offline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HELPER: Policy for public access (optional, depending on use case)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Access" ON products FOR SELECT USING (true);
