-- ============================================
-- DPEMS Seed Data v1.1.0 — 30 Surveys
-- RSU Ja'far Medika Karanganyar
-- ============================================

-- Pastikan tipe data visit_count adalah text
ALTER TABLE surveys ALTER COLUMN visit_count TYPE VARCHAR(50);

-- Helper functions
CREATE OR REPLACE FUNCTION random_int(min_val INT, max_val INT) RETURNS INT AS $$
  SELECT floor(random() * (max_val - min_val + 1)) + min_val;
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION random_float(min_val FLOAT, max_val FLOAT) RETURNS FLOAT AS $$
  SELECT (random() * (max_val - min_val) + min_val)::numeric(3,1)::float;
$$ LANGUAGE SQL VOLATILE;

-- INSERT DATA
INSERT INTO surveys (
  unit_id, age_range, gender, education, occupation,
  patient_type, condition_type, visit_count, referral_source,
  tangibles, reliability, responsiveness, assurance, empathy,
  herbal_prescribed, herb_explanation, herb_usage_guide, herb_safety_trust,
  herb_availability, herb_affordability, herb_pharmacist,
  adjuvant_role, info_acupuncture_support, info_understanding,
  info_sufficient, info_comfortable_asking,
  pain_level_before, pain_level_after, condition_change,
  spiritual_salam_doa, spiritual_islam_respect,
  spiritual_facility, spiritual_healing, spiritual_support,
  nps_score, visit_plan, has_recommended,
  best_experience, improvement_suggestion, testimonial,
  device_type
)
SELECT
  u.id,

  -- A: Demografi
  (ARRAY['<20','20-30','31-45','46-60','>60'])[floor(random()*5)+1],
  (ARRAY['L','P'])[floor(random()*2)+1],
  (ARRAY['SD/Sederajat','SMP/Sederajat','SMA/Sederajat','D1-D3','S1/D4','S2','S3'])[floor(random()*7)+1],
  (ARRAY['PNS/TNI/Polri','Karyawan Swasta','Wiraswasta/Pedagang','Petani','Buruh Harian/Pabrik','Ibu Rumah Tangga','Pensiunan','Pelajar/Mahasiswa','Lainnya'])[floor(random()*9)+1],
  (ARRAY['Umum (Biaya Sendiri)','Asuransi Swasta'])[floor(random()*2)+1],
  (ARRAY['Stroke / Pasca Stroke','Nyeri Sendi (Rematik/OA)','Nyeri Punggung / Saraf Kejepit','Migrain / Sakit Kepala Kronis','Gangguan Tidur (Insomnia)','Kondisi Neurologis Lainnya','Wellness / Pemeliharaan Kesehatan','Lainnya'])[floor(random()*8)+1],
  (ARRAY['Pertama kali','2-4 kali','5-7 kali','8-10 kali','Lebih dari 10 kali'])[floor(random()*5)+1],
  (ARRAY['Datang sendiri (tanpa rujukan)','Dirujuk dokter Interna RS ini','Dirujuk dokter Neurologi RS ini','Dirujuk dokter spesialis lain RS ini','Rekomendasi keluarga/teman','Media sosial/internet'])[floor(random()*6)+1],

  -- B: SERVQUAL
  random_float(3.5, 5.0),
  random_float(3.5, 5.0),
  random_float(3.0, 5.0),
  random_float(3.5, 5.0),
  random_float(3.5, 5.0),

  -- C: Herbal
  CASE WHEN random() < 0.8 THEN true ELSE false END,
  CASE WHEN random() < 0.8 THEN random_float(3.0, 5.0) ELSE NULL END,
  CASE WHEN random() < 0.8 THEN random_float(3.0, 5.0) ELSE NULL END,
  CASE WHEN random() < 0.8 THEN random_float(3.5, 5.0) ELSE NULL END,
  CASE WHEN random() < 0.8 THEN random_float(3.0, 5.0) ELSE NULL END,
  CASE WHEN random() < 0.8 THEN random_float(3.0, 5.0) ELSE NULL END,
  CASE WHEN random() < 0.8 THEN random_float(3.5, 5.0) ELSE NULL END,

  -- D: Adjuvant
  (ARRAY['Pengganti obat dokter spesialis','Pendukung/pelengkap','Pilihan terakhir','Belum tahu/tidak yakin'])[floor(random()*4)+1],
  random_float(3.0, 5.0),
  random_float(3.0, 5.0),
  random_float(3.0, 5.0),
  random_float(3.0, 5.0),

  -- E: Pain
  random_int(3, 10),
  random_int(0, 5),
  (ARRAY['Sangat Memburuk','Agak Memburuk','Tidak Berubah','Agak Membaik','Sangat Membaik'])[floor(random()*5)+1],

  -- F: Spiritual
  random_float(4.0, 5.0),
  random_float(4.0, 5.0),
  random_float(3.5, 5.0),
  random_float(4.0, 5.0),
  random_float(4.0, 5.0),

  -- G: NPS
  CASE
    WHEN random() < 0.50 THEN random_int(9, 10)
    WHEN random() < 0.80 THEN random_int(7, 8)
    ELSE random_int(3, 6)
  END,
  (ARRAY['Lanjutkan terapi sampai sembuh/optimal','Datang berkala untuk pemeliharaan kesehatan','Berhenti setelah kondisi membaik','Belum memutuskan','Cari alternatif lain'])[floor(random()*5)+1],
  (ARRAY['Ya, sudah pernah','Belum, tapi berencana','Belum dan tidak berencana'])[floor(random()*3)+1],

  -- H: Qualitative (KOMA DIHAPUS SEBELUM ])
  CASE
    WHEN random() < 0.40 THEN (ARRAY[
      'Alhamdulillah setelah 3x akupuntur, nyeri pinggang saya berkurang drastis.',
      'Doa dan salam dari perawat sebelum terapi membuat saya tenang.',
      'Staf sangat sabar, penjelasan tentang prosedur akupuntur sangat jelas.',
      'Saya merasa seperti keluarga di sini, pelayanannya personal.',
      'Terapi akupuntur membantu saya bisa jalan lagi tanpa tongkat.',
      'Subhanallah, setelah 5 sesi migrain saya jarang kambuh.',
      'Dokter dan perawat selalu bertanya kabar dan perkembangan saya.',
      'Ramuan herbal yang diberikan cocok dan tidak ada efek samping.',
      'Suasana ruang terapi tenang dan nyaman, ada bacaan Al-Quran.',
      'Kalau stock obat herbal habis, saya harus nunggu beberapa hari.',
      'Antrian terkadang lama, tapi pelayanan terapinya memuaskan.',
      'Pengalaman pertama akupuntur agak takut, tapi staf sangat membantu'
    ])[floor(random()*12)+1]
    ELSE NULL
  END,
  CASE
    WHEN random() < 0.25 THEN (ARRAY[
      'Semoga jam operasional akupuntur bisa ditambah di hari Sabtu.',
      'Perlu lebih banyak kursi roda di area tunggu.',
      'Informasi tentang jamu herbal bisa diberikan dalam bentuk leaflet.',
      'Parkir kurang luas untuk pasien yang pakai kursi roda.',
      'Bisa ditambahkan layanan telekonsultasi untuk kontrol rutin'
    ])[floor(random()*5)+1]
    ELSE NULL
  END,
  CASE
    WHEN random() < 0.30 THEN (ARRAY[
      'Terapi akupuntur di RS Ja''far Medika sangat membantu penyembuhan saya.',
      'Saya sudah merekomendasikan ke tetangga yang juga punya keluhan saraf.',
      'Terima kasih RSU Ja''far Medika, pelayanan integratifnya luar biasa.',
      'Saya puas, semoga layanan ini terus berkembang'
    ])[floor(random()*4)+1]
    ELSE NULL
  END,

  CASE WHEN random() < 0.7 THEN 'mobile' ELSE 'desktop' END

FROM units u
CROSS JOIN generate_series(1, 30)
WHERE u.qr_code = 'akupuntur-herbal';

-- Cleanup
DROP FUNCTION IF EXISTS random_int(INT, INT);
DROP FUNCTION IF EXISTS random_float(FLOAT, FLOAT);