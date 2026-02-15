-- Create market_rates table for tracking live prices across all Nepal districts
CREATE TABLE IF NOT EXISTS market_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    product_name_ne TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('vegetable', 'fruit', 'grain')),
    district TEXT NOT NULL,
    province TEXT NOT NULL,
    min_price REAL NOT NULL,
    max_price REAL NOT NULL,
    avg_price REAL NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_category ON market_rates(category);
CREATE INDEX IF NOT EXISTS idx_district ON market_rates(district);
CREATE INDEX IF NOT EXISTS idx_province ON market_rates(province);
CREATE INDEX IF NOT EXISTS idx_product_name ON market_rates(product_name);
CREATE INDEX IF NOT EXISTS idx_last_updated ON market_rates(last_updated);

-- Insert sample data for major districts (Kathmandu, Pokhara, Bharatpur, Lalitpur, Biratnagar)
-- Vegetables
INSERT INTO market_rates (product_name, product_name_ne, category, district, province, min_price, max_price, avg_price, unit) VALUES
('Tomato', 'गोलभेडा', 'vegetable', 'Kathmandu', 'Bagmati', 40, 60, 50, 'kg'),
('Tomato', 'गोलभेडा', 'vegetable', 'Kaski', 'Gandaki', 35, 55, 45, 'kg'),
('Tomato', 'गोलभेडा', 'vegetable', 'Chitwan', 'Bagmati', 30, 50, 40, 'kg'),
('Tomato', 'गोलभेडा', 'vegetable', 'Lalitpur', 'Bagmati', 42, 62, 52, 'kg'),
('Tomato', 'गोलभेडा', 'vegetable', 'Morang', 'Koshi', 38, 58, 48, 'kg'),

('Potato', 'आलु', 'vegetable', 'Kathmandu', 'Bagmati', 30, 45, 38, 'kg'),
('Potato', 'आलु', 'vegetable', 'Kaski', 'Gandaki', 28, 42, 35, 'kg'),
('Potato', 'आलु', 'vegetable', 'Chitwan', 'Bagmati', 25, 40, 33, 'kg'),
('Potato', 'आलु', 'vegetable', 'Lalitpur', 'Bagmati', 32, 47, 40, 'kg'),
('Potato', 'आलु', 'vegetable', 'Morang', 'Koshi', 29, 44, 37, 'kg'),

('Onion', 'प्याज', 'vegetable', 'Kathmandu', 'Bagmati', 50, 70, 60, 'kg'),
('Onion', 'प्याज', 'vegetable', 'Kaski', 'Gandaki', 48, 68, 58, 'kg'),
('Onion', 'प्याज', 'vegetable', 'Chitwan', 'Bagmati', 45, 65, 55, 'kg'),
('Onion', 'प्याज', 'vegetable', 'Lalitpur', 'Bagmati', 52, 72, 62, 'kg'),
('Onion', 'प्याज', 'vegetable', 'Morang', 'Koshi', 49, 69, 59, 'kg'),

('Cauliflower', 'काउली', 'vegetable', 'Kathmandu', 'Bagmati', 60, 80, 70, 'kg'),
('Cauliflower', 'काउली', 'vegetable', 'Kaski', 'Gandaki', 55, 75, 65, 'kg'),
('Cauliflower', 'काउली', 'vegetable', 'Chitwan', 'Bagmati', 50, 70, 60, 'kg'),
('Cauliflower', 'काउली', 'vegetable', 'Lalitpur', 'Bagmati', 62, 82, 72, 'kg'),
('Cauliflower', 'काउली', 'vegetable', 'Morang', 'Koshi', 58, 78, 68, 'kg'),

('Cabbage', 'बन्दा', 'vegetable', 'Kathmandu', 'Bagmati', 35, 50, 43, 'kg'),
('Cabbage', 'बन्दा', 'vegetable', 'Kaski', 'Gandaki', 32, 47, 40, 'kg'),
('Cabbage', 'बन्दा', 'vegetable', 'Chitwan', 'Bagmati', 30, 45, 38, 'kg'),
('Cabbage', 'बन्दा', 'vegetable', 'Lalitpur', 'Bagmati', 37, 52, 45, 'kg'),
('Cabbage', 'बन्दा', 'vegetable', 'Morang', 'Koshi', 34, 49, 42, 'kg'),

