
import React, { useState, useEffect } from 'react';
import { Siswa } from '../types';
import { getSiswaByGuru, saveSiswa, deleteSiswa, getCurrentGuruId } from '../services/storageService';
// Added Sparkles to the import list
import { Search, Trash2, Edit2, Plus, X, Save, UserCircle, Download, Filter, UserCheck, Sparkles } from 'lucide-react';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Siswa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const currentGuruId = getCurrentGuruId();
  const [formData, setFormData] = useState<Partial<Siswa>>({ jenis_kelamin: 'L' });

  useEffect(() => { refreshData(); }, []);

  const refreshData = () => { if (currentGuruId) setStudents(getSiswaByGuru(currentGuruId)); };

  const handleOpenModal = (student?: Siswa) => {
    if (student) { setEditingId(student.id); setFormData({ ...student }); }
    else { setEditingId(null); setFormData({ jenis_kelamin: 'L', nama: '', kelas: 'XII IPA 1', tahun_ajaran: '2024/2025', semester: 'Genap' }); }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus data siswa ini secara permanen?')) { deleteSiswa(id); refreshData(); }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return alert("Nama wajib diisi!");
    if (!currentGuruId) return;
    saveSiswa(formData, currentGuruId);
    setIsModalOpen(false);
    refreshData();
  };

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || (s.nisn && s.nisn.includes(searchTerm))
  );

  const labelClass = "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block";
  const inputClass = "w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-medium shadow-sm";

  return (
    <div className="space-y-8 h-full flex flex-col animate-morph pb-10">
        {/* Superior Header */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                    <UserCheck size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Database Siswa</h2>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{students.length} Siswa Terdaftar</p>
                </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari nama, NISN..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 transition-all shadow-inner"
                    />
                </div>
                <button onClick={() => handleOpenModal()} className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
                    <Plus size={24} />
                </button>
            </div>
        </div>

        {/* Master Table Container */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col relative">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md z-10">
                        <tr className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-800">
                            <th className="p-6 text-center w-20">Rank</th>
                            <th className="p-6">Identitas Siswa</th>
                            <th className="p-6 text-center">Gender</th>
                            <th className="p-6">Nomer Induk / NISN</th>
                            <th className="p-6 hidden lg:table-cell">Aspirasi</th>
                            <th className="p-6 text-right">Manajemen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {filteredStudents.map((student, idx) => (
                            <tr key={student.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                                <td className="p-6 text-center">
                                    <span className="text-slate-400 dark:text-slate-600 font-black italic">#{idx + 1}</span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black text-lg shadow-sm transform transition-transform group-hover:rotate-6 ${student.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400'}`}>
                                            {student.nama.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-slate-900 dark:text-white font-extrabold text-base mb-0.5">{student.nama}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{student.kelas} • {student.tahun_ajaran}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest ${student.jenis_kelamin === 'L' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300'}`}>
                                        {student.jenis_kelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className="text-slate-900 dark:text-slate-300 font-bold text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700 shadow-inner">
                                        {student.nisn || '---'}
                                    </span>
                                </td>
                                <td className="p-6 hidden lg:table-cell">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 italic text-sm font-medium">
                                        <Sparkles size={14} className="text-emerald-500" />
                                        <span>{student.cita_cita || 'Belum diisi'}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleOpenModal(student)} className="p-3 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-all hover:text-blue-600 dark:hover:text-blue-400">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(student.id)} className="p-3 text-slate-600 hover:bg-red-50 dark:text-slate-400 dark:hover:bg-red-900/20 rounded-xl transition-all hover:text-red-600 dark:hover:text-red-400">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div className="p-32 text-center">
                        <UserCircle size={80} className="mx-auto text-slate-200 dark:text-slate-800 mb-4 animate-float" />
                        <h4 className="text-xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">Data Tidak Tersedia</h4>
                    </div>
                )}
            </div>
        </div>

        {/* Improved Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-morph">
                <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/10">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <UserCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {editingId ? 'Edit Identitas Siswa' : 'Registrasi Peserta Didik'}
                            </h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all active:scale-90">
                            <X size={28} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Column 1: Biodata */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] border-b-2 border-emerald-500/10 pb-2">Informasi Biodata Inti</h4>
                            <div>
                                <label className={labelClass}>Nama Lengkap Siswa</label>
                                <input type="text" required value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} className={inputClass} placeholder="Nama sesuai akta lahir" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Jenis Kelamin</label>
                                    <select value={formData.jenis_kelamin} onChange={e => setFormData({...formData, jenis_kelamin: e.target.value as 'L'|'P'})} className={inputClass}>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>NISN Siswa</label>
                                    <input type="text" value={formData.nisn || ''} onChange={e => setFormData({...formData, nisn: e.target.value})} className={inputClass} placeholder="10 Digit angka" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Domisili / Alamat</label>
                                <textarea rows={4} value={formData.alamat || ''} onChange={e => setFormData({...formData, alamat: e.target.value})} className={`${inputClass} h-32 resize-none`} placeholder="Alamat lengkap tempat tinggal..." />
                            </div>
                        </div>

                        {/* Column 2: Details */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] border-b-2 border-blue-500/10 pb-2">Keluarga & Potensi</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Ayah Kandung</label>
                                    <input type="text" value={formData.nama_ayah || ''} onChange={e => setFormData({...formData, nama_ayah: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Ibu Kandung</label>
                                    <input type="text" value={formData.nama_ibu || ''} onChange={e => setFormData({...formData, nama_ibu: e.target.value})} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Cita-cita / Aspirasi</label>
                                <div className="relative">
                                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-50" size={18} />
                                    <input type="text" value={formData.cita_cita || ''} onChange={e => setFormData({...formData, cita_cita: e.target.value})} className={inputClass} placeholder="Mimpi besar siswa..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 pt-4">
                                <div>
                                    <label className={labelClass}>Tinggi (cm)</label>
                                    <input type="number" value={formData.tinggi_badan || ''} onChange={e => setFormData({...formData, tinggi_badan: Number(e.target.value)})} className={`${inputClass} text-center`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Berat (kg)</label>
                                    <input type="number" value={formData.berat_badan || ''} onChange={e => setFormData({...formData, berat_badan: Number(e.target.value)})} className={`${inputClass} text-center`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Kepala (cm)</label>
                                    <input type="number" value={formData.lingkar_kepala || ''} onChange={e => setFormData({...formData, lingkar_kepala: Number(e.target.value)})} className={`${inputClass} text-center`} />
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-xs uppercase tracking-widest transition-all">Batalkan</button>
                        <button type="button" onClick={handleSave} className="px-12 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 transition-all flex items-center gap-3 active:scale-95">
                            <Save size={20} /> Simpan Seluruh Data
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default StudentList;
