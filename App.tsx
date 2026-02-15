import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, LogOut, CheckCircle, Cloud 
} from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import AttendanceView from './components/AttendanceView';
import GradeView from './components/GradeView';
import AiStudio from './components/AiStudio';
import DocumentGenerator from './components/DocumentGenerator';
import CalendarView from './components/CalendarView';
import BiodataView from './components/BiodataView';
import SettingsView from './components/SettingsView';
import { ViewState, AcademicYear, Semester } from './types';
import { NAV_ITEMS, MOCK_TEACHER, ACADEMIC_YEARS } from './constants';
import { seedInitialData } from './services/storageService';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Global Settings State
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2024/2025');
  const [semester, setSemester] = useState<Semester>('Genap');

  useEffect(() => {
    seedInitialData(); // Initialize DB if empty
    
    // Auto theme brightness simulation
    const hours = new Date().getHours();
    const isNight = hours >= 18 || hours < 6;
    if (isNight) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(ViewState.DASHBOARD);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={(view) => setCurrentView(view)} />;
      case ViewState.BIODATA_GURU:
        return <BiodataView />;
      case ViewState.DATA_SISWA:
        return <StudentList />;
      case ViewState.ABSEN_SISWA:
        return <AttendanceView />;
      case ViewState.NILAI_SISWA:
        return <GradeView />;
      case ViewState.AI_STUDIO:
        return <AiStudio />;
      case ViewState.PERANGKAT_AJAR:
        return <DocumentGenerator />;
      case ViewState.KALENDER:
        return <CalendarView />;
      case ViewState.PENGATURAN:
        return <SettingsView />;
      default:
        const CurrentIcon = NAV_ITEMS.find(n => n.id === currentView)?.icon;
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 animate-morph">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
               {CurrentIcon && <CurrentIcon size={40} />}
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Halaman {NAV_ITEMS.find(n => n.id === currentView)?.label}</h2>
            <p>Fitur ini sedang dalam pengembangan.</p>
            <button 
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors shadow-lg"
            >
                Kembali ke Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    A
                </div>
                <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-blue-700 dark:from-emerald-400 dark:to-blue-400 text-lg leading-tight">
                    ADMINISTRASI<br/>WALI KELAS
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setCurrentView(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm
                                ${isActive 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-emerald-800' 
                                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={20} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70'} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Academic Year Selector in Sidebar */}
            <div className="px-4 py-4 border-t border-slate-50 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
                    <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1.5">Tahun Ajaran</span>
                        <select 
                            value={academicYear} 
                            onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                            className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        >
                            {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1.5">Semester</span>
                         <select 
                            value={semester} 
                            onChange={(e) => setSemester(e.target.value as Semester)}
                            className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        >
                            <option value="Ganjil">Ganjil</option>
                            <option value="Genap">Genap</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold text-sm"
                >
                    <LogOut size={20} />
                    Keluar Aplikasi
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
        
        {/* Header */}
        <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <button 
                className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(true)}
            >
                <Menu />
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ml-auto lg:ml-0">
                 <span className="hidden sm:inline bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide">
                     {academicYear} • {semester}
                 </span>
            </div>

            <div className="flex items-center gap-4 ml-4">
                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-yellow-400 hover:scale-110 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{MOCK_TEACHER.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Wali Kelas {MOCK_TEACHER.class}</p>
                    </div>
                    <img 
                        src={MOCK_TEACHER.avatar} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover shadow-md"
                    />
                </div>
            </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            <div className="max-w-7xl mx-auto h-full">
                {renderContent()}
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;