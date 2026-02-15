import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Moon, Info, Cloud, Wifi, Plus } from 'lucide-react';
import { getHijriDate, getJavanesePasaran, HOLIDAYS, DAYS_ID, MONTHS_ID, getRukyatInfo } from '../utils/calendarHelpers';

type ViewMode = 'MONTH' | 'WEEK';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('MONTH');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  // Derive display data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const hijriInfo = getHijriDate(currentDate);

  // Generate days for grid
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = getDaysInMonth(year, month);
  
  // Previous month filler
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const days = [];

  // Add prev month days
  for (let i = 0; i < firstDayOfMonth; i++) {
    const d = new Date(year, month - 1, prevMonthDays - firstDayOfMonth + 1 + i);
    days.push({ date: d, isCurrentMonth: false });
  }
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({ date: d, isCurrentMonth: true });
  }
  // Add next month days to fill grid (42 cells total usually covers all)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isCurrentMonth: false });
  }

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSync = () => {
      // Simulation
      const confirmSync = confirm("Hubungkan dengan Google Calendar (Akun Belajar.id)?\n\nIni akan menyinkronkan jadwal mengajar dan agenda sekolah.");
      if (confirmSync) {
          setIsSynced(true);
      }
  };

  const isToday = (d: Date) => {
      const today = new Date();
      return d.getDate() === today.getDate() && 
             d.getMonth() === today.getMonth() && 
             d.getFullYear() === today.getFullYear();
  };

  const getHoliday = (d: Date) => {
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      return HOLIDAYS[key];
  };

  // Filter days for week view if enabled
  const visibleDays = viewMode === 'MONTH' ? days : days.filter(d => {
       // Logic to show only the current week of 'currentDate'
       // Simplification: just show the week containing the 1st of month or current date
       // For better UX, currentDate state should track the specific week start in Week Mode.
       // Keeping it simple for this prompt: Week mode shows the first 7 visible days roughly or current week.
       // Let's stick to Month view logic as primary, Week view just slices the array around today.
       return true; 
  });
  
  // Actually implementing Week View slice properly
  const weekDays = [];
  if (viewMode === 'WEEK') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      for(let i=0; i<7; i++) {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          weekDays.push({ date: d, isCurrentMonth: d.getMonth() === month });
      }
  }

  const renderList = viewMode === 'WEEK' ? weekDays : days;
  const rukyatInfo = getRukyatInfo(hijriInfo.month);

  return (
    <div className="space-y-6 h-full flex flex-col animate-morph">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Titles */}
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
                         {MONTHS_ID[month]} <span className="text-slate-400 font-light">{year}</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Moon size={16} />
                        <span>{hijriInfo.month} {hijriInfo.year}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                    <button onClick={handlePrev} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                        Hari Ini
                    </button>
                    <button onClick={handleNext} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('MONTH')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'MONTH' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Bulanan
                        </button>
                        <button 
                            onClick={() => setViewMode('WEEK')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'WEEK' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Mingguan
                        </button>
                    </div>
                    <button 
                        onClick={handleSync}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSynced ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {isSynced ? <Cloud size={16} /> : <Wifi size={16} />}
                        {isSynced ? 'Terhubung' : 'Sync Google'}
                    </button>
                </div>
            </div>
            
            {/* Falakiyah Info Banner */}
            {rukyatInfo && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-3 border border-emerald-100 dark:border-emerald-800">
                    <Info size={18} />
                    {rukyatInfo}
                </div>
            )}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
                {DAYS_ID.map((day, idx) => (
                    <div key={day} className={`py-4 text-center text-sm font-bold ${idx === 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {renderList.map((item, idx) => {
                    const hijri = getHijriDate(item.date);
                    const pasaran = getJavanesePasaran(item.date);
                    const holiday = getHoliday(item.date);
                    const isRedDate = item.date.getDay() === 0 || !!holiday;
                    const isTodayDate = isToday(item.date);

                    return (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedDate(item.date)}
                            className={`
                                min-h-[100px] p-2 border-b border-r border-slate-50 dark:border-slate-700/50 relative group transition-colors cursor-pointer
                                ${!item.isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50 opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'}
                                ${isTodayDate ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                            `}
                        >
                            {/* Header Date */}
                            <div className="flex justify-between items-start">
                                <span className={`text-lg font-bold leading-none ${isRedDate ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'} ${isTodayDate ? 'text-blue-600' : ''}`}>
                                    {item.date.getDate()}
                                </span>
                                <div className="text-[10px] text-right">
                                    <div className="text-emerald-600 dark:text-emerald-400 font-medium">{hijri.day}</div>
                                    <div className="text-amber-600 dark:text-amber-500">{pasaran}</div>
                                </div>
                            </div>

                            {/* Holiday Label */}
                            {holiday && (
                                <div className={`mt-2 text-[10px] leading-tight p-1 rounded font-medium ${holiday.type === 'NASIONAL' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {holiday.name}
                                </div>
                            )}

                            {/* Add Button (On Hover) */}
                            <button className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full items-center justify-center hidden group-hover:flex shadow-lg hover:scale-110 transition-transform">
                                <Plus size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 px-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 rounded border border-red-200"></div> Libur Nasional
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-100 rounded border border-emerald-200"></div> PHBI (Islam)
            </div>
            <div className="flex items-center gap-2">
                <span className="text-amber-600">Legi, Pahing, ...</span> Kalender Jawa (Pasaran)
            </div>
            <div className="flex-1 text-right italic">
                *Sinkronisasi Falakiyah berdasarkan kriteria MABIMS Kemenag RI (Perkiraan)
            </div>
        </div>
    </div>
  );
};

export default CalendarView;