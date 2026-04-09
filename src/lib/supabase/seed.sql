-- ============================================
-- DPEMS Seed Data (105 demo surveys)
-- RSU Ja'far Medika Karanganyar
-- Run AFTER schema.sql
-- ============================================

-- Helper functions
CREATE OR REPLACE FUNCTION random_int(min_val INT, max_val INT) RETURNS INT AS $$
  SELECT floor(random() * (max_val - min_val + 1)) + min_val;
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION random_choice(choices TEXT[]) RETURNS TEXT AS $$
  SELECT choices[floor(random() * array_length(choices, 1)) + 1];
$$ LANGUAGE SQL VOLATILE;

-- ============================================
-- INTEGRATIVE (Poli Akupuntur & Herbal) - 35 surveys (star unit, higher scores)
-- ============================================
INSERT INTO surveys (
  unit_id, age_range, gender, patient_type, visit_count, treatment_type,
  tangibles, reliability, responsiveness, assurance, empathy,
  pain_level_before, pain_level_after, functional_improvement,
  spiritual_comfort, cultural_respect, family_feeling,
  nps_score, testimonial, suggestions, complaints, device_type
)
SELECT
  u.id,
  random_choice(ARRAY['50-59', '60-69', '61-70', '70-79']),
  random_choice(ARRAY['L', 'P']),
  random_choice(ARRAY['BPJS', 'Umum', 'Asuransi']),
  random_int(3, 20),
  random_choice(ARRAY['Stroke Rehabilitasi', 'Manajemen Nyeri', 'Kombinasi', 'HNP (Nyeri Saraf Pinggang)']),
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(3, 5)::float,
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(5, 10),
  GREATEST(0, random_int(5, 10) - random_int(2, 5)),
  random_choice(ARRAY['much_better', 'slightly_better', 'same']),
  random_int(4, 5),
  random_int(4, 5),
  random_int(4, 5),
  random_int(8, 10),
  random_choice(ARRAY[
    'Alhamdulillah sudah bisa jalan lagi setelah beberapa kali akupuntur.',
    'Doa dari perawat membuat saya tenang saat terapi.',
    'Staf sangat sabar menghadapi kami yang sudah tua.',
    'Saya merasa seperti keluarga di sini.',
    'Akupunturnya mujarab, nyeri berkurang banyak.',
    'Terima kasih, pelayanannya ramah.',
    'Subhanallah, sekarang sudah bisa ke sawah sendiri.',
    'Jarum terasa agak sakit di sesi pertama, tapi setelahnya biasa.',
    'Dokter jelas menjelaskan prosedur sebelum mulai.',
  ]),
  NULL,
  'mobile'
FROM units u WHERE u.qr_code = 'akupuntur-herbal'
CROSS JOIN generate_series(1, 35);

-- ============================================
-- POLI UMUM - 25 surveys (average scores)
-- ============================================
INSERT INTO surveys (
  unit_id, age_range, gender, patient_type, visit_count, treatment_type,
  tangibles, reliability, responsiveness, assurance, empathy,
  pain_level_before, pain_level_after, functional_improvement,
  spiritual_comfort, cultural_respect, family_feeling,
  nps_score, complaints, suggestions, device_type
)
SELECT
  u.id,
  random_choice(ARRAY['40-49', '50-59', '60-69', '70-79']),
  random_choice(ARRAY['L', 'P']),
  random_choice(ARRAY['BPJS', 'Umum', 'Asuransi']),
  random_int(1, 15),
  random_choice(ARRAY['Stroke Rehabilitasi', 'Manajemen Nyeri', 'HNP', 'Lainnya']),
  random_int(3, 5)::float,
  random_int(3, 5)::float,
  random_int(2, 4)::float,
  random_int(3, 5)::float,
  random_int(3, 5)::float,
  random_int(4, 9),
  GREATEST(0, random_int(4, 9) - random_int(1, 4)),
  random_choice(ARRAY['much_better', 'slightly_better', 'same', 'worse']),
  random_int(3, 5),
  random_int(3, 5),
  random_int(3, 4),
  random_int(5, 10),
  NULL,
  random_choice(ARRAY[
    'Antri terlalu lama, kadang 1 jam baru dipanggil.',
    'Saya harap antrian bisa lebih cepat.',
    'Biayanya terjangkau untuk BPJS.',
    'Dokternya ramah.',
    'Suasana ruang tunggu nyaman.',
    'Parkir kurang luas untuk kursi roda.',
    'Pelayanannya cukup baik.',
    'Terima kasih atas pelayanannya.',
  ]),
  random_choice(ARRAY['Parkir kurang luas', 'Perlu lebih banyak kursi roda']),
  'mobile'
FROM units u WHERE u.qr_code = 'poli-umum'
CROSS JOIN generate_series(1, 25);

