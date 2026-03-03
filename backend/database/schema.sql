-- ==========================================
-- 1. DISTRICTS TABLE
-- ==========================================
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN DEFAULT FALSE
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 3. SPOTS TABLE
-- ==========================================
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    address TEXT,
    google_maps_link TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8), 
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5),
    quiet_rating INTEGER CHECK (quiet_rating BETWEEN 1 AND 5),
    outlet_availability BOOLEAN DEFAULT FALSE,
    has_food BOOLEAN DEFAULT FALSE,
    image_url TEXT, -- Added to match frontend 'img' property
    is_approved BOOLEAN DEFAULT TRUE, 
    suggested_by INTEGER REFERENCES users(id) ON DELETE SET NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_spots_district ON spots(district_id);
CREATE INDEX idx_spots_active ON spots(is_deleted, is_approved);

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
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, spot_id)
);

-- ==========================================
-- SEED DATA (UPDATED WITH CORRECT FRONTEND DATA)
-- ==========================================

TRUNCATE TABLE reviews, spots, users, districts RESTART IDENTITY CASCADE;

INSERT INTO districts (name) VALUES 
('Çankaya'), ('Yenimahalle'), ('Keçiören'), ('Gölbaşı'), 
('Etimesgut'), ('Altındağ'), ('Mamak');

INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin_123', 's00604962@gmail.com', 'hashed_password_placeholder', 'admin');

INSERT INTO spots (name, district_id, address, google_maps_link, latitude, longitude, wifi_rating, quiet_rating, outlet_availability, has_food, image_url) 
VALUES 
-- ÇANKAYA (ID: 1)
('Milli Kütüphane (National Library)', 1, 'Bahçelievler, İsmet İnönü Blv.', 'https://www.google.com/maps/search/?api=1&query=Milli+Kutuphane+Ankara', 39.91842, 32.82864, 4, 5, TRUE, FALSE, '/spots/milliKut.jpg'),
('Coffee Lab (7. Cadde)', 1, 'Bahçelievler, Aşkabat Cd. No:23', 'https://www.google.com/maps/search/?api=1&query=Coffee+Lab+7.Cadde+Ankara', 39.92201, 32.82553, 5, 3, TRUE, TRUE, '/spots/CoffeeLabCankaya.jpg'),
('EspressoLab (Tunalı)', 1, 'Kavaklıdere, Tunalı Hilmi Cd.', 'https://www.google.com/maps/search/?api=1&query=EspressoLab+Tunali+Ankara', 39.90251, 32.85902, 5, 3, TRUE, TRUE, '/spots/cofeeLabTunali.jpg'),
('Workinton (Söğütözü)', 1, 'Söğütözü, Koç Kuleleri', 'https://www.google.com/maps/search/?api=1&query=Workinton+Sogutozu+Ankara', 39.91152, 32.81084, 5, 4, TRUE, TRUE, '/spots/workington.jpg'),
('Federal Coffee Company', 1, 'Kavaklıdere, Tunalı Hilmi Cd.', 'https://maps.app.goo.gl/P9orF9UhYfrvA6uD8', 39.90543, 32.86015, 4, 3, TRUE, TRUE, '/spots/feder.jpg'),

-- YENİMAHALLE (ID: 2)
('Cumhurbaşkanlığı Millet Kütüphanesi', 2, 'Cumhurbaşkanlığı Külliyesi', 'https://www.google.com/maps/search/?api=1&query=Cumhurbaskanligi+Millet+Kutuphanesi+Ankara', 39.93041, 32.79832, 5, 5, TRUE, TRUE, '/spots/MilliKutuphane.jpg'),
('Arabica Coffee House (Batıkent)', 2, 'Batıkent Bulvarı', 'https://maps.app.goo.gl/8X2zWycN1xZGm5ao8', 39.96551, 32.73105, 4, 3, TRUE, TRUE, '/spots/arabicaBatikent.jpg'),
('Starbucks (Atlantis AVM)', 2, 'Batıkent, Atlantis AVM', 'https://www.google.com/maps/search/?api=1&query=Starbucks+Atlantis+AVM+Ankara', 39.95764, 32.73501, 4, 2, TRUE, TRUE, '/spots/sturbacks.jpg'),
('Thila Coffee', 2, 'Mehmet Akif Ersoy.', 'https://share.google/kCmeAEhMcoWhwCmIy', 39.96412, 32.72304, 4, 3, TRUE, TRUE, '/spots/thila.jpg'),

-- KEÇİÖREN (ID: 3)
('Coffee Lab (Keçiören)', 3, 'Aşağı Eğlence Mah.', 'https://maps.app.goo.gl/72Y4X3VkJX7JdpYb7', 39.97345, 32.84652, 5, 3, TRUE, TRUE, '/spots/cofeeLabKecioren.jpg'),
('Coffee de Madrid', 3, 'Şenlik Mah.', 'https://share.google/gOIvsCw58Z4b6Czpo', 39.9781, 32.86815, 3, 4, TRUE, FALSE, '/spots/madrid.jpg'),
('Mackbear Coffee Co. (Etlik)', 3, 'Etlik Caddesi', 'https://maps.app.goo.gl/Lb5vLhdJc25hna9XA', 39.96805, 32.83506, 4, 3, TRUE, TRUE, '/spots/macbearEtlik.jpg'),

-- GÖLBAŞI (ID: 4)
('Arabica (Gölbaşı)', 4, 'Bahçelievler Mah.', 'https://maps.app.goo.gl/nV3me8H7V3K29dLx5', 39.78912, 32.80234, 4, 3, TRUE, TRUE, '/spots/arabicagolbasi.jpg'),
('EspressoLab (Gölbaşı)', 4, 'Ankara Üni. Kampüs Yolu', 'https://maps.app.goo.gl/Qg31mP56Kun3qa9LA', 39.79105, 32.80508, 5, 3, TRUE, TRUE, '/spots/espressoLab.jpg'),
('Gölbaşı İlçe Kütüphanesi', 4, 'Gölbaşı Merkez', 'https://maps.app.goo.gl/L7QdX3LmHhHdwB13A', 39.78502, 32.80501, 3, 5, TRUE, FALSE, '/spots/golbasiLibrary.jpg'),

-- ETİMESGUT (ID: 5)
('Coffee Lab (Eryaman)', 5, 'Шехит Осман Авджи Мах.', 'https://maps.app.goo.gl/vBRvEzWEi4pPkV4u8', 39.98254, 32.64152, 5, 3, TRUE, TRUE, '/spots/coffeeLabEryaman.jpg'),
('Starbucks (Göksu Parkı)', 5, 'Eryaman, Göksu', 'https://www.google.com/maps/search/?api=1&query=Starbucks+Goksu+Parki+Ankara', 39.97851, 32.63004, 4, 2, TRUE, TRUE, '/spots/starbacks.jpg'),

-- ALTINDAĞ (ID: 6)
('Altındağ Gençlik Merkezi', 6, 'Karapürçek Mah.', 'https://maps.app.goo.gl/xf2hesAoECFSzyyaA', 39.95503, 32.90506, 3, 5, TRUE, FALSE, '/spots/GenclikMerkezi.jpg'),

-- MAMAK (ID: 7)
('Mamak Study Hall', 7, 'Şafaktepe Mah.', 'https://www.google.com/maps/search/?api=1&query=Mamak+Genclik+Merkezi+Ankara', 39.93802, 32.90204, 4, 4, TRUE, FALSE, '/spots/mamakGenclik.jpg');