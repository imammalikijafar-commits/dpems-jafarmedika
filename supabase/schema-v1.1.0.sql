-- ============================================
-- DPEMS Database Schema for RSU Ja'far Medika
-- Version: 1.1.0 (Kuesioner Integrative Medicine)
-- ============================================

-- 1. SETUP EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES BASE
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    unit_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SURVEY TABLE (Main)
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MIGRATION / COLUMN ENSURANCE (Mengatasi Error 42703)
-- Menambahkan kolom secara aman jika belum ada
ALTER TABLE surveys 
    ADD COLUMN IF NOT EXISTS age_range VARCHAR(20),
    ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
    ADD COLUMN IF NOT EXISTS education VARCHAR(50),
    ADD COLUMN IF NOT EXISTS occupation VARCHAR(50),
    ADD COLUMN IF NOT EXISTS patient_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS condition_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS visit_count VARCHAR(50),
    ADD COLUMN IF NOT EXISTS referral_source VARCHAR(100),
    -- SERVQUAL
    ADD COLUMN IF NOT EXISTS tangibles FLOAT,
    ADD COLUMN IF NOT EXISTS reliability FLOAT,
    ADD COLUMN IF NOT EXISTS responsiveness FLOAT,
    ADD COLUMN IF NOT EXISTS assurance FLOAT,
    ADD COLUMN IF NOT EXISTS empathy FLOAT,
    -- Herbal (C)
    ADD COLUMN IF NOT EXISTS herbal_prescribed BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS herb_explanation FLOAT,
    ADD COLUMN IF NOT EXISTS herb_usage_guide FLOAT,
    ADD COLUMN IF NOT EXISTS herb_safety_trust FLOAT,
    ADD COLUMN IF NOT EXISTS herb_availability FLOAT,
    ADD COLUMN IF NOT EXISTS herb_affordability FLOAT,
    ADD COLUMN IF NOT EXISTS herb_pharmacist FLOAT,
    -- Adjuvant (D)
    ADD COLUMN IF NOT EXISTS adjuvant_role VARCHAR(100),
    ADD COLUMN IF NOT EXISTS info_acupuncture_support FLOAT,
    ADD COLUMN IF NOT EXISTS info_understanding FLOAT,
    ADD COLUMN IF NOT EXISTS info_sufficient FLOAT,
    ADD COLUMN IF NOT EXISTS info_comfortable_asking FLOAT,
    -- Outcomes (E)
    ADD COLUMN IF NOT EXISTS pain_level_before INT,
    ADD COLUMN IF NOT EXISTS pain_level_after INT,
    ADD COLUMN IF NOT EXISTS condition_change VARCHAR(50),
    -- Spiritual (F)
    ADD COLUMN IF NOT EXISTS spiritual_salam_doa FLOAT,
    ADD COLUMN IF NOT EXISTS spiritual_islam_respect FLOAT,
    ADD COLUMN IF NOT EXISTS spiritual_facility FLOAT,
    ADD COLUMN IF NOT EXISTS spiritual_healing FLOAT,
    ADD COLUMN IF NOT EXISTS spiritual_support FLOAT,
    -- NPS (G)
    ADD COLUMN IF NOT EXISTS nps_score INT,
    ADD COLUMN IF NOT EXISTS visit_plan VARCHAR(100),
    ADD COLUMN IF NOT EXISTS has_recommended VARCHAR(50),
    -- Qualitative & Meta
    ADD COLUMN IF NOT EXISTS best_experience TEXT,
    ADD COLUMN IF NOT EXISTS improvement_suggestion TEXT,
    ADD COLUMN IF NOT EXISTS testimonial TEXT,
    ADD COLUMN IF NOT EXISTS responses_json JSONB,
    ADD COLUMN IF NOT EXISTS session_duration_seconds INT,
    ADD COLUMN IF NOT EXISTS device_type VARCHAR(20);

-- 5. INDEXES (Sekarang aman karena kolom pasti ada)
CREATE INDEX IF NOT EXISTS idx_units_hospital_id ON units(hospital_id);
CREATE INDEX IF NOT EXISTS idx_units_qr_code ON units(qr_code);
CREATE INDEX IF NOT EXISTS surveys_unit_id ON surveys(unit_id);
CREATE INDEX IF NOT EXISTS surveys_submitted_at ON surveys(submitted_at);
CREATE INDEX IF NOT EXISTS surveys_herbal_prescribed ON surveys(herbal_prescribed);

-- 6. AGGREGATIONS & ALERTS
CREATE TABLE IF NOT EXISTS survey_aggregations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    avg_tangibles FLOAT,
    avg_reliability FLOAT,
    avg_responsiveness FLOAT,
    avg_assurance FLOAT,
    avg_empathy FLOAT,
    avg_overall FLOAT,
    total_responses INT DEFAULT 0,
    promoters_count INT DEFAULT 0,
    passives_count INT DEFAULT 0,
    detractors_count INT DEFAULT 0,
    nps_score INT,
    avg_pain_reduction_pct FLOAT,
    UNIQUE(unit_id, date)
);

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID REFERENCES surveys(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    message TEXT,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION handle_new_survey()
RETURNS TRIGGER AS $$
DECLARE
    overall_val FLOAT;
BEGIN
    overall_val := (COALESCE(NEW.tangibles, 0) + COALESCE(NEW.reliability, 0) +
                    COALESCE(NEW.responsiveness, 0) + COALESCE(NEW.assurance, 0) +
                    COALESCE(NEW.empathy, 0)) / 5;

    INSERT INTO survey_aggregations (
        unit_id, date, total_responses, avg_tangibles, avg_reliability, 
        avg_responsiveness, avg_assurance, avg_empathy, avg_overall
    )
    VALUES (
        NEW.unit_id, CURRENT_DATE, 1, NEW.tangibles, NEW.reliability, 
        NEW.responsiveness, NEW.assurance, NEW.empathy, overall_val
    )
    ON CONFLICT (unit_id, date)
    DO UPDATE SET
        total_responses = survey_aggregations.total_responses + 1,
        avg_tangibles = (survey_aggregations.avg_tangibles * survey_aggregations.total_responses + NEW.tangibles) / (survey_aggregations.total_responses + 1),
        avg_reliability = (survey_aggregations.avg_reliability * survey_aggregations.total_responses + NEW.reliability) / (survey_aggregations.total_responses + 1),
        avg_responsiveness = (survey_aggregations.avg_responsiveness * survey_aggregations.total_responses + NEW.responsiveness) / (survey_aggregations.total_responses + 1),
        avg_assurance = (survey_aggregations.avg_assurance * survey_aggregations.total_responses + NEW.assurance) / (survey_aggregations.total_responses + 1),
        avg_empathy = (survey_aggregations.avg_empathy * survey_aggregations.total_responses + NEW.empathy) / (survey_aggregations.total_responses + 1),
        avg_overall = (survey_aggregations.avg_overall * survey_aggregations.total_responses + overall_val) / (survey_aggregations.total_responses + 1);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_survey_insert ON surveys;
CREATE TRIGGER on_survey_insert
    AFTER INSERT ON surveys
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_survey();

-- 8. SEED DATA
INSERT INTO hospitals (name, type, code, address, phone, email)
VALUES ('RSU Ja''far Medika', 'Tipe D', 'RS-JMK-001', 'Mojogedang, Karanganyar', '085762784375', 'jafarmedika@yahoo.co.id')
ON CONFLICT (code) DO NOTHING;

INSERT INTO units (hospital_id, name, description, qr_code, unit_type, sort_order)
SELECT id, 'Poli Akupuntur & Herbal', 'Layanan integrative stroke & nyeri', 'akupuntur-herbal', 'integrative', 1 
FROM hospitals WHERE code = 'RS-JMK-001' ON CONFLICT (qr_code) DO NOTHING;

-- 9. SECURITY (RLS)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_aggregations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert surveys" ON surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select units" ON units FOR SELECT USING (true);
CREATE POLICY "Allow public select surveys" ON surveys FOR SELECT USING (true);