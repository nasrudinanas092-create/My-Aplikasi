import React from 'react';
import { ViewState } from '../types';
import { NAV_ITEMS, MOCK_TEACHER } from '../constants';
import { TrendingUp, Users, Calendar, Award, ArrowUpRight, Zap } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Total Siswa', value: '32', icon: Users, trend: '+2 semester ini', color: 'from-blue-600 to-indigo-600' },
    { label: 'Kehadiran', value: '98%', icon: Calendar, trend: 'Sangat Baik', color: 'from-emerald-600 to-teal-600' },
    { label: 'Rata-rata Nilai', value: '84.5', icon: TrendingUp, trend: '+4.2% progres', color: 'from-purple-600 to-fuchsia-600' },
    { label: 'Prestasi Siswa', value: '5', icon: Award, trend: 'Bulan ini', color: 'from-orange-600 to-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-morph pb-10">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl group">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
                <img 
                    src={MOCK_TEACHER.avatar} 
                    alt="Teacher" 
                    className="w-32 h-32 rounded-3xl border-4 border-white/10 shadow-2xl object-cover transform transition-transform group-hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg animate-float">
                    <Zap size={20} fill="white" />
                </div>
            </div>
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                    Halo, {MOCK_TEACHER.name.split(',')[0]}!
                </h2>
                <p className="text-slate-300 text-lg md:text-xl font-medium max-w-xl opacity-90">
                    Mari kita ciptakan ekosistem belajar yang inspiratif untuk kelas <span className="text-emerald-400 font-bold">{MOCK_TEACHER.class}</span> hari ini.
                </p>
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                    <button 
                        onClick={() => onNavigate(ViewState.PERANGKAT_AJAR)}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                    >
                        Buat Perangkat Ajar <ArrowUpRight size={18} />
                    </button>
                    <button 
                        onClick={() => onNavigate(ViewState.DATA_SISWA)}
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-sm backdrop-blur-md transition-all active:scale-95"
                    >
                        Lihat Data Siswa
                    </button>
                </div>
            </div>
        </div>
        
        {/* Background Visual Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[4rem]`}></div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                        <stat.icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                        {stat.trend}
                    </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Akses Cepat Administrasi</h3>
            <div className="h-1 flex-1 mx-6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {NAV_ITEMS.filter(item => item.id !== ViewState.DASHBOARD).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-emerald-500/30 transition-all group flex flex-col items-center text-center gap-4 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-[0.02] transition-opacity`}></div>
              <div className={`p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-all duration-500 ${item.color}`}>
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-emerald-600 transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Reminder / Insight */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-6 border border-indigo-100 dark:border-indigo-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Zap size={24} fill="currentColor" />
          </div>
          <div>
              <p className="text-indigo-900 dark:text-indigo-300 font-extrabold text-sm uppercase tracking-wide">Analisis Digital Wali Kelas</p>
              <p className="text-indigo-700 dark:text-indigo-400 text-sm mt-0.5 font-medium">
                  Minggu ini 5 siswa belum melengkapi data NISN. Gunakan AI Studio untuk membantu Anda menyusun draf laporan perkembangan siswa secara otomatis.
              </p>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;