-- ============================================
-- APOTEK HERBAL - 15 surveys (high scores, specific)
-- ============================================
INSERT INTO surveys (
  unit_id, age_range, gender, patient_type, visit_count, treatment_type,
  tangibles, reliability, responsiveness, assurance, empathy,
  pain_level_before, pain_level_after, functional_improvement,
  spiritual_comfort, cultural_respect, family_feeling,
  nps_score, testimonial, suggestions, device_type
)
SELECT
  u.id,
  random_choice(ARRAY['50-59', '60-69', '70-79']),
  random_choice(ARRAY['L', 'P']),
  random_choice(ARRAY['BPJS', 'Umum']),
  random_int(1, 10),
  random_choice(ARRAY['Stroke Rehabilitasi', 'Manajemen Nyeri', 'Kombinasi']),
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(3, 7),
  GREATEST(0, random_int(3, 7) - random_int(1, 3)),
  random_choice(ARRAY['much_better', 'slightly_better', 'same']),
  random_int(4, 5),
  random_int(4, 5),
  random_int(5, 5),
  random_int(8, 10),
  random_choice(ARRAY[
    'Obat herbalnya lengkap dan terjangkau.',
    'Penjelasan cara minum obat sudah jelas.',
    'Kelorenya enak dan fresh.',
    'Kalau stock kelor habis, kadang harus nunggu.',
  ]),
  NULL,
  'mobile'
FROM units u WHERE u.qr_code = 'apotek-herbal'
CROSS JOIN generate_series(1, 15);

-- ============================================
-- FISIOTERAPI - 15 surveys
-- ============================================
INSERT INTO surveys (
  unit_id, age_range, gender, patient_type, visit_count, treatment_type,
  tangibles, reliability, responsiveness, assurance, empathy,
  pain_level_before, pain_level_after, functional_improvement,
  spiritual_comfort, cultural_respect, family_feeling,
  nps_score, testimonial, suggestions, device_type
)
SELECT
  u.id,
  random_choice(ARRAY['45-49', '50-59', '60-69', '70-79']),
  random_choice(ARRAY['L', 'P']),
  random_choice(ARRAY['BPJS', 'Umum', 'Asuransi']),
  random_int(3, 18),
  random_choice(ARRAY['Stroke Rehabilitasi', 'Manajemen Nyeri', 'Kombinasi']),
  random_int(3, 5)::float,
  random_int(4, 5)::float,
  random_int(3, 4)::float,
  random_int(4, 5)::float,
  random_int(4, 5)::float,
  random_int(4, 9),
  GREATEST(0, random_int(4, 9) - random_int(1, 5)),
  random_choice(ARRAY['much_better', 'slightly_better', 'same']),
  random_int(3, 5),
  random_int(3, 5),
  random_int(3, 5),
  random_int(6, 10),
  random_choice(ARRAY[
    'Fisioterapi membantu saya belajar jalan lagi.',
    'Terapisnya sabar dan penuh perhatian.',
    'Alhamdulillah kemajuan sudah terlihat.',
  ]),
  random_choice(ARRAY['Perlu lebih banyak sesi']),
  'mobile'
FROM units u WHERE u.qr_code = 'fisioterapi'
CROSS JOIN generate_series(1, 15);

-- ============================================
-- IGD (Instalasi Gawat Darurat) - 15 surveys
-- ============================================
INSERT INTO surveys (
  unit_id, age_range, gender, patient_type, visit_count, treatment_type,
  tangibles, reliability, responsiveness, assurance, empathy,
  pain_level_before, pain_level_after, functional_improvement,
  spiritual_comfort, cultural_respect, family_feeling,
  nps_score, complaints, device_type
)
SELECT
  u.id,
  random_choice(ARRAY['40-49', '50-59', '60-69', '70-79', '80+']),
  random_choice(ARRAY['L', 'P']),
  random_choice(ARRAY['Umum', 'BPJS']),
  random_int(1, 5),
  'Lainnya',
  random_int(3, 5)::float,
  random_int(3, 4)::float,
  random_int(3, 4)::float,
  random_int(3, 5)::float,
  random_int(3, 4)::float,
  random_int(2, 7),
  GREATEST(0, random_int(2, 7) - random_int(1, 3)),
  random_choice(ARRAY['much_better', 'same', 'worse']),
  random_int(3, 4),
  random_int(3, 4),
  random_int(3, 5),
  random_int(6, 9),
  random_choice(ARRAY[
    'Penanganan IGD cepat dan tepat.',
    'Tim medis sigap tanggap.',
    'Ruangan bersih dan steril.',
  ]),
  random_choice(ARRAY['Antri terlalu lama', 'Perlu ruang tunggu yang lebih luas']),
  'desktop'
FROM units u WHERE u.qr_code = 'igd'
CROSS JOIN generate_series(1, 15);

-- Cleanup helper functions
DROP FUNCTION IF EXISTS random_int(INT, INT);
DROP FUNCTION IF EXISTS random_choice(TEXT[]);