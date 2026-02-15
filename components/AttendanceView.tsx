import React, { useState, useEffect } from 'react';
import { getSiswaByGuru, getAbsenByBulan, upsertAbsen, getCurrentGuruId } from '../services/storageService';
import { Siswa, Absen } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Eye, EyeOff, Info, CheckCircle, Clock } from 'lucide-react';

const AttendanceView: React.FC = () => {
  const [students, setStudents] = useState<Siswa[]>([]);
  const [currentAbsen, setCurrentAbsen] = useState<Absen[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(true);

  const currentGuruId = getCurrentGuruId();
  const today = new Date();

  useEffect(() => {
    if (currentGuruId) {
        const dataSiswa = getSiswaByGuru(currentGuruId);
        setStudents(dataSiswa);
        loadAbsensi(dataSiswa);
    }
  }, [selectedMonth, selectedYear]);

  const loadAbsensi = (siswaList: Siswa[]) => {
      const ids = siswaList.map(s => s.id);
      const absensi = getAbsenByBulan(ids, selectedMonth + 1, selectedYear);
      setCurrentAbsen(absensi);
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const handleStatusChange = (studentId: string, day: number) => {
    const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = currentAbsen.find(a => a.siswa_id === studentId && a.tanggal === dateKey);
    const currentStatus = record ? record.status : 'H';
    
    let nextStatus: 'H'|'S'|'I'|'A' = 'S';
    if (currentStatus === 'S') nextStatus = 'I';
    else if (currentStatus === 'I') nextStatus = 'A';
    else if (currentStatus === 'A') nextStatus = 'H';

    upsertAbsen(studentId, dateKey, nextStatus);
    if (currentGuruId) loadAbsensi(students);
  };

  const getMonthlyRecap = (studentId: string) => {
    const records = currentAbsen.filter(a => a.siswa_id === studentId);
    let s = 0, i = 0, a = 0;
    records.forEach(r => {
        if (r.status === 'S') s++;
        if (r.status === 'I') i++;
        if (r.status === 'A') a++;
    });
    return { s, i, a };
  };

  return (
    <div className="space-y-8 h-full flex flex-col animate-morph pb-10">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-500/20">
                   <CalendarIcon size={28}/>
                </div>
                Presensi Digital
            </h2>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                <button onClick={() => {
                    if(selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y-1); }
                    else setSelectedMonth(m => m-1);
                }} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"><ChevronLeft size={20} className="text-slate-600 dark:text-slate-200" /></button>
                <div className="flex flex-col items-center min-w-[160px]">
                    <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-widest">{months[selectedMonth]}</span>
                    <span className="text-[10px] font-bold text-slate-400">{selectedYear}</span>
                </div>
                <button onClick={() => {
                     if(selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y+1); }
                     else setSelectedMonth(m => m+1);
                }} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"><ChevronRight size={20} className="text-slate-600 dark:text-slate-200" /></button>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                <Clock size={16} /> Hari ini: {today.toLocaleDateString('id-ID', {day:'numeric', month:'long'})}
            </div>
            <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
                {showCalendar ? <><EyeOff size={18}/> Sembunyikan Grid</> : <><Eye size={18}/> Buka Kalender Grid</>}
            </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1 relative custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-md z-30">
                    <tr className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-800">
                        <th className="p-6 sticky left-0 bg-slate-50 dark:bg-slate-800 z-40 min-w-[280px]">Nama Peserta Didik</th>
                        {showCalendar && daysArray.map(d => {
                            const isToday = d === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
                            return (
                                <th key={d} className={`p-2 min-w-[42px] text-center border-b dark:border-slate-700 transition-colors ${isToday ? 'bg-orange-500 text-white' : ''}`}>
                                    <div className="flex flex-col">
                                        <span className="text-xs">{String(d).padStart(2, '0')}</span>
                                    </div>
                                </th>
                            );
                        })}
                        <th className="p-6 text-center bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 w-16">S</th>
                        <th className="p-6 text-center bg-emerald-50/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 w-16">I</th>
                        <th className="p-6 text-center bg-red-50/50 dark:bg-red-900/30 text-red-700 dark:text-red-300 w-16">A</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {students.map(student => {
                        const recap = getMonthlyRecap(student.id);
                        return (
                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                <td className="p-6 font-extrabold text-sm sticky left-0 bg-white dark:bg-slate-900 z-20 border-r border-slate-50 dark:border-slate-800 text-slate-900 dark:text-slate-100 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 shadow-r-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full group-hover:bg-orange-500 transition-colors"></div>
                                        {student.nama}
                                    </div>
                                </td>
                                {showCalendar && daysArray.map(d => {
                                    const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                    const record = currentAbsen.find(a => a.siswa_id === student.id && a.tanggal === dateKey);
                                    const status = record ? record.status : 'H';
                                    const isToday = d === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
                                    
                                    let cellClass = "text-slate-200 dark:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700";
                                    let content = <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 mx-auto"></div>;
                                    
                                    if(status === 'S') { cellClass = "bg-blue-600 text-white font-black shadow-lg scale-110 z-10 rounded-lg"; content="S"; }
                                    if(status === 'I') { cellClass = "bg-emerald-600 text-white font-black shadow-lg scale-110 z-10 rounded-lg"; content="I"; }
                                    if(status === 'A') { cellClass = "bg-red-600 text-white font-black shadow-lg scale-110 z-10 rounded-lg"; content="A"; }

                                    return (
                                        <td 
                                            key={d} 
                                            className={`p-1.5 text-center text-xs border border-slate-50 dark:border-slate-800/50 transition-all cursor-pointer ${cellClass} ${isToday && status === 'H' ? 'bg-orange-50 dark:bg-orange-900/10' : ''}`}
                                            onClick={() => handleStatusChange(student.id, d)}
                                        >
                                            {content}
                                        </td>
                                    );
                                })}
                                <td className="p-6 text-center font-black text-blue-700 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-900/10 text-base">{recap.s || '0'}</td>
                                <td className="p-6 text-center font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/10 text-base">{recap.i || '0'}</td>
                                <td className="p-6 text-center font-black text-red-700 dark:text-red-400 bg-red-50/20 dark:bg-red-900/10 text-base">{recap.a || '0'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
      
      {/* Legend & Instructions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-lg"></div> Sakit (S)
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-lg shadow-lg"></div> Izin (I)
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-600 rounded-lg shadow-lg"></div> Alpha (A)
              </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
              <Info size={16} /> Klik sel pada kalender untuk mengubah status kehadiran siswa secara dinamis.
          </div>
      </div>
    </div>
  );
};

export default AttendanceView;