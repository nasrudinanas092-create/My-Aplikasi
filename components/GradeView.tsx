import React, { useState, useEffect } from 'react';
import { getSiswaByGuru, getNilaiBySiswa, upsertNilai, getCurrentGuruId } from '../services/storageService';
import { Siswa, Nilai } from '../types';
import { SUBJECTS } from '../constants';
import { GraduationCap, Copy, Search, ChevronRight } from 'lucide-react';

const GradeView: React.FC = () => {
  const [students, setStudents] = useState<Siswa[]>([]);
  // Use a map for easy lookup: [siswaId] -> Nilai
  const [gradesMap, setGradesMap] = useState<Record<string, Nilai>>({});
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [activeTab, setActiveTab] = useState<'INPUT' | 'RECAP'>('INPUT');
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentGuruId = getCurrentGuruId();

  useEffect(() => {
    if (currentGuruId) {
        const dataSiswa = getSiswaByGuru(currentGuruId);
        setStudents(dataSiswa);
        loadGrades(dataSiswa, selectedSubject);
    }
  }, [selectedSubject]);

  const loadGrades = (siswaList: Siswa[], mapel: string) => {
      const newMap: Record<string, Nilai> = {};
      siswaList.forEach(s => {
          const nilai = getNilaiBySiswa(s.id, mapel);
          if (nilai) {
              newMap[s.id] = nilai;
          }
      });
      setGradesMap(newMap);
  };

  const handleInputChange = (siswaId: string, field: keyof Nilai, value: string) => {
    const numVal = value === '' ? 0 : parseFloat(value);
    // Only allow specific fields to be edited directly
    if (field === 'nilai_raport') return; 

    upsertNilai(siswaId, selectedSubject, field, numVal);
    
    // Refresh UI
    if (currentGuruId) loadGrades(students, selectedSubject);
  };

  const handleExportCanva = () => {
      let csv = "Nama,Jenis Kelamin,";
      csv += "Nilai Harian 1, Nilai Harian 2, Nilai Harian 3, MID, PAS, RAPORT\n";

      students.forEach(student => {
          const g = gradesMap[student.id];
          const raport = g ? g.nilai_raport : 0;
          
          csv += `"${student.nama}",${student.jenis_kelamin},`;
          csv += `${g?.nilai_harian1||0},${g?.nilai_harian2||0},${g?.nilai_harian3||0},`;
          csv += `${g?.nilai_mid||0},${g?.nilai_pas||0},${raport}\n`;
      });

      navigator.clipboard.writeText(csv).then(() => {
          alert("Data Nilai berhasil disalin! Format: CSV");
      });
  };

  const filteredStudents = students.filter(s => s.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 h-full flex flex-col animate-morph">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                   <GraduationCap className="text-purple-600 dark:text-purple-400" size={24}/>
                </div>
                Manajemen Nilai
            </h2>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('INPUT')}
                    className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'INPUT' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    Entri Nilai
                </button>
                <button 
                    onClick={() => setActiveTab('RECAP')}
                    className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'RECAP' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    Rekapitulasi
                </button>
            </div>
        </div>

        {/* Content */}
        {activeTab === 'INPUT' ? (
             <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Mata Pelajaran:</label>
                        <select 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="flex-1 sm:w-64 p-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase text-xs focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
                        >
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="relative w-full sm:w-64">
                         <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <input 
                            type="text" 
                            placeholder="Cari siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                         />
                    </div>
                </div>
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10 shadow-sm">
                            <tr className="text-slate-700 dark:text-slate-200 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-700">
                                <th className="p-5 min-w-[240px]">Informasi Nama Siswa</th>
                                <th className="p-5 w-24 text-center">Harian 1</th>
                                <th className="p-5 w-24 text-center">Harian 2</th>
                                <th className="p-5 w-24 text-center">Harian 3</th>
                                <th className="p-5 w-24 text-center bg-orange-50/50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400">MID</th>
                                <th className="p-5 w-24 text-center bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">PAS</th>
                                <th className="p-5 w-28 text-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300">RAPORT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredStudents.map(student => {
                                const g = gradesMap[student.id] || {} as Nilai;
                                return (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-5 font-extrabold text-sm text-slate-900 dark:text-white">{student.nama}</td>
                                        {['nilai_harian1', 'nilai_harian2', 'nilai_harian3', 'nilai_mid', 'nilai_pas'].map((field) => (
                                            <td key={field} className="p-3">
                                                <input 
                                                    type="number" 
                                                    min="0" max="100"
                                                    value={(g as any)[field] || ''}
                                                    onChange={(e) => handleInputChange(student.id, field as keyof Nilai, e.target.value)}
                                                    className="w-full text-center p-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm outline-none transition-all shadow-inner placeholder:text-slate-300"
                                                    placeholder="0"
                                                />
                                            </td>
                                        ))}
                                        <td className="p-5 text-center bg-emerald-50/30 dark:bg-emerald-900/5">
                                            <span className={`text-lg font-black ${ (g.nilai_raport || 0) >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400' }`}>
                                                {g.nilai_raport || 0}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Siswa tidak ditemukan</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Nilai Raport dihitung otomatis: (Rata-rata Harian x 40%) + (MID x 30%) + (PAS x 30%)
                </div>
             </div>
        ) : (
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/40 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-inner">
                    <Copy size={48} />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Pusat Rekapitulasi Nilai</h3>
                 <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-lg font-medium leading-relaxed">
                     Sistem siap mengonversi data nilai mata pelajaran <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase">{selectedSubject}</span> ke dalam format CSV untuk pengolahan spreadsheet tingkat lanjut.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button 
                        onClick={handleExportCanva}
                        className="flex-1 px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Copy size={20} /> SALIN KE CLIPBOARD
                    </button>
                    <button 
                        className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                        onClick={() => alert("Fitur Ekspor XLS Sedang Dikembangkan")}
                    >
                        EKSPOR KE EXCEL
                    </button>
                 </div>
            </div>
        )}
    </div>
  );
};

export default GradeView;