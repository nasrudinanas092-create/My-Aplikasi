// Data Pasaran Jawa
export const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
export const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// Reference for Javanese Date: 1 Jan 2024 was Senin Pahing
const REF_DATE = new Date(2024, 0, 1); 
const REF_PASARAN_IDX = 1; // 0=Legi, 1=Pahing, etc.

export const getJavanesePasaran = (date: Date): string => {
  // Reset time to ensure pure date calculation
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const ref = new Date(REF_DATE);
  ref.setHours(0,0,0,0);

  const diffTime = d.getTime() - ref.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate modulo with support for negative numbers
  let idx = (REF_PASARAN_IDX + diffDays) % 5;
  if (idx < 0) idx += 5;
  
  return PASARAN[idx];
};

export const getHijriDate = (date: Date): { day: string; month: string; year: string; full: string } => {
    // Using Intl.DateTimeFormat with Islamic Umm al-Qura calendar
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    return { day, month, year, full: `${day} ${month} ${year}` };
};

// Hardcoded Holidays for 2024-2025 (Sample)
export const HOLIDAYS: Record<string, { name: string; type: 'NASIONAL' | 'PHBI' | 'PHBN' }> = {
    '2024-01-01': { name: 'Tahun Baru 2024 Masehi', type: 'NASIONAL' },
    '2024-02-08': { name: 'Isra Mikraj Nabi Muhammad SAW', type: 'PHBI' },
    '2024-02-10': { name: 'Tahun Baru Imlek 2575 Kongzili', type: 'NASIONAL' },
    '2024-03-11': { name: 'Hari Suci Nyepi Tahun Baru Saka 1946', type: 'PHBN' },
    '2024-03-29': { name: 'Wafat Isa Al Masih', type: 'PHBN' },
    '2024-03-31': { name: 'Hari Paskah', type: 'PHBN' },
    '2024-04-10': { name: 'Hari Raya Idul Fitri 1445 Hijriah', type: 'PHBI' },
    '2024-04-11': { name: 'Hari Raya Idul Fitri 1445 Hijriah', type: 'PHBI' },
    '2024-05-01': { name: 'Hari Buruh Internasional', type: 'NASIONAL' },
    '2024-05-09': { name: 'Kenaikan Isa Al Masih', type: 'PHBN' },
    '2024-05-23': { name: 'Hari Raya Waisak 2568 BE', type: 'PHBN' },
    '2024-06-01': { name: 'Hari Lahir Pancasila', type: 'NASIONAL' },
    '2024-06-17': { name: 'Hari Raya Idul Adha 1445 Hijriah', type: 'PHBI' },
    '2024-07-07': { name: 'Tahun Baru Islam 1446 Hijriah', type: 'PHBI' },
    '2024-08-17': { name: 'Hari Kemerdekaan RI', type: 'NASIONAL' },
    '2024-09-16': { name: 'Maulid Nabi Muhammad SAW', type: 'PHBI' },
    '2024-12-25': { name: 'Hari Raya Natal', type: 'PHBN' },
    // 2025 Samples
    '2025-01-01': { name: 'Tahun Baru 2025 Masehi', type: 'NASIONAL' },
    '2025-01-27': { name: 'Isra Mikraj Nabi Muhammad SAW', type: 'PHBI' },
    '2025-01-29': { name: 'Tahun Baru Imlek 2576 Kongzili', type: 'NASIONAL' },
    '2025-03-29': { name: 'Hari Suci Nyepi Tahun Baru Saka 1947', type: 'PHBN' },
    '2025-03-31': { name: 'Idul Fitri 1446 Hijriah', type: 'PHBI' },
};

export const getRukyatInfo = (hijriMonth: string): string | null => {
    if (hijriMonth.toLowerCase().includes('syaban')) {
        return "Info Falakiyah: Persiapan Rukyatul Hilal Awal Ramadhan. Potensi perbedaan awal puasa sangat kecil tahun ini.";
    }
    if (hijriMonth.toLowerCase().includes('ramadan') || hijriMonth.toLowerCase().includes('ramadhan')) {
        return "Info Falakiyah: Persiapan Rukyatul Hilal Awal Syawal. Sidang Isbat biasanya digelar pada tanggal 29 Ramadhan.";
    }
    return null;
};