-- 1. Districts Table (Locations in Ankara)
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users Table - For authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Passwords must be stored as hashes!
    role VARCHAR(20) DEFAULT 'user' -- 'admin' or 'user'
);

-- 3. Spots Table - Cafes, Libraries, Coworking spaces
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id),
    address TEXT,
    google_maps_link TEXT, -- Direct link to open Google Maps
    
    -- Filtering Criteria
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5), -- 5 = Excellent internet
    quiet_rating INTEGER CHECK (quiet_rating BETWEEN 1 AND 5), -- 5 = Very quiet
    outlet_availability BOOLEAN DEFAULT FALSE, -- Power outlets available?
    has_food BOOLEAN DEFAULT FALSE, -- Food/Snacks available?
    
    -- Moderation (Important for Sprint 6!)
    is_approved BOOLEAN DEFAULT TRUE, -- TRUE = Added by admins, FALSE = Suggested by user (pending approval)
    suggested_by INTEGER REFERENCES users(id) -- ID of the user who suggested the spot
);

-- 4. Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    spot_id INTEGER REFERENCES spots(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Initial test data)
INSERT INTO districts (name) VALUES ('Çankaya'), ('Yenimahalle'), ('Balgat'), ('Bahçelievler');

INSERT INTO spots (name, district_id, wifi_rating, quiet_rating, outlet_availability, has_food, is_approved) 
VALUES 
('Coffee Lab Balgat', 3, 5, 3, TRUE, TRUE, TRUE),
('Milli Kütüphane', 1, 4, 5, TRUE, FALSE, TRUE);