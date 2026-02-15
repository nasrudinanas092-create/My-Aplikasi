import React, { useState, useRef, useEffect } from 'react';
import { generateTeachingDocument, DocParams } from '../services/geminiService';
import { saveDokumenAI, getCurrentGuruId, getGuruProfile } from '../services/storageService';
import { MOCK_TEACHER, SUBJECTS } from '../constants';
import { FileText, Download, Loader2, Save, Wand2, Bold, Italic, List, Undo, Redo } from 'lucide-react';

const DOC_TYPES = [
  'Modul Ajar (Kurikulum Merdeka)',
  'Modul Ajar Deep Learning',
  'RPP Kurikulum 2013 (Kurtilas)',
  'Alur Tujuan Pembelajaran (ATP)',
  'Capaian Pembelajaran (CP) & Analisis',
  'Program Tahunan (Prota)',
  'Program Semester (Promes)',
  'Lembar Kerja Peserta Didik (LKPD)',
  'Silabus',
  'Kriteria Ketuntasan Minimal (KKM)',
  'Jurnal Pembelajaran'
];

const JENJANG_OPTIONS = ['SD/MI', 'SMP/MTs', 'SMA/MA'];

const DocumentGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [logoBase64, setLogoBase64] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'FORM' | 'EDITOR'>('FORM');
  const [apiKey, setApiKey] = useState<string | null>(process.env.API_KEY || null);

  const [formData, setFormData] = useState<DocParams>({
    type: DOC_TYPES[0],
    jenjang: 'SMA/MA',
    teacherName: MOCK_TEACHER.name,
    teacherNip: MOCK_TEACHER.nip,
    schoolName: 'SMA Negeri 1 Contoh',
    headmaster: 'Drs. H. Kepala Sekolah, M.Pd',
    headmasterNip: '19700101 199501 1 001',
    subject: SUBJECTS[0],
    grade: '12',
    topic: '',
    semester: 'Genap',
    year: '2024/2025',
    date: 'Bandung, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  // Load teacher data from DB to autofill
  useEffect(() => {
    const guruId = getCurrentGuruId();
    if (guruId) {
        const profile = getGuruProfile(guruId);
        if (profile) {
            setFormData(prev => ({
                ...prev,
                teacherName: 'Nasrudin, S.Pd', // Assuming linked to user
                teacherNip: profile.nip,
                schoolName: profile.nama_sekolah,
                headmaster: profile.nama_kepala_sekolah || prev.headmaster,
                headmasterNip: profile.nip_kepala_sekolah || prev.headmasterNip,
                subject: profile.mapel_ampu || prev.subject,
                date: (profile.titi_mangsa || 'Bandung') + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            }));
        }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
          const hasKey = await aistudio.hasSelectedApiKey();
          if (hasKey) setApiKey(process.env.API_KEY || 'selected');
      } else {
           setApiKey(process.env.API_KEY || null);
      }
  };
  
  useEffect(() => { checkKey(); }, []);

  const handleSelectKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio?.openSelectKey) {
          try { await aistudio.openSelectKey(); checkKey(); } catch(e) { console.error(e); }
      }
  };

  const handleGenerate = async () => {
    if (!formData.topic) return alert("Mohon isi Materi/Topik Pembelajaran.");
    if (!apiKey) {
        await handleSelectKey();
        if(!process.env.API_KEY) return alert("API Key diperlukan.");
    }

    setIsLoading(true);
    try {
      const generatedHtml = await generateTeachingDocument(formData, process.env.API_KEY || apiKey || '');
      
      let finalHtml = '';
      if (logoBase64) {
          finalHtml += `<div style="text-align: center; margin-bottom: 20px;"><img src="${logoBase64}" width="100" height="auto" alt="Logo Sekolah" /></div>`;
      }
      finalHtml += `<h2 style="text-align:center; text-transform:uppercase; margin-bottom:5px;">${formData.schoolName}</h2>`;
      finalHtml += `<p style="text-align:center; font-weight:bold; border-bottom: 3px double black; padding-bottom: 10px; margin-bottom: 20px;">${formData.type.toUpperCase()}</p>`;
      finalHtml += generatedHtml;

      setContent(finalHtml);
      
      // Auto-save to DB
      const currentGuruId = getCurrentGuruId();
      if (currentGuruId) {
          saveDokumenAI(currentGuruId, formData.type, formData.topic, finalHtml);
      }

      setActiveTab('EDITOR');
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadWord = () => {
    if (!editorRef.current) return;
    const htmlContent = editorRef.current.innerHTML;
    const preHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${formData.type}</title>
      <style>body{font-family:'Times New Roman',serif;font-size:12pt}table{width:100%;border-collapse:collapse}td,th{padding:5px;border:1px solid black}</style>
      </head><body>`;
    const postHtml = "</body></html>";
    const fullHtml = preHtml + htmlContent + postHtml;

    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${formData.type} - ${formData.topic}.doc`;
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Grade Options based on Level
  const getGradeOptions = () => {
      if (formData.jenjang === 'SD/MI') return ['1', '2', '3', '4', '5', '6'];
      if (formData.jenjang === 'SMP/MTs') return ['7', '8', '9'];
      return ['10', '11', '12'];
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-morph">
       <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Generator Perangkat Ajar
            </h2>
            <p className="mt-2 opacity-90">
            Buat dokumen administrasi otomatis dengan AI & Simpan ke Database.
            </p>
        </div>
        {!apiKey && (
            <button onClick={handleSelectKey} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-colors">
                Connect API Key
            </button>
        )}
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        
        <div className="flex border-b border-slate-100 dark:border-slate-700">
            <button 
                onClick={() => setActiveTab('FORM')}
                className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${activeTab === 'FORM' ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
                1. Data Dokumen
            </button>
            <button 
                onClick={() => setActiveTab('EDITOR')}
                disabled={!content}
                className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${activeTab === 'EDITOR' ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'text-slate-400 cursor-not-allowed'}`}
            >
                2. Edit & Download
            </button>
        </div>

        {activeTab === 'FORM' && (
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jenis Dokumen</label>
                                <select 
                                    value={formData.type} 
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-pink-500 outline-none"
                                >
                                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                             </div>
                             
                             <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Upload Logo Sekolah (Opsional)</label>
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jenjang</label>
                                    <select 
                                        value={formData.jenjang} 
                                        onChange={e => setFormData({...formData, jenjang: e.target.value, grade: e.target.value === 'SD/MI' ? '1' : e.target.value === 'SMP/MTs' ? '7' : '10'})}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-pink-500 outline-none"
                                    >
                                        {JENJANG_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kelas</label>
                                    <select 
                                        value={formData.grade} 
                                        onChange={e => setFormData({...formData, grade: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-pink-500 outline-none"
                                    >
                                        {getGradeOptions().map(g => <option key={g} value={g}>Kelas {g}</option>)}
                                    </select>
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mata Pelajaran</label>
                                <select 
                                    value={formData.subject} 
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-pink-500 outline-none"
                                >
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Materi / Topik Pembelajaran <span className="text-red-500">*</span></label>
                                <textarea 
                                    value={formData.topic} 
                                    onChange={e => setFormData({...formData, topic: e.target.value})} 
                                    placeholder="Contoh: Teks Eksposisi / Hukum Newton"
                                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-pink-500 outline-none h-24" 
                                />
                             </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Tahun Ajaran</label>
                                    <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                                    <select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Ganjil">Ganjil</option>
                                        <option value="Genap">Genap</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Titi Mangsa</label>
                                <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Guru Mata Pelajaran</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Nama" type="text" value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                    <input placeholder="NIP" type="text" value={formData.teacherNip} onChange={e => setFormData({...formData, teacherNip: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Kepala Sekolah</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Nama" type="text" value={formData.headmaster} onChange={e => setFormData({...formData, headmaster: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                    <input placeholder="NIP" type="text" value={formData.headmasterNip} onChange={e => setFormData({...formData, headmasterNip: e.target.value})} className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        {isLoading ? 'Sedang Menyusun Dokumen...' : 'GENERATE & SIMPAN DOKUMEN'}
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'EDITOR' && (
            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div className="p-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex gap-2 justify-center shadow-sm z-10">
                    <button onClick={() => execCmd('bold')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Bold size={18} /></button>
                    <button onClick={() => execCmd('italic')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Italic size={18} /></button>
                    <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><List size={18} /></button>
                    <div className="w-px bg-slate-300 mx-2"></div>
                    <button onClick={() => execCmd('undo')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Undo size={18} /></button>
                    <button onClick={() => execCmd('redo')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Redo size={18} /></button>
                    <div className="flex-1"></div>
                    <button 
                        onClick={handleDownloadWord}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Download size={16} /> Download .DOCX
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div 
                        className="bg-white text-black shadow-2xl p-[2.54cm] min-h-[29.7cm] w-[21cm] outline-none"
                        contentEditable
                        ref={editorRef}
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{
                            fontFamily: "'Times New Roman', Times, serif",
                            fontSize: '12pt',
                            lineHeight: '1.15'
                        }}
                    >
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default DocumentGenerator;