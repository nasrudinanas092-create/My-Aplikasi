import { ViewState, TeacherProfile, AcademicYear } from './types';
import { 
  User, Users, ClipboardCheck, GraduationCap, 
  BookOpen, Calendar, Wand2, Settings, LayoutDashboard
} from 'lucide-react';

export const MOCK_TEACHER: TeacherProfile = {
  name: 'Nasrudin, S.Pd',
  nip: '19850101 201001 1 001',
  subject: 'MATEMATIKA',
  class: 'XII IPA 1',
  avatar: 'https://picsum.photos/200/200'
};

export const ACADEMIC_YEARS: AcademicYear[] = [
  '2023/2024', '2024/2025', '2025/2026', '2026/2027', 
  '2027/2028', '2028/2029', '2029/2030', '2030/2031'
];

export const SUBJECTS = [
  // Mapel Umum
  'MATEMATIKA',
  'BAHASA INDONESIA',
  'Pendidikan Pancasila/PKn',
  'Bahasa Inggris',
  'Bahasa Sunda',
  'Seni Budaya',
  'PJOK',
  'TIK',
  'Prakarya',
  'Sejarah (umum)',
  // Mapel Agama
  'PAI',
  'Alquran Hadits',
  'Aqidah Akhlak',
  'SKI',
  'Bahasa Arab',
  // Mapel Khusus IPA
  'Fisika',
  'Kimia',
  'Biologi',
  'Matematika Peminatan',
  // Mapel Khusus IPS
  'Ekonomi',
  'Geografi',
  'Sosiologi',
  'Sejarah Peminatan'
];

export const NAV_ITEMS = [
  { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-500' },
  { id: ViewState.BIODATA_GURU, label: 'Biodata Guru', icon: User, color: 'text-emerald-500' },
  { id: ViewState.DATA_SISWA, label: 'Data Siswa', icon: Users, color: 'text-blue-500' },
  { id: ViewState.ABSEN_SISWA, label: 'Absen Siswa', icon: ClipboardCheck, color: 'text-orange-500' },
  { id: ViewState.NILAI_SISWA, label: 'Nilai Siswa', icon: GraduationCap, color: 'text-purple-500' },
  { id: ViewState.PERANGKAT_AJAR, label: 'Perangkat Ajar', icon: BookOpen, color: 'text-pink-500' },
  { id: ViewState.KALENDER, label: 'Kalender', icon: Calendar, color: 'text-red-500' },
  { id: ViewState.AI_STUDIO, label: 'AI Studio', icon: Wand2, color: 'text-teal-500' },
  { id: ViewState.PENGATURAN, label: 'Pengaturan', icon: Settings, color: 'text-slate-500' },
];