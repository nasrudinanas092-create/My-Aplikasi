import React, { useState, useEffect } from 'react';
import { User, School, MapPin, Save, UserCheck, Calendar } from 'lucide-react';
import { Guru } from '../types';
import { getGuruProfile, saveGuruProfile, getCurrentGuruId } from '../services/storageService';

const BiodataView: React.FC = () => {
  const [profile, setProfile] = useState<Guru | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const guruId = getCurrentGuruId();
    if (guruId) {
      const data = getGuruProfile(guruId);
      if (data) setProfile(data);
    }
    setLoading(false);
  }, []);

  const handleChange = (field: keyof Guru, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      setSaving(true);
      setTimeout(() => {
        saveGuruProfile(profile);
        setSaving(false);
        alert('Biodata berhasil disimpan!');
      }, 800);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600 dark:text-slate-400 font-bold">Memuat data...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500 font-bold">Data Guru tidak ditemukan. Silakan login ulang.</div>;

  const labelClass = "text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 block";
  const inputClass = "w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold transition-all shadow-sm placeholder:text-slate-400";
  const disabledInputClass = "w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold cursor-not-allowed opacity-80 shadow-inner";

  return (
    <div className="space-y-6 h-full flex flex-col animate-morph">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
             <User className="text-emerald-600 dark:text-emerald-400" size={28} />
          </div>
          Biodata Guru & Sekolah
        </h2>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section: Data Pribadi Guru */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase text-xs tracking-widest border-l-4 border-emerald-500 pl-3">Data Profil Guru</h3>
            
            <div>
              <label className={labelClass}>Nama Lengkap & Gelar</label>
              <input 
                type="text" 
                value={profile.user_id === 'u_admin_01' ? 'Nasrudin, S.Pd' : ''}
                readOnly
                disabled
                className={disabledInputClass}
                title="Nama diambil dari akun login"
              />
               <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-bold italic">*Nama otomatis sinkron dengan akun pengguna.</p>
            </div>

            <div>
              <label className={labelClass}>NIP / NIY</label>
              <input 
                type="text" 
                value={profile.nip}
                onChange={(e) => handleChange('nip', e.target.value)}
                className={inputClass}
                placeholder="Contoh: 19850101..."
              />
            </div>

            <div>
              <label className={labelClass}>Kelas Wali</label>
              <input 
                type="text" 
                value={profile.kelas_wali || ''}
                onChange={(e) => handleChange('kelas_wali', e.target.value)}
                placeholder="Contoh: XII IPA 1"
                className={inputClass}
              />
            </div>

             <div>
              <label className={labelClass}>Mata Pelajaran Utama</label>
              <input 
                type="text" 
                value={profile.mapel_ampu || ''}
                onChange={(e) => handleChange('mapel_ampu', e.target.value)}
                className={inputClass}
                placeholder="Contoh: Matematika"
              />
            </div>
          </div>

          {/* Section: Data Sekolah */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-blue-700 dark:text-blue-400 uppercase text-xs tracking-widest border-l-4 border-blue-500 pl-3">Identitas Satuan Pendidikan</h3>

            <div>
              <label className={labelClass}>Nama Sekolah</label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={profile.nama_sekolah}
                    onChange={(e) => handleChange('nama_sekolah', e.target.value)}
                    className={`${inputClass} pl-11`}
                    placeholder="Nama Sekolah Anda"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Alamat Lengkap Sekolah</label>
              <div className="relative">
                 <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                 <textarea 
                    value={profile.alamat || ''}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    className={`${inputClass} pl-11 h-32 resize-none`}
                    placeholder="Jln. Pendidikan No. 123..."
                 />
              </div>
            </div>

            <div>
              <label className={labelClass}>Titi Mangsa (Kota Penandatanganan)</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={profile.titi_mangsa || ''}
                    onChange={(e) => handleChange('titi_mangsa', e.target.value)}
                    placeholder="Contoh: Bandung"
                    className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          </div>

          {/* Section: Kepala Sekolah */}
          <div className="md:col-span-2 space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <h3 className="font-extrabold text-purple-700 dark:text-purple-400 uppercase text-xs tracking-widest border-l-4 border-purple-500 pl-3">Otoritas Kepala Sekolah</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={labelClass}>Nama Kepala Sekolah</label>
                    <div className="relative">
                        <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={profile.nama_kepala_sekolah || ''}
                            onChange={(e) => handleChange('nama_kepala_sekolah', e.target.value)}
                            placeholder="Contoh: Dr. H. Budi Santoso, M.Pd"
                            className={`${inputClass} pl-11`}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>NIP / NIY Kepala Sekolah</label>
                    <input 
                        type="text" 
                        value={profile.nip_kepala_sekolah || ''}
                        onChange={(e) => handleChange('nip_kepala_sekolah', e.target.value)}
                        className={inputClass}
                        placeholder="NIP Kepala Sekolah"
                    />
                </div>
             </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-8">
             <button 
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-extrabold py-4 px-10 rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
             >
                {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <Save size={22} />}
                {saving ? 'Sedang Menyimpan...' : 'SIMPAN PERUBAHAN BIODATA'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BiodataView;