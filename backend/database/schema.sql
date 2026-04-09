-- ==========================================
-- 1. DISTRICTS TABLE
-- ==========================================
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS spots CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS districts CASCADE;

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 2. USERS TABLE (Updated for Google Auth)
-- ==========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT, -- Убрано NOT NULL для входа через Google
    google_id VARCHAR(255) UNIQUE, -- Новое поле для Google ID
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 3. SPOTS TABLE (Updated with description)
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
    image_url TEXT, 
    description TEXT, -- Новое поле для страницы деталей кафе
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
-- SEED DATA (SPRINT 3 READY)
-- ==========================================

INSERT INTO districts (name) VALUES 
('Çankaya'), ('Yenimahalle'), ('Keçiören'), ('Gölbaşı'), 
('Etimesgut'), ('Altındağ'), ('Mamak');

INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin_123', 's00604962@gmail.com', 'hashed_password_placeholder', 'admin');

-- insert cafes with new commits
INSERT INTO spots (name, district_id, address, google_maps_link, latitude, longitude, wifi_rating, quiet_rating, outlet_availability, has_food, image_url, description) 
VALUES 
-- ÇANKAYA (ID: 1)
('Milli Kütüphane (National Library)', 1, 'Bahçelievler, İsmet İnönü Blv.', 'https://www.google.com/maps/search/?api=1&query=Milli+Kutuphane+Ankara', 39.91842, 32.82864, 4, 5, TRUE, FALSE, '/spots/milliKut.jpg', 'The ultimate destination for serious study sessions in Ankara. With a strictly quiet environment and vast resources, it’s the perfect place to focus before finals week.'),
('Coffee Lab (7. Cadde)', 1, 'Bahçelievler, Aşkabat Cd. No:23', 'https://www.google.com/maps/search/?api=1&query=Coffee+Lab+7.Cadde+Ankara', 39.92201, 32.82553, 5, 3, TRUE, TRUE, '/spots/CoffeeLabCankaya.jpg', 'Located in the heart of Bahçelievler, this spot offers a vibrant student atmosphere. Great Wi-Fi and plenty of desks make it a go-to for group projects.'),
('EspressoLab (Tunalı)', 1, 'Kavaklıdere, Tunalı Hilmi Cd.', 'https://www.google.com/maps/search/?api=1&query=EspressoLab+Tunali+Ankara', 39.90251, 32.85902, 5, 3, TRUE, TRUE, '/spots/cofeeLabTunali.jpg', 'A stylish and energetic cafe on the famous Tunalı Hilmi Street. It balances a social vibe with productive corners, making it ideal for laptop work.'),
('Workinton (Söğütözü)', 1, 'Söğütözü, Koç Kuleleri', 'https://www.google.com/maps/search/?api=1&query=Workinton+Sogutozu+Ankara', 39.91152, 32.81084, 5, 4, TRUE, TRUE, '/spots/workington.jpg', 'A professional co-working space that guarantees high-speed internet and ergonomic seating. Best suited for students who need a distraction-free environment.'),
('Federal Coffee Company', 1, 'Kavaklıdere, Tunalı Hilmi Cd.', 'https://maps.app.goo.gl/P9orF9UhYfrvA6uD8', 39.90543, 32.86015, 4, 3, TRUE, TRUE, '/spots/feder.jpg', 'Known for its premium coffee and chill interior. It’s a cozy spot in Kavaklıdere where you can enjoy a quiet afternoon of reading.'),

-- YENİMAHALLE (ID: 2)
('Cumhurbaşkanlığı Millet Kütüphanesi', 2, 'Cumhurbaşkanlığı Külliyesi', 'https://www.google.com/maps/search/?api=1&query=Cumhurbaskanligi+Millet+Kutuphanesi+Ankara', 39.93041, 32.79832, 5, 5, TRUE, TRUE, '/spots/MilliKutuphane.jpg', 'A breathtaking architectural marvel offering world-class facilities. It provides a silent, majestic atmosphere with thousands of study carrels.'),
('Arabica Coffee House (Batıkent)', 2, 'Batıkent Bulvarı', 'https://maps.app.goo.gl/8X2zWycN1xZGm5ao8', 39.96551, 32.73105, 4, 3, TRUE, TRUE, '/spots/arabicaBatikent.jpg', 'Spacious and modern, this Arabica branch is well-loved by local students for its consistent Wi-Fi and reliable outlet availability.'),
('Starbucks (Atlantis AVM)', 2, 'Batıkent, Atlantis AVM', 'https://www.google.com/maps/search/?api=1&query=Starbucks+Atlantis+AVM+Ankara', 39.95764, 32.73501, 4, 2, TRUE, TRUE, '/spots/sturbacks.jpg', 'A popular chain cafe located in Atlantis AVM, perfect for a quick coffee and study session between daily errands.'),
('Thila Coffee', 2, 'Mehmet Akif Ersoy.', 'https://share.google/kCmeAEhMcoWhwCmIy', 39.96412, 32.72304, 4, 3, TRUE, TRUE, '/spots/thila.jpg', 'A hidden gem in Yenimahalle that offers a more intimate and peaceful setting. Perfect for those looking to escape the crowded chains.'),

-- KEÇİÖREN (ID: 3)
('Coffee Lab (Keçiören)', 3, 'Aşağı Eğlence Mah.', 'https://maps.app.goo.gl/72Y4X3VkJX7JdpYb7', 39.97345, 32.84652, 5, 3, TRUE, TRUE, '/spots/cofeeLabKecioren.jpg', 'A modern and bright environment with excellent coffee. It is a favorite among local students for group discussions and coding sessions.'),
('Coffee de Madrid', 3, 'Şenlik Mah.', 'https://share.google/gOIvsCw58Z4b6Czpo', 39.9781, 32.86815, 3, 4, TRUE, FALSE, '/spots/madrid.jpg', 'With its unique Spanish-themed decor, this cafe offers a refreshing change of scenery. It features quiet corners and comfortable seating.'),
('Mackbear Coffee Co. (Etlik)', 3, 'Etlik Caddesi', 'https://maps.app.goo.gl/Lb5vLhdJc25hna9XA', 39.96805, 32.83506, 4, 3, TRUE, TRUE, '/spots/macbearEtlik.jpg', 'Comfortable seating and a warm atmosphere make this a favorite for Etlik residents needing a study break with great snacks.'),

-- GÖLBAŞI (ID: 4)
('Arabica (Gölbaşı)', 4, 'Bahçelievler Mah.', 'https://maps.app.goo.gl/nV3me8H7V3K29dLx5', 39.78912, 32.80234, 4, 3, TRUE, TRUE, '/spots/arabicagolbasi.jpg', 'A spacious cafe in Gölbaşı offering great coffee and reliable Wi-Fi. Very popular among university students in the area.'),
('EspressoLab (Gölbaşı)', 4, 'Ankara Üni. Kampüs Yolu', 'https://maps.app.goo.gl/Qg31mP56Kun3qa9LA', 39.79105, 32.80508, 5, 3, TRUE, TRUE, '/spots/espressoLab.jpg', 'Located right on the campus road, it’s the go-to spot for students looking to study before or after their university classes.'),
('Gölbaşı İlçe Kütüphanesi', 4, 'Gölbaşı Merkez', 'https://maps.app.goo.gl/L7QdX3LmHhHdwB13A', 39.78502, 32.80501, 3, 5, TRUE, FALSE, '/spots/golbasiLibrary.jpg', 'A quiet, distraction-free municipal library ideal for deep focus, research, and extensive reading sessions.'),

-- ETİMESGUT (ID: 5)
('Coffee Lab (Eryaman)', 5, 'Шехит Осман Авджи Мах.', 'https://maps.app.goo.gl/vBRvEzWEi4pPkV4u8', 39.98254, 32.64152, 5, 3, TRUE, TRUE, '/spots/coffeeLabEryaman.jpg', 'Modern interior with ample desk space and power outlets, highly recommended for remote work and long study hours.'),
('Starbucks (Göksu Parkı)', 5, 'Eryaman, Göksu', 'https://www.google.com/maps/search/?api=1&query=Starbucks+Goksu+Parki+Ankara', 39.97851, 32.63004, 4, 2, TRUE, TRUE, '/spots/starbacks.jpg', 'Enjoy a scenic view of Göksu Park while you study. A great blend of natural surroundings and productivity.'),

-- ALTINDAĞ (ID: 6)
('Altındağ Gençlik Merkezi', 6, 'Karapürçek Mah.', 'https://maps.app.goo.gl/xf2hesAoECFSzyyaA', 39.95503, 32.90506, 3, 5, TRUE, FALSE, '/spots/GenclikMerkezi.jpg', 'A community youth center offering a peaceful and structured environment. Excellent for students needing a quiet place away from home.'),

-- MAMAK (ID: 7)
('Mamak Study Hall', 7, 'Şafaktepe Mah.', 'https://www.google.com/maps/search/?api=1&query=Mamak+Genclik+Merkezi+Ankara', 39.93802, 32.90204, 4, 4, TRUE, FALSE, '/spots/mamakGenclik.jpg', 'A dedicated study space in Mamak with a strictly quiet atmosphere, perfect for intense exam preparation.');