-- ==========================================
-- 1. DISTRICTS TABLE
-- ==========================================
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- 2. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. SPOTS TABLE (Без описания, только координаты)
-- ==========================================
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    address TEXT,
    google_maps_link TEXT,
    
    -- GPS Coordinates (Широта и Долгота для Карты)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Filters
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5),
    quiet_rating INTEGER CHECK (quiet_rating BETWEEN 1 AND 5),
    outlet_availability BOOLEAN DEFAULT FALSE,
    has_food BOOLEAN DEFAULT FALSE,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    suggested_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. REVIEWS TABLE
-- ==========================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    spot_id INTEGER REFERENCES spots(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, spot_id)
);

-- ==========================================
-- SEED DATA
-- ==========================================

TRUNCATE TABLE reviews, spots, users, districts RESTART IDENTITY CASCADE;

INSERT INTO districts (name) VALUES 
('Çankaya'), ('Yenimahalle'), ('Keçiören'), ('Gölbaşı'), ('Etimesgut'), ('Altındağ');

INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin_nigara', 'nigara@ankaramap.com', 'hashed_secret', 'admin');

-- Вставляем места (Только название, адрес и координаты)
INSERT INTO spots (name, district_id, address, google_maps_link, latitude, longitude, wifi_rating, quiet_rating, outlet_availability, has_food, is_approved) 
VALUES 
-- ÇANKAYA
(
 'Milli Kütüphane', 1, 
 'Bahçelievler, İsmet İnönü Blv. No:4', 
 'https://www.google.com/maps/search/Milli+Kütüphane+Ankara', 
 39.9198, 32.8335,
 4, 5, TRUE, FALSE, TRUE
),
(
 'Adnan Ötüken İl Halk Kütüphanesi', 1, 
 'Kızılay, Kumrular Cd. No:3', 
 'https://www.google.com/maps/search/Adnan+Ötüken+İl+Halk+Kütüphanesi', 
 39.9185, 32.8524,
 3, 5, TRUE, FALSE, TRUE
),
(
 'Coffee Lab (Bahçelievler 7.Cadde)', 1, 
 'Bahçelievler, Aşkabat Cd. No:23', 
 'https://www.google.com/maps/search/Coffee+Lab+Bahçelievler+Ankara', 
 39.9234, 32.8256,
 5, 2, TRUE, TRUE, TRUE
),
(
 'Workinton (Söğütözü)', 1, 
 'Söğütözü, Koç Kuleleri', 
 'https://www.google.com/maps/search/Workinton+Söğütözü+Ankara', 
 39.9085, 32.8095,
 5, 4, TRUE, TRUE, TRUE
),

-- YENİMAHALLE
(
 'Cumhurbaşkanlığı Millet Kütüphanesi', 2, 
 'Cumhurbaşkanlığı Külliyesi', 
 'https://www.google.com/maps/search/Cumhurbaşkanlığı+Millet+Kütüphanesi', 
 39.9312, 32.7987,
 5, 5, TRUE, TRUE, TRUE
),
(
 'Starbucks (Atlantis AVM)', 2, 
 'Batıkent, Atlantis AVM', 
 'https://www.google.com/maps/search/Starbucks+Atlantis+AVM+Ankara', 
 39.9578, 32.7541,
 4, 2, TRUE, TRUE, TRUE
),

-- GÖLBAŞI
(
 'Arabica Coffee House (Gölbaşı)', 4, 
 'Bahçelievler Mah. 285. Sk.', 
 'https://www.google.com/maps/search/Arabica+Coffee+House+Gölbaşı', 
 39.7895, 32.8012,
 4, 3, TRUE, TRUE, TRUE
),
(
 'Mogan Parkı (Study Area)', 4, 
 'Karşıyaka, Haymana Yolu Blv.', 
 'https://www.google.com/maps/search/Mogan+Parkı+Gölbaşı', 
 39.7820, 32.7950,
 2, 4, FALSE, TRUE, TRUE
);