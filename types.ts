// --- DATABASE SCHEMA TYPES ---

// 1. Users Table
export interface User {
  id: string; // PK
  nama_lengkap: string;
  password: string; // In real app, this should be hashed
  role: 'guru' | 'admin';
  created_at: string;
}

// 2. Guru Table
export interface Guru {
  id: string; // PK
  user_id: string; // FK -> Users.id
  nama_sekolah: string;
  logo_sekolah?: string; // Base64 or URL
  nip: string;
  tempat_tanggal_lahir?: string;
  kontak?: string;
  alamat?: string; // Alamat Sekolah
  email?: string;
  motto?: string;
  titi_mangsa?: string; // Default location for signature dates (e.g., "Jakarta")
  avatar?: string;
  kelas_wali?: string; // e.g., "XII IPA 1"
  mapel_ampu?: string;
  
  // Kepala Sekolah Data
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

// 3. Siswa Table
export interface Siswa {
  id: string; // PK
  guru_id: string; // FK -> Guru.id (Wali Kelas)
  kelas: string;
  tahun_ajaran: string;
  semester: string;
  
  // Data Pribadi
  nama: string;
  jenis_kelamin: 'L' | 'P';
  nisn?: string;
  tempat_tanggal_lahir?: string;
  alamat?: string;
  
  // Data Orang Tua
  nama_ayah?: string;
  nama_ibu?: string;
  pekerjaan_orangtua?: string;
  penghasilan_orangtua?: number;
  kontak_orangtua?: string;
  
  // Data Tambahan
  hobi?: string;
  cita_cita?: string;
  
  // Data Fisik
  tinggi_badan?: number;
  berat_badan?: number;
  lingkar_kepala?: number;
  
  created_at: string;
}

// 4. Absen Table
export interface Absen {
  id: string; // PK
  siswa_id: string; // FK -> Siswa.id
  tanggal: string; // YYYY-MM-DD
  bulan: number; // 1-12
  tahun: number; // YYYY
  status: 'H' | 'S' | 'I' | 'A';
}

// 5. Nilai Table
export interface Nilai {
  id: string; // PK
  siswa_id: string; // FK -> Siswa.id
  mata_pelajaran: string;
  
  nilai_harian1: number;
  nilai_harian2: number;
  nilai_harian3: number;
  nilai_mid: number;
  nilai_pas: number;
  
  nilai_raport: number; // Calculated field
}

// 6. Dokumen_AI Table
export interface DokumenAI {
  id: string; // PK
  guru_id: string; // FK -> Guru.id
  jenis_dokumen: string;
  topik: string;
  isi_html: string;
  created_at: string;
}

// --- UI / APP STATE TYPES ---

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  BIODATA_GURU = 'BIODATA_GURU',
  DATA_SISWA = 'DATA_SISWA',
  ABSEN_SISWA = 'ABSEN_SISWA',
  NILAI_SISWA = 'NILAI_SISWA',
  PERANGKAT_AJAR = 'PERANGKAT_AJAR',
  KALENDER = 'KALENDER',
  AI_STUDIO = 'AI_STUDIO',
  PENGATURAN = 'PENGATURAN',
}

export interface TeacherProfile {
  name: string;
  nip: string;
  subject: string;
  class: string;
  avatar: string;
}

export type AcademicYear = 
  | '2023/2024' | '2024/2025' | '2025/2026' | '2026/2027' 
  | '2027/2028' | '2028/2029' | '2029/2030' | '2030/2031';

export type Semester = 'Ganjil' | 'Genap';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: any;
  color: string;
}