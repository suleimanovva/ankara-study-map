-- Table for Ankara districts to allow filtering by location
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Table for study/work locations (cafes, libraries, coworking spaces)
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Name of the establishment
    district_id INTEGER REFERENCES districts(id), -- Relationship with districts table
    address TEXT,
    google_maps_url TEXT,
    
    -- Study-specific criteria (Rating from 1 to 5)
    wifi_rating INTEGER CHECK (wifi_rating BETWEEN 1 AND 5),
    outlet_availability BOOLEAN DEFAULT FALSE, -- Yes/No for power outlets
    noise_level INTEGER CHECK (noise_level BETWEEN 1 AND 5) -- 1: Quiet, 5: Loud
);

-- Seed data for initial development
INSERT INTO districts (name) 
VALUES ('Çankaya'), ('Yenimahalle'), ('Balgat'), ('Bahçelievler');