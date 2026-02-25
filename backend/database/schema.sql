-- ==========================================
-- 1. DISTRICTS TABLE (Locations in Ankara)
-- ==========================================
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN DEFAULT FALSE -- Soft delete flag for professional data management
);

-- ==========================================
-- 2. USERS TABLE (Authentication)
-- ==========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    role VARCHAR(20) DEFAULT 'user', -- 'admin' or 'user' roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 3. SPOTS TABLE (Curated Study Cafes & Libraries)
-- ==========================================
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    address TEXT,
    google_maps_link TEXT, -- Official Google Maps Search API links
    
    latitude DECIMAL(10, 8),  -- High-precision GPS coordinates
    longitude DECIMAL(11, 8), 
    
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5), -- 5 = Excellent Internet
    quiet_rating INTEGER CHECK (quiet_rating BETWEEN 1 AND 5), -- 5 = Very Silent
    outlet_availability BOOLEAN DEFAULT FALSE, -- True if power outlets are accessible
    has_food BOOLEAN DEFAULT FALSE, -- True if food or snacks are available
    
    is_approved BOOLEAN DEFAULT TRUE, 
    suggested_by INTEGER REFERENCES users(id) ON DELETE SET NULL, 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Performance indexes for faster database querying
CREATE INDEX idx_spots_district ON spots(district_id);
CREATE INDEX idx_spots_active ON spots(is_deleted, is_approved);

-- ==========================================
-- 4. REVIEWS TABLE (User Ratings & Comments)
-- ==========================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    spot_id INTEGER REFERENCES spots(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, spot_id) -- Prevents multiple reviews from the same user for the same spot
);

-- ==========================================
-- SEED DATA (ACCURATE ANKARA LOCATIONS)
-- ==========================================

-- 1. Clean existing data to prevent ID conflicts
TRUNCATE TABLE reviews, spots, users, districts RESTART IDENTITY CASCADE;

-- 2. Insert main districts
INSERT INTO districts (name) VALUES 
('Çankaya'), ('Yenimahalle'), ('Keçiören'), ('Gölbaşı'), 
('Etimesgut'), ('Altındağ'), ('Mamak'), ('Sincan'), ('Pursaklar');

-- 3. Insert system admin user
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin_123', 's00604962@gmail.com', 'hashed_password_placeholder', 'admin');

-- 4. Insert 20 verified study spots with exact GPS pins
INSERT INTO spots (name, district_id, address, google_maps_link, latitude, longitude, wifi_rating, quiet_rating, outlet_availability, has_food, is_approved) 
VALUES 

-- ÇANKAYA
('Milli Kütüphane (National Library)', 1, 'Bahçelievler, İsmet İnönü Blv.', 'https://www.google.com/maps/search/?api=1&query=Milli+Kutuphane+Ankara', 39.91842000, 32.82864000, 4, 5, TRUE, FALSE, TRUE),
('Coffee Lab (7. Cadde Study Cafe)', 1, 'Bahçelievler, Aşkabat Cd. No:23', 'https://www.google.com/maps/search/?api=1&query=Coffee+Lab+7.Cadde+Ankara', 39.92201000, 32.82553000, 5, 3, TRUE, TRUE, TRUE),
('EspressoLab (Tunalı)', 1, 'Kavaklıdere, Tunalı Hilmi Cd.', 'https://www.google.com/maps/search/?api=1&query=EspressoLab+Tunali+Ankara', 39.90251000, 32.85902000, 5, 3, TRUE, TRUE, TRUE),
('Workinton (Söğütözü Coworking)', 1, 'Söğütözü, Koç Kuleleri', 'https://www.google.com/maps/search/?api=1&query=Workinton+Sogutozu+Ankara', 39.91152000, 32.81084000, 5, 4, TRUE, TRUE, TRUE),
('Federal Coffee Company', 1, 'Kavaklıdere, Tunalı Hilmi Cd.', 'https://www.google.com/maps/search/?api=1&query=Federal+Coffee+Tunali+Ankara', 39.90543000, 32.86015000, 4, 3, TRUE, TRUE, TRUE),

