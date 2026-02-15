import React, { useState, useEffect } from 'react';
import { generateImageWithGemini, generateVideoWithVeo } from '../services/geminiService';
import { Wand2, Video, Image as ImageIcon, Loader2, AlertCircle, Download, Sparkles, RefreshCcw } from 'lucide-react';

const AiStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(process.env.API_KEY || null);

  const checkKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.hasSelectedApiKey) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (hasKey) setApiKey(process.env.API_KEY || 'selected');
    }
  };

  useEffect(() => { checkKey(); }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
        try {
            await aistudio.openSelectKey();
            setApiKey(process.env.API_KEY || 'selected'); 
        } catch (e) { console.error(e); }
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setResultUrl(null);

    if (activeTab === 'video' && (!apiKey || apiKey === '')) {
         await handleSelectKey();
    }
    
    const currentKey = process.env.API_KEY; 
    if (!currentKey) {
        setError("API Key diperlukan. Silakan pilih API Key di panel.");
        setIsLoading(false);
        return;
    }

    try {
      if (activeTab === 'image') {
        const result = await generateImageWithGemini(prompt, currentKey);
        if (result.data) setResultUrl(result.data);
        else setError(result.error || "Gagal membuat gambar.");
      } else {
        const url = await generateVideoWithVeo(prompt, currentKey);
        setResultUrl(url);
      }
    } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat generate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-morph pb-10">
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <Sparkles className="w-8 h-8" />
            </div>
            AI Creative Studio
            </h2>
            <p className="text-white/80 text-lg font-medium max-w-2xl leading-relaxed">
            Hadirkan pembelajaran visual masa depan. Ciptakan ilustrasi dan video edukasi berkualitas tinggi dalam hitungan detik.
            </p>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => { setActiveTab('image'); setResultUrl(null); setError(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'image'
                            ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xl'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <ImageIcon size={18} /> Ilustrasi
                    </button>
                    <button
                        onClick={() => { setActiveTab('video'); setResultUrl(null); setError(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'video'
                            ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xl'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <Video size={18} /> Video (Veo)
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">
                            Deskripsi Visual (Prompt)
                        </label>
                        <textarea
                            className="w-full p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none h-40 placeholder:text-slate-400 placeholder:font-medium"
                            placeholder={activeTab === 'image' 
                                ? "Contoh: Lukisan cat air tentang ekosistem hutan hujan tropis dengan flora yang detail..." 
                                : "Contoh: Video gerakan planet-planet mengitari matahari secara sinematik..."}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
                        isLoading || !prompt
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/40'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw className={isLoading ? 'animate-spin' : ''} size={20} />}
                        {isLoading ? 'Processing Magic...' : 'Mulai Generasi'}
                    </button>

                    {activeTab === 'video' && !apiKey && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="text-amber-600 shrink-0" size={18} />
                            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-tighter">
                                Fitur video memerlukan API Key berbayar yang dikonfigurasi pada environment ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Result Preview */}
        <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner-dark">
                {error && (
                    <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-[2rem] max-w-md animate-morph">
                        <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">Terjadi Kesalahan</h4>
                        <p className="text-sm font-medium text-red-600 dark:text-red-300 opacity-80">{error}</p>
                    </div>
                )}

                {!isLoading && !resultUrl && !error && (
                    <div className="text-center text-slate-300 dark:text-slate-700 space-y-4">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                            {activeTab === 'image' ? <ImageIcon size={48} strokeWidth={1} /> : <Video size={48} strokeWidth={1} />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-black text-slate-400 dark:text-slate-600">Menunggu Kreativitas Anda</p>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Isi prompt dan tekan mulai</p>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="relative">
                            <div className="w-32 h-32 border-[6px] border-teal-100 dark:border-teal-900/40 border-t-teal-600 rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-600 w-10 h-10 animate-float" />
                        </div>
                        <div className="mt-8 text-center space-y-2">
                            <p className="text-xl font-black text-teal-700 dark:text-teal-400 tracking-tight uppercase">AI Sedang Melukis...</p>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Jangan tutup halaman ini</p>
                        </div>
                    </div>
                )}

                {resultUrl && !isLoading && (
                    <div className="w-full h-full flex flex-col items-center animate-morph p-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 w-full flex justify-center">
                            {activeTab === 'image' ? (
                                <img src={resultUrl} alt="Generated" className="max-h-[450px] w-auto rounded-2xl object-contain" />
                            ) : (
                                <video src={resultUrl} controls autoPlay loop className="max-h-[450px] w-full rounded-2xl" />
                            )}
                        </div>
                        <div className="mt-8 flex gap-4">
                            <a 
                                href={resultUrl} 
                                download={`wali-ai-${Date.now()}.${activeTab === 'image' ? 'png' : 'mp4'}`}
                                className="px-10 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                                <Download size={20} /> Unduh Hasil
                            </a>
                            <button 
                                onClick={() => { setResultUrl(null); setPrompt(''); }}
                                className="px-10 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                            >
                                Reset Proyek
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiStudio;