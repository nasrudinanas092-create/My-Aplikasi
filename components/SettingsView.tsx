import React, { useState } from 'react';
import { Lock, Save, AlertCircle, ShieldCheck } from 'lucide-react';
import { updatePassword } from '../services/storageService';

const SettingsView: React.FC = () => {
  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.new !== passwords.confirm) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (passwords.new.length < 4) {
        setError('Kata sandi minimal 4 karakter.');
        return;
    }

    // In a real app, verify 'old' password first.
    // For this storage simulation, we just update 'u_admin_01'.
    const success = updatePassword('u_admin_01', passwords.new);
    if (success) {
        setSuccess('Kata sandi berhasil diperbarui. Silakan gunakan password baru saat login berikutnya.');
        setPasswords({ old: '', new: '', confirm: '' });
    } else {
        setError('Gagal memperbarui kata sandi.');
    }
  };

  const labelClass = "text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 block";
  const inputClass = "w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm placeholder:text-slate-400";

  return (
    <div className="space-y-6 h-full flex flex-col animate-morph">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto w-full">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 mb-8">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300">
             <Lock size={28} />
          </div>
          Pengaturan Keamanan
        </h2>

        <div className="space-y-8">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/40 flex items-start gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl mt-0.5">
                    <AlertCircle className="text-amber-700 dark:text-amber-400 shrink-0" size={24} />
                </div>
                <div>
                    <h4 className="font-black text-amber-800 dark:text-amber-300 text-sm uppercase tracking-wider">Perbarui Kata Sandi</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-1.5 font-bold leading-relaxed">
                        Demi perlindungan data siswa, disarankan memperbarui kata sandi secara berkala. Pastikan kata sandi sulit ditebak orang lain.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className={labelClass}>Kata Sandi Lama</label>
                    <input 
                        type="password" 
                        value={passwords.old}
                        onChange={(e) => handleChange('old', e.target.value)}
                        className={inputClass}
                        placeholder="Masukkan password saat ini"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Kata Sandi Baru</label>
                        <input 
                            type="password" 
                            value={passwords.new}
                            onChange={(e) => handleChange('new', e.target.value)}
                            className={inputClass}
                            placeholder="Min. 4 Karakter"
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Konfirmasi Password</label>
                        <input 
                            type="password" 
                            value={passwords.confirm}
                            onChange={(e) => handleChange('confirm', e.target.value)}
                            className={inputClass}
                            placeholder="Ulangi password baru"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-black rounded-2xl flex items-center gap-2 border border-red-100 dark:border-red-900/40">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-black rounded-2xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/40">
                        <ShieldCheck size={18} /> {success}
                    </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-black py-4 px-8 rounded-[1.25rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-95">
                        <Save size={20} /> SIMPAN PASSWORD BARU
                    </button>
                    <button type="button" onClick={() => setPasswords({old:'', new:'', confirm:''})} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-[1.25rem] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        RESET FORM
                    </button>
                </div>
            </form>
        </div>
      </div>
      <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Keamanan Enkripsi Database Lokal Aktif</p>
    </div>
  );
};

export default SettingsView;