-- Fruits
('Apple', 'स्याउ', 'fruit', 'Kathmandu', 'Bagmati', 180, 250, 215, 'kg'),
('Apple', 'स्याउ', 'fruit', 'Kaski', 'Gandaki', 170, 240, 205, 'kg'),
('Apple', 'स्याउ', 'fruit', 'Chitwan', 'Bagmati', 175, 245, 210, 'kg'),
('Apple', 'स्याउ', 'fruit', 'Lalitpur', 'Bagmati', 185, 255, 220, 'kg'),
('Apple', 'स्याउ', 'fruit', 'Morang', 'Koshi', 178, 248, 213, 'kg'),

('Banana', 'केरा', 'fruit', 'Kathmandu', 'Bagmati', 80, 120, 100, 'dozen'),
('Banana', 'केरा', 'fruit', 'Kaski', 'Gandaki', 75, 115, 95, 'dozen'),
('Banana', 'केरा', 'fruit', 'Chitwan', 'Bagmati', 70, 110, 90, 'dozen'),
('Banana', 'केरा', 'fruit', 'Lalitpur', 'Bagmati', 82, 122, 102, 'dozen'),
('Banana', 'केरा', 'fruit', 'Morang', 'Koshi', 78, 118, 98, 'dozen'),

('Orange', 'सुन्तला', 'fruit', 'Kathmandu', 'Bagmati', 100, 140, 120, 'kg'),
('Orange', 'सुन्तला', 'fruit', 'Kaski', 'Gandaki', 95, 135, 115, 'kg'),
('Orange', 'सुन्तला', 'fruit', 'Chitwan', 'Bagmati', 90, 130, 110, 'kg'),
('Orange', 'सुन्तला', 'fruit', 'Lalitpur', 'Bagmati', 102, 142, 122, 'kg'),
('Orange', 'सुन्तला', 'fruit', 'Morang', 'Koshi', 98, 138, 118, 'kg'),

-- Grains
('Rice', 'चामल', 'grain', 'Kathmandu', 'Bagmati', 60, 90, 75, 'kg'),
('Rice', 'चामल', 'grain', 'Kaski', 'Gandaki', 58, 88, 73, 'kg'),
('Rice', 'चामल', 'grain', 'Chitwan', 'Bagmati', 55, 85, 70, 'kg'),
('Rice', 'चामल', 'grain', 'Lalitpur', 'Bagmati', 62, 92, 77, 'kg'),
('Rice', 'चामल', 'grain', 'Morang', 'Koshi', 59, 89, 74, 'kg'),

('Wheat', 'गहुँ', 'grain', 'Kathmandu', 'Bagmati', 45, 65, 55, 'kg'),
('Wheat', 'गहुँ', 'grain', 'Kaski', 'Gandaki', 43, 63, 53, 'kg'),
('Wheat', 'गहुँ', 'grain', 'Chitwan', 'Bagmati', 40, 60, 50, 'kg'),
('Wheat', 'गहुँ', 'grain', 'Lalitpur', 'Bagmati', 47, 67, 57, 'kg'),
('Wheat', 'गहुँ', 'grain', 'Morang', 'Koshi', 44, 64, 54, 'kg'),

('Lentils', 'दाल', 'grain', 'Kathmandu', 'Bagmati', 120, 160, 140, 'kg'),
('Lentils', 'दाल', 'grain', 'Kaski', 'Gandaki', 115, 155, 135, 'kg'),
('Lentils', 'दाल', 'grain', 'Chitwan', 'Bagmati', 110, 150, 130, 'kg'),
('Lentils', 'दाल', 'grain', 'Lalitpur', 'Bagmati', 122, 162, 142, 'kg'),
('Lentils', 'दाल', 'grain', 'Morang', 'Koshi', 118, 158, 138, 'kg');