-- YENİMAHALLE
('Cumhurbaşkanlığı Millet Kütüphanesi', 2, 'Cumhurbaşkanlığı Külliyesi', 'https://www.google.com/maps/search/?api=1&query=Cumhurbaskanligi+Millet+Kutuphanesi+Ankara', 39.93041000, 32.79832000, 5, 5, TRUE, TRUE, TRUE),
('Arabica Coffee House (Batıkent)', 2, 'Batıkent Bulvarı', 'https://www.google.com/maps/search/?api=1&query=Arabica+Coffee+House+Batikent+Ankara', 39.96551000, 32.73105000, 4, 3, TRUE, TRUE, TRUE),
('Starbucks (Atlantis AVM)', 2, 'Batıkent, Atlantis AVM', 'https://www.google.com/maps/search/?api=1&query=Starbucks+Atlantis+AVM+Ankara', 39.95764000, 32.73501000, 4, 2, TRUE, TRUE, TRUE),
('Coffee Manifesto', 2, 'Kent Koop Mah.', 'https://www.google.com/maps/search/?api=1&query=Coffee+Manifesto+Batikent+Ankara', 39.96412000, 32.72304000, 4, 3, TRUE, TRUE, TRUE),

-- KEÇİÖREN
('Coffee Lab (Keçiören)', 3, 'Aşağı Eğlence Mah.', 'https://www.google.com/maps/search/?api=1&query=Coffee+Lab+Kecioren+Ankara', 39.97345000, 32.84652000, 5, 3, TRUE, TRUE, TRUE),
('Keçiören Millet Kıraathanesi', 3, 'Güçlükaya Mah.', 'https://www.google.com/maps/search/?api=1&query=Kecioren+Millet+Kiraathanesi+Ankara', 39.97810000, 32.86815000, 3, 4, TRUE, FALSE, TRUE),
('Mackbear Coffee Co. (Etlik)', 3, 'Etlik Caddesi', 'https://www.google.com/maps/search/?api=1&query=Mackbear+Coffee+Etlik+Ankara', 39.96805000, 32.83506000, 4, 3, TRUE, TRUE, TRUE),

-- GÖLBAŞI
('Arabica Coffee House (Gölbaşı)', 4, 'Bahçelievler Mah.', 'https://www.google.com/maps/search/?api=1&query=Arabica+Coffee+House+Golbasi+Ankara', 39.78912000, 32.80234000, 4, 3, TRUE, TRUE, TRUE),
('EspressoLab (Gölbaşı)', 4, 'Ankara Üni. Kampüs Yolu', 'https://www.google.com/maps/search/?api=1&query=EspressoLab+Golbasi+Ankara', 39.79105000, 32.80508000, 5, 3, TRUE, TRUE, TRUE),
('Gölbaşı İlçe Halk Kütüphanesi', 4, 'Gölbaşı Merkez', 'https://www.google.com/maps/search/?api=1&query=Golbasi+Ilce+Halk+Kutuphanesi+Ankara', 39.78502000, 32.80501000, 3, 5, TRUE, FALSE, TRUE),

-- ETİMESGUT
('Coffee Lab (Eryaman)', 5, 'Şehit Osman Avcı Mah.', 'https://www.google.com/maps/search/?api=1&query=Coffee+Lab+Eryaman+Ankara', 39.98254000, 32.64152000, 5, 3, TRUE, TRUE, TRUE),
('Starbucks (Göksu Parkı)', 5, 'Eryaman, Göksu', 'https://www.google.com/maps/search/?api=1&query=Starbucks+Goksu+Parki+Ankara', 39.97851000, 32.63004000, 4, 2, TRUE, TRUE, TRUE),
('Korkut Ata Kütüphanesi', 5, 'Erler Mah.', 'https://www.google.com/maps/search/?api=1&query=Korkut+Ata+Kutuphanesi+Etimesgut+Ankara', 39.93505000, 32.66807000, 4, 5, TRUE, FALSE, TRUE),

-- ALTINDAĞ & MAMAK
('Altındağ Gençlik ve Etüt Merkezi', 6, 'Karapürçek Mah.', 'https://www.google.com/maps/search/?api=1&query=Altindag+Genclik+ve+Etut+Merkezi+Ankara', 39.95503000, 32.90506000, 3, 5, TRUE, FALSE, TRUE),
('Mamak Gençlik Merkezi Study Hall', 7, 'Şafaktepe Mah.', 'https://www.google.com/maps/search/?api=1&query=Mamak+Genclik+Merkezi+Ankara', 39.93802000, 32.90204000, 4, 4, TRUE, FALSE, TRUE);

