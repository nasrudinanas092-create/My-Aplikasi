import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, CheckCircle, HelpCircle } from 'lucide-react';
import { loginUser } from '../services/storageService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
        // Try login via DB Service
        const result = loginUser(name, password);
        
        // Fallback for demo if DB is empty or password is simply 123
        if (result || (password === '123' && name.length > 0)) {
            // If fallback login, ensure we set a mock ID
            if (!result && !localStorage.getItem('current_guru_id')) {
                localStorage.setItem('current_guru_id', 'g_01'); 
            }
            onLogin();
        } else {
            setError('Nama atau kata sandi salah.');
            setIsLoading(false);
        }
    }, 800);
  };

  const handleForgotPassword = () => {
      alert("Fitur Lupa Kata Sandi:\n\nSilakan hubungi Administrator sekolah untuk mereset kata sandi Anda, atau gunakan fitur 'Reset Password' di menu Pengaturan setelah masuk (jika masih ingat password lama).");
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 relative z-10 animate-morph">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-4xl font-extrabold text-white">AW</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">APLIKASI ADMINISTRASI<br/>WALI KELAS</h1>
            <p className="text-slate-500 text-sm">Silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Nama Lengkap Guru</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Nasrudin, S.Pd"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Kata Sandi</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="flex justify-end">
                    <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                        Lupa Kata Sandi?
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>Masuk Aplikasi <CheckCircle size={18} /></>
                )}
            </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
             <p className="text-xs text-slate-400 mb-2">Default Login: User: Nasrudin, S.Pd | Pass: 123</p>
             <p className="text-xs font-bold text-slate-500 italic">
                Aplikasi ini dikembangkan oleh : Nasrudin, S.Pd
             </p>
        </div>
      </div>
    </div>
  );
};

export default Login;