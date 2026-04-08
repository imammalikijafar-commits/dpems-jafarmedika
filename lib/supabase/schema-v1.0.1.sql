-- ============================================
-- DPEMS Database Schema for RSU Ja'far Medika
-- Version: 1.0.1 (Production Ready)
-- Compatible with: Next.js 14 + Supabase + TypeScript
-- Author: [Your Name]
-- Date: 2024-11
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

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

CREATE INDEX IF NOT EXISTS idx_units_hospital_id ON units(hospital_id);
CREATE INDEX IF NOT EXISTS idx_units_qr_code ON units(qr_code);

CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    
    -- Demographics
    age_range VARCHAR(20), 
    gender VARCHAR(10), 
    patient_type VARCHAR(50), 
    visit_count INT DEFAULT 1, 
    treatment_type VARCHAR(100), 
    
    -- SERVQUAL Dimensions (Likert 1-5)
    tangibles FLOAT CHECK (tangibles >= 1 AND tangibles <= 5),
    reliability FLOAT CHECK (reliability >= 1 AND reliability <= 5),
    responsiveness FLOAT CHECK (responsiveness >= 1 AND responsiveness <= 5),
    assurance FLOAT CHECK (assurance >= 1 AND assurance <= 5),
    empathy FLOAT CHECK (empathy >= 1 AND empathy <= 5),
    
    -- Clinical Outcomes
    pain_level_before INT CHECK (pain_level_before >= 0 AND pain_level_before <= 10),
    pain_level_after INT CHECK (pain_level_after >= 0 AND pain_level_after <= 10), 
    functional_improvement VARCHAR(50), 
    
    -- Spiritual & Cultural (Optional)
    spiritual_comfort INT CHECK (spiritual_comfort >= 1 AND spiritual_comfort <= 5),
    cultural_respect INT CHECK (cultural_respect >= 1 AND cultural_respect <= 5),
    family_feeling INT CHECK (family_feeling >= 1 AND family_feeling <= 5),
    
    -- NPS
    nps_score INT CHECK (nps_score >= 0 AND nps_score <= 10),
    
    -- Qualitative
    complaints TEXT,
    suggestions TEXT,
    testimonial TEXT, 
    
    -- Metadata
    session_duration_seconds INT, 
    device_type VARCHAR(20), 
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS surveys_unit_id ON surveys(unit_id);
CREATE INDEX IF NOT EXISTS surveys_submitted_at ON surveys(submitted_at);

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

-- ============================================
-- TRIGGER: Auto-Aggregation on New Survey
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_survey()
RETURNS TRIGGER AS $$ 
BEGIN
    INSERT INTO survey_aggregations (
        unit_id, 
        date,
        total_responses,
        avg_tangibles,
        avg_reliability,
        avg_responsiveness,
        avg_assurance,
        avg_empathy,
        avg_overall
    )
    VALUES (
        NEW.unit_id,
        CURRENT_DATE,
        1,
        NEW.tangibles,
        NEW.reliability,
        NEW.responsiveness,
        NEW.assurance,
        NEW.empathy,
        (COALESCE(NEW.tangibles,0) + COALESCE(NEW.reliability,0) + 
         COALESCE(NEW.responsiveness,0) + COALESCE(NEW.assurance,0) + 
         COALESCE(NEW.empathy,0)) / 5
    )
    ON CONFLICT (unit_id, date) 
    DO UPDATE SET
        total_responses = survey_aggregations.total_responses + 1,
        avg_tangibles = (survey_aggregations.avg_tangibles * survey_aggregations.total_responses + NEW.tangibles) / (survey_aggregations.total_responses + 1),
        avg_reliability = (survey_aggregations.avg_reliability * survey_aggregations.total_responses + NEW.reliability) / (survey_aggregations.total_responses + 1),
        avg_responsiveness = (survey_aggregations.avg_responsiveness * survey_aggregations.total_responses + NEW.responsiveness) / (survey_aggregations.total_responses + 1),
        avg_assurance = (survey_aggregations.avg_assurance * survey_aggregations.total_responses + NEW.assurance) / (survey_aggregations.total_responses + 1),
        avg_empathy = (survey_aggregations.avg_empathy * survey_aggregations.total_responses + NEW.empathy) / (survey_aggregations.total_responses + 1),
        avg_overall = (survey_aggregations.avg_overall * survey_aggregations.total_responses + 
                      ((COALESCE(NEW.tangibles,0) + COALESCE(NEW.reliability,0) + 
                        COALESCE(NEW.responsiveness,0) + COALESCE(NEW.assurance,0) + 
                        COALESCE(NEW.empathy,0)) / 5)) / (survey_aggregations.total_responses + 1);
    
    RETURN NEW;
END;
 $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_survey_insert ON surveys;
CREATE TRIGGER on_survey_insert
    AFTER INSERT ON surveys
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_survey();

-- ============================================
-- SEED DATA (Development/Testing Only)
-- ============================================

INSERT INTO hospitals (name, type, code, address, phone, email) 
VALUES ('RS Studi Kasus (Tipe D)', 'Tipe D', 'RS-JMK-001', 'Mojogedang, Karanganyar, Jawa Tengah', '085762784375', 'jafarmedika@yahoo.co.id')
ON CONFLICT (code) DO NOTHING;

INSERT INTO units (hospital_id, name, description, qr_code, unit_type, sort_order) 
SELECT 
    id, 
    'Poli Akupuntur & Herbal',
    'Layanan unggulan integrative medicine untuk stroke rehabilitasi dan manajemen nyeri',
    gen_random_uuid()::text, 
    'integrative', 
    1 
FROM hospitals WHERE code = 'RS-JMK-001'
ON CONFLICT (qr_code) DO NOTHING;

INSERT INTO units (hospital_id, name, description, qr_code, unit_type, sort_order) 
SELECT 
    id, 
    'Poliklinik Umum',
    'Pelayanan medis umum dan penyakit dalam',
    gen_random_uuid()::text, 
    'umum', 
    2 
FROM hospitals WHERE code = 'RS-JMK-001'
ON CONFLICT (qr_code) DO NOTHING;

INSERT INTO units (hospital_id, name, description, qr_code, unit_type, sort_order) 
SELECT 
    id, 
    'Apotek & Herbal Medicine',
    'Pengobatan herbal dan farmasi konvensional',
    gen_random_uuid()::text, 
    'farmasi', 
    3 
FROM hospitals WHERE code = 'RS-JMK-001'
ON CONFLICT (qr_code) DO NOTHING;

-- Sample Surveys (for testing dashboard)
INSERT INTO surveys (unit_id, age_range, gender, patient_type, visit_count, treatment_type, 
    tangibles, reliability, responsiveness, assurance, empathy, 
    pain_level_before, pain_level_after, functional_improvement, 
    spiritual_comfort, cultural_respect, family_feeling,
    nps_score, complaints, device_type)
SELECT 
    id, 
    '61-70', 'L', 'BPJS', 8, 'Stroke Rehabilitasi', 
    4.0, 4.5, 3.5, 4.8, 4.6, 
    8, 5, 'much_better', 
    5, 5, 5,
    9, NULL, 'mobile'
FROM units WHERE unit_type = 'integrative' LIMIT 1;

INSERT INTO surveys (unit_id, age_range, gender, patient_type, visit_count, treatment_type, 
    tangibles, reliability, responsiveness, assurance, empathy, 
    pain_level_before, pain_level_after, functional_improvement, 
    nps_score, complaints, suggestions, device_type)
SELECT 
    id, 
    '51-60', 'P', 'Umum', 12, 'N