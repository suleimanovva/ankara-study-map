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
    password_hash TEXT NOT NULL, -- Passwords must be encrypted
    role VARCHAR(20) DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. SPOTS TABLE (Cafes, Libraries)
-- ==========================================
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    address TEXT,
    google_maps_link TEXT, -- Direct link to open Google Maps
    
    -- Filtering Criteria
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5), -- 5 = Excellent
    quiet_rating INTEGER CHECK (quiet_rating BETWEEN 1 AND 5), -- 5 = Silent
    outlet_availability BOOLEAN DEFAULT FALSE, -- Power outlets?
    has_food BOOLEAN DEFAULT FALSE, -- Food/Snacks?
    
    -- Moderation (Admin Control)
    is_approved BOOLEAN DEFAULT TRUE, -- TRUE = Visible on site, FALSE = Pending approval
    suggested_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Who suggested this spot
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. REVIEWS TABLE (User Ratings)
-- ==========================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    spot_id INTEGER REFERENCES spots(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, spot_id) -- One review per user per spot
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
('admin_nigara', 'nigara@ankaramap.com', 'hashed_secret_password', 'admin');

-- -- 4. Insert Real Spots (С РАБОЧИМИ ССЫЛКАМИ)
INSERT INTO spots (name, district_id, address, google_maps_link, wifi_rating, quiet_rating, outlet_availability, has_food, is_approved) 
VALUES 
-- ÇANKAYA (ID 1)
('Milli Kütüphane (National Library)', 1, 'Bahçelievler, İsmet İnönü Blv. No:4', 'https://www.google.com/maps/search/Milli+Kütüphane+Ankara', 4, 5, TRUE, FALSE, TRUE),
('Adnan Ötüken İl Halk Kütüphanesi', 1, 'Kızılay, Kumrular Cd. No:3', 'https://www.google.com/maps/search/Adnan+Ötüken+İl+Halk+Kütüphanesi', 3, 5, TRUE, FALSE, TRUE),
('Coffee Lab (Bahçelievler 7.Cadde)', 1, 'Bahçelievler, Aşkabat Cd. No:23', 'https://www.google.com/maps/search/Coffee+Lab+Bahçelievler+Ankara', 5, 2, TRUE, TRUE, TRUE),
('Kanta Coffee (Tunalı)', 1, 'Barbaros, Tunalı Hilmi Cd. No:88', 'https://www.google.com/maps/search/Kanta+Coffee+Tunalı+Ankara', 4, 3, TRUE, TRUE, TRUE),
('Workinton (Söğütözü)', 1, 'Söğütözü, Koç Kuleleri', 'https://www.google.com/maps/search/Workinton+Söğütözü+Ankara', 5, 4, TRUE, TRUE, TRUE),

-- YENİMAHALLE (ID 2)
('Cumhurbaşkanlığı Millet Kütüphanesi', 2, 'Cumhurbaşkanlığı Külliyesi', 'https://www.google.com/maps/search/Cumhurbaşkanlığı+Millet+Kütüphanesi', 5, 5, TRUE, TRUE, TRUE),
('Starbucks (Atlantis AVM)', 2, 'Batıkent, Atlantis AVM', 'https://www.google.com/maps/search/Starbucks+Atlantis+AVM+Ankara', 4, 2, TRUE, TRUE, TRUE),

-- GÖLBAŞI (ID 4)
('Arabica Coffee House (Gölbaşı)', 4, 'Bahçelievler Mah. 285. Sk.', 'https://www.google.com/maps/search/Arabica+Coffee+House+Gölbaşı', 4, 3, TRUE, TRUE, TRUE),
('Mogan Parkı (Study Area)', 4, 'Karşıyaka, Haymana Yolu Blv.', 'https://www.google.com/maps/search/Mogan+Parkı+Gölbaşı', 2, 4, FALSE, TRUE, TRUE);