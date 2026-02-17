-- ==========================================
-- 1. DISTRICTS TABLE (Locations in Ankara)
-- ==========================================
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- 2. USERS TABLE (Authentication)
-- ==========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Passwords must be encrypted (hashed)
    role VARCHAR(20) DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. SPOTS TABLE (Cafes, Libraries, Study Areas)
-- ==========================================
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    address TEXT,
    google_maps_link TEXT, -- Direct link to open Google Maps
    
    -- GPS Coordinates (Latitude & Longitude)
    -- Required for placing pins on the interactive map
    latitude DECIMAL(10, 8),  
    longitude DECIMAL(11, 8), 
    
    -- Filtering Criteria
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5), -- 5 = Excellent Internet
    quiet_rating INTEGER CHECK (quiet_rating BETWEEN 1 AND 5), -- 5 = Very Silent
    outlet_availability BOOLEAN DEFAULT FALSE, -- Are power outlets available?
    has_food BOOLEAN DEFAULT FALSE, -- Is food/coffee available?
    
    -- Moderation (Admin Control)
    -- is_approved = FALSE means the spot is suggested by a user and needs admin approval
    is_approved BOOLEAN DEFAULT TRUE, 
    suggested_by INTEGER REFERENCES users(id) ON DELETE SET NULL, 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. REVIEWS TABLE (User Ratings & Comments)
-- ==========================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    spot_id INTEGER REFERENCES spots(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT, -- Users leave their descriptions here
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, spot_id) -- Prevents spam: One review per user per spot
);

-- ==========================================
-- SEED DATA (REAL ANKARA LOCATIONS)
-- ==========================================

-- 1. Clean old data to prevent duplicates (Hard Reset)
TRUNCATE TABLE reviews, spots, users, districts RESTART IDENTITY CASCADE;

-- 2. Insert Districts
INSERT INTO districts (name) VALUES 
('Çankaya'),       -- ID 1
('Yenimahalle'),   -- ID 2
('Keçiören'),      -- ID 3
('Gölbaşı'),       -- ID 4
('Etimesgut'),     -- ID 5
('Altındağ');      -- ID 6

-- 3. Insert Admin User (Test Admin)
INSERT INTO users (username, email, password_hash, role) 
VALUES 
('admin_123', 's00604962@gmail.com', 'puffgirls', 'admin');

-- 4. Insert Real Spots (Name, Address, Link, Coordinates, Filters)
INSERT INTO spots (name, district_id, address, google_maps_link, latitude, longitude, wifi_rating, quiet_rating, outlet_availability, has_food, is_approved) 
VALUES 
-- ÇANKAYA (ID 1)
(
 'Milli Kütüphane (National Library)', 1, 
 'Bahçelievler, İsmet İnönü Blv. No:4', 
 'https://www.google.com/maps/search/Milli+Kütüphane+Ankara', 
 39.9198, 32.8335, -- Map Pin
 4, 5, TRUE, FALSE, TRUE
),
(
 'Adnan Ötüken İl Halk Kütüphanesi', 1, 
 'Kızılay, Kumrular Cd. No:3', 
 'https://www.google.com/maps/search/Adnan+Ötüken+İl+Halk+Kütüphanesi', 
 39.9185, 32.8524, -- Map Pin
 3, 5, TRUE, FALSE, TRUE
),
(
 'Coffee Lab (Bahçelievler 7.Cadde)', 1, 
 'Bahçelievler, Aşkabat Cd. No:23', 
 'https://www.google.com/maps/search/Coffee+Lab+Bahçelievler+Ankara', 
 39.9234, 32.8256, -- Map Pin
 5, 2, TRUE, TRUE, TRUE
),
(
 'Workinton (Söğütözü)', 1, 
 'Söğütözü, Koç Kuleleri', 
 'https://www.google.com/maps/search/Workinton+Söğütözü+Ankara', 
 39.9085, 32.8095, -- Map Pin
 5, 4, TRUE, TRUE, TRUE
),

-- YENİMAHALLE (ID 2)
(
 'Cumhurbaşkanlığı Millet Kütüphanesi', 2, 
 'Cumhurbaşkanlığı Külliyesi', 
 'https://www.google.com/maps/search/Cumhurbaşkanlığı+Millet+Kütüphanesi', 
 39.9312, 32.7987, -- Map Pin
 5, 5, TRUE, TRUE, TRUE
),
(
 'Starbucks (Atlantis AVM)', 2, 
 'Batıkent, Atlantis AVM', 
 'https://www.google.com/maps/search/Starbucks+Atlantis+AVM+Ankara', 
 39.9578, 32.7541, -- Map Pin
 4, 2, TRUE, TRUE, TRUE
),

-- GÖLBAŞI (ID 4)
(
 'Arabica Coffee House (Gölbaşı)', 4, 
 'Bahçelievler Mah. 285. Sk.', 
 'https://www.google.com/maps/search/Arabica+Coffee+House+Gölbaşı', 
 39.7895, 32.8012, -- Map Pin
 4, 3, TRUE, TRUE, TRUE
),
(
 'Mogan Parkı (Study Area)', 4, 
 'Karşıyaka, Haymana Yolu Blv.', 
 'https://www.google.com/maps/search/Mogan+Parkı+Gölbaşı', 
 39.7820, 32.7950, -- Map Pin
 2, 4, FALSE, TRUE, TRUE
);