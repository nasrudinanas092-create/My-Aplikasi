import { GoogleGenAI } from "@google/genai";

// Note: Veo generation requires specific key handling as per guidelines
// We will handle the initialization inside the component or via a helper that gets the key.

export const generateImageWithGemini = async (prompt: string, apiKey: string): Promise<{ data: string | null; error?: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Using gemini-2.5-flash-image for standard image generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
         // Default config for image gen
      }
    });

    // Check for inline data (image bytes)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return { data: `data:image/png;base64,${part.inlineData.data}` };
      }
    }
    
    // If no image, maybe text was returned (e.g., policy refusal)
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart && textPart.text) {
        return { data: null, error: textPart.text };
    }

    return { data: null, error: "Gagal menghasilkan gambar." };
  } catch (error: any) {
    console.error("Gemini Image Gen Error:", error);
    return { data: null, error: error.message || "Terjadi kesalahan sistem." };
  }
};

export const generateVideoWithVeo = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling mechanism
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("No video URI returned.");

    // Fetch the actual bytes
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Veo Video Gen Error:", error);
    throw error;
  }
};

export const generateTeachingIdeas = async (topic: string, apiKey: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan 3 ide aktivitas pembelajaran kreatif dan menyenangkan untuk siswa SMA tentang topik: "${topic}". Format output sebagai list markdown yang rapi.`,
    });
    return response.text || "Tidak dapat menghasilkan ide saat ini.";
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    return "Maaf, terjadi kesalahan koneksi AI.";
  }
};

export interface DocParams {
  type: string;
  teacherName: string;
  teacherNip: string;
  schoolName: string;
  headmaster: string;
  headmasterNip: string;
  subject: string;
  grade: string;
  topic: string;
  semester: string;
  year: string;
  date: string;
  jenjang?: string; // SD/SMP/SMA
}

export const generateTeachingDocument = async (params: DocParams, apiKey: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Bertindaklah sebagai ahli kurikulum pendidikan Indonesia. Buatkan dokumen administrasi guru yang LENGKAP dan PROFESIONAL dengan format HTML (tanpa tag html/body, hanya konten).
      
      Jenis Dokumen: ${params.type}
      Jenjang: ${params.jenjang || 'SMA/MA'}
      Kelas: ${params.grade}
      Mata Pelajaran: ${params.subject}
      Materi/Topik: ${params.topic}
      Semester: ${params.semester}
      Tahun Ajaran: ${params.year}
      Sekolah: ${params.schoolName}

      Instruksi Khusus:
      1. Gunakan struktur HTML <table> untuk header (kop) agar rapi.
      2. Gunakan CSS inline sederhana untuk border tabel (border-collapse, border: 1px solid black) pada bagian isi utama dokumen.
      3. Sesuaikan isi dengan regulasi terbaru (Kurikulum Merdeka atau K13 sesuai konteks dokumen) untuk jenjang ${params.jenjang}.
      4. Jika "Modul Ajar Deep Learning", tekankan pada pemikiran kritis, kolaborasi, dan refleksi mendalam.
      5. Isi harus substantif, jangan hanya placeholder. Buatkan tujuan pembelajaran, langkah-langkah, dan asesmen yang relevan.
      
      PENTING: FORMAT TANDA TANGAN (SIGNATURE BLOCK)
      Pada bagian paling bawah dokumen, WAJIB buatkan tabel HTML tanpa border dengan lebar 100% untuk tanda tangan sebagai berikut:
      - Kolom Kiri: "Mengetahui,<br/>Kepala Sekolah", spasi untuk tanda tangan, lalu Nama Kepala Sekolah (Tebal) dan NIP.
      - Kolom Kanan: "[Titi Mangsa], [Tanggal]<br/>Guru Mata Pelajaran", spasi untuk tanda tangan, lalu Nama Guru (Tebal) dan NIP.
      
      Data Tanda Tangan:
      - Titi Mangsa: ${params.date}
      - Kepala Sekolah: ${params.headmaster} (NIP: ${params.headmasterNip})
      - Guru: ${params.teacherName} (NIP: ${params.teacherNip})

      Output HANYA HTML kontennya saja.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro model for better text generation capabilities
      contents: prompt,
    });
    
    return response.text || "<p>Gagal menghasilkan dokumen.</p>";
  } catch (error: any) {
    console.error("Gemini Doc Gen Error:", error);
    throw new Error(error.message || "Gagal menghubungi layanan AI.");
  }
};