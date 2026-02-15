import { User, Guru, Siswa, Absen, Nilai, DokumenAI } from '../types';

// --- TABLE KEYS ---
const TABLES = {
  USERS: 'db_users',
  GURU: 'db_guru',
  SISWA: 'db_siswa',
  ABSEN: 'db_absen',
  NILAI: 'db_nilai',
  DOKUMEN: 'db_dokumen_ai',
  SESSION: 'db_session_meta'
};

// --- HELPER FUNCTIONS ---
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const getTable = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveTable = <T>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data));

// --- SEEDING & INIT ---
export const seedInitialData = () => {
  if (!localStorage.getItem(TABLES.USERS)) {
    // 1. Seed User
    const adminUser: User = {
      id: 'u_admin_01',
      nama_lengkap: 'Nasrudin, S.Pd',
      password: '123', // Demo password
      role: 'guru',
      created_at: new Date().toISOString()
    };
    saveTable(TABLES.USERS, [adminUser]);

    // 2. Seed Guru Profile
    const guruProfile: Guru = {
      id: 'g_01',
      user_id: 'u_admin_01',
      nama_sekolah: 'SMA Negeri 1 Contoh',
      nip: '19850101 201001 1 001',
      kelas_wali: 'XII IPA 1',
      mapel_ampu: 'Bahasa Indonesia',
      alamat: 'Jl. Pendidikan No. 1, Bandung',
      titi_mangsa: 'Bandung',
      avatar: 'https://picsum.photos/200/200',
      nama_kepala_sekolah: 'Dr. H. Kepala Sekolah, M.Pd',
      nip_kepala_sekolah: '19700101 199501 1 002'
    };
    saveTable(TABLES.GURU, [guruProfile]);

    // 3. Seed Siswa Dummy
    const students: Siswa[] = [
      { 
        id: 's_01', guru_id: 'g_01', kelas: 'XII IPA 1', tahun_ajaran: '2024/2025', semester: 'Genap',
        nama: 'Ahmad Rizky', jenis_kelamin: 'L', nisn: '0051234567', created_at: new Date().toISOString()
      },
      { 
        id: 's_02', guru_id: 'g_01', kelas: 'XII IPA 1', tahun_ajaran: '2024/2025', semester: 'Genap',
        nama: 'Citra Kirana', jenis_kelamin: 'P', nisn: '0051234569', created_at: new Date().toISOString()
      },
    ];
    saveTable(TABLES.SISWA, students);
  }
};

// --- AUTH SERVICES ---

export const loginUser = (nama: string, pass: string): { user: User, guru: Guru } | null => {
  const users = getTable<User>(TABLES.USERS);
  const matchedUser = users.find(u => u.nama_lengkap === nama && u.password === pass);
  
  if (matchedUser) {
    const gurus = getTable<Guru>(TABLES.GURU);
    const matchedGuru = gurus.find(g => g.user_id === matchedUser.id);
    
    if (matchedGuru) {
      localStorage.setItem('current_guru_id', matchedGuru.id);
      return { user: matchedUser, guru: matchedGuru };
    }
  }
  return null;
};

export const updatePassword = (userId: string, newPass: string): boolean => {
    const users = getTable<User>(TABLES.USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
        users[idx].password = newPass;
        saveTable(TABLES.USERS, users);
        return true;
    }
    return false;
};

export const getCurrentGuruId = () => localStorage.getItem('current_guru_id');

export const getGuruProfile = (guruId: string): Guru | undefined => {
    return getTable<Guru>(TABLES.GURU).find(g => g.id === guruId);
};

export const saveGuruProfile = (guru: Guru): void => {
    const gurus = getTable<Guru>(TABLES.GURU);
    const idx = gurus.findIndex(g => g.id === guru.id);
    if (idx !== -1) {
        gurus[idx] = guru;
    } else {
        gurus.push(guru);
    }
    saveTable(TABLES.GURU, gurus);
};

// --- SISWA SERVICES ---

export const getSiswaByGuru = (guruId: string): Siswa[] => {
  const allSiswa = getTable<Siswa>(TABLES.SISWA);
  return allSiswa.filter(s => s.guru_id === guruId).sort((a,b) => a.nama.localeCompare(b.nama));
};

export const saveSiswa = (siswa: Partial<Siswa>, guruId: string): void => {
  const allSiswa = getTable<Siswa>(TABLES.SISWA);
  
  if (siswa.id) {
    // Update
    const idx = allSiswa.findIndex(s => s.id === siswa.id);
    if (idx !== -1) {
      allSiswa[idx] = { ...allSiswa[idx], ...siswa } as Siswa;
    }
  } else {
    // Insert
    const newSiswa: Siswa = {
      id: generateId(),
      guru_id: guruId,
      kelas: 'XII IPA 1', // Default, should be dynamic in real app
      tahun_ajaran: '2024/2025',
      semester: 'Genap',
      nama: siswa.nama!,
      jenis_kelamin: siswa.jenis_kelamin!,
      created_at: new Date().toISOString(),
      ...siswa
    } as Siswa;
    allSiswa.push(newSiswa);
  }
  saveTable(TABLES.SISWA, allSiswa);
};

export const deleteSiswa = (id: string): void => {
  let allSiswa = getTable<Siswa>(TABLES.SISWA);
  allSiswa = allSiswa.filter(s => s.id !== id);
  saveTable(TABLES.SISWA, allSiswa);
  
  // Cascade delete (optional but good practice)
  // deleteAbsenBySiswa(id)...
  // deleteNilaiBySiswa(id)...
};

// --- ABSEN SERVICES ---

export const getAbsenByBulan = (siswaIds: string[], bulan: number, tahun: number): Absen[] => {
    const allAbsen = getTable<Absen>(TABLES.ABSEN);
    return allAbsen.filter(a => siswaIds.includes(a.siswa_id) && a.bulan === bulan && a.tahun === tahun);
};

export const upsertAbsen = (siswaId: string, tanggal: string, status: 'H'|'S'|'I'|'A') => {
    const allAbsen = getTable<Absen>(TABLES.ABSEN);
    const dateObj = new Date(tanggal);
    const bulan = dateObj.getMonth() + 1;
    const tahun = dateObj.getFullYear();

    const idx = allAbsen.findIndex(a => a.siswa_id === siswaId && a.tanggal === tanggal);
    
    if (idx !== -1) {
        allAbsen[idx].status = status;
    } else {
        const newAbsen: Absen = {
            id: generateId(),
            siswa_id: siswaId,
            tanggal,
            bulan,
            tahun,
            status
        };
        allAbsen.push(newAbsen);
    }
    saveTable(TABLES.ABSEN, allAbsen);
};

// --- NILAI SERVICES ---

export const getNilaiBySiswa = (siswaId: string, mapel: string): Nilai | undefined => {
    const allNilai = getTable<Nilai>(TABLES.NILAI);
    return allNilai.find(n => n.siswa_id === siswaId && n.mata_pelajaran === mapel);
};

export const upsertNilai = (siswaId: string, mapel: string, field: keyof Nilai, value: number) => {
    const allNilai = getTable<Nilai>(TABLES.NILAI);
    let record = allNilai.find(n => n.siswa_id === siswaId && n.mata_pelajaran === mapel);
    
    if (!record) {
        record = {
            id: generateId(),
            siswa_id: siswaId,
            mata_pelajaran: mapel,
            nilai_harian1: 0, nilai_harian2: 0, nilai_harian3: 0,
            nilai_mid: 0, nilai_pas: 0, nilai_raport: 0
        };
        allNilai.push(record);
    }

    (record as any)[field] = value;

    // Auto Calculate Raport
    // Formula: (Rata2 Harian * 40%) + (MID * 30%) + (PAS * 30%)
    const avgHarian = (record.nilai_harian1 + record.nilai_harian2 + record.nilai_harian3) / 3;
    const raport = (avgHarian * 0.4) + (record.nilai_mid * 0.3) + (record.nilai_pas * 0.3);
    record.nilai_raport = parseFloat(raport.toFixed(1));

    saveTable(TABLES.NILAI, allNilai);
};

// --- DOKUMEN AI SERVICES ---

export const saveDokumenAI = (guruId: string, jenis: string, topik: string, html: string) => {
    const allDocs = getTable<DokumenAI>(TABLES.DOKUMEN);
    allDocs.push({
        id: generateId(),
        guru_id: guruId,
        jenis_dokumen: jenis,
        topik,
        isi_html: html,
        created_at: new Date().toISOString()
    });
    saveTable(TABLES.DOKUMEN, allDocs);
};

export const getDokumenAI = (guruId: string) => {
    return getTable<DokumenAI>(TABLES.DOKUMEN).filter(d => d.guru_id === guruId);
};