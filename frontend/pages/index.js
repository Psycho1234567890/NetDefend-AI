import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv', '.txt'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError('');
    }
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://netdefend-ai-backend.onrender.com';
const response = await axios.post(`${API_URL}/api/filter`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        sessionStorage.setItem('netdefend_results', JSON.stringify(response.data));
        router.push('/results');
      } else {
        setError('Processing failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>🛡️ NetDefend AI - Network Intrusion Detection</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden bg-[#05080f] flex items-center justify-center p-6 md:p-8">

        {/* ========== AMBIENT BACKGROUND LAYERS ========== */}
        
        {/* 1. Deep Space Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#05080f] via-[#0a1628] to-[#0f0a1a]"></div>

        {/* 2. Letterbox Bars (Widescreen) */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-0 left-0 right-0 h-[8vh] bg-gradient-to-b from-black/95 via-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
        </div>

        {/* 3. Soft Vignette */}
        <div className="absolute inset-0 pointer-events-none z-20"
             style={{
               background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)'
             }} />

        {/* 4. Film Grain (Static animated noise) */}
        <div className="absolute inset-0 pointer-events-none z-15 opacity-[0.035] mix-blend-overlay animate-grain"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat',
               backgroundSize: '512px 512px',
             }} />

        {/* 5. Auto-Floating Glow Orbs (Independent, no mouse tracking) */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] bg-[#00d4ff]/10 rounded-full blur-3xl animate-orb-1" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-[#7b2ffc]/10 rounded-full blur-3xl animate-orb-2" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00d4ff]/5 rounded-full blur-3xl animate-orb-3" />
          <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#4facfe]/6 rounded-full blur-3xl animate-orb-4" />
          <div className="absolute bottom-[25%] left-[15%] w-[250px] h-[250px] bg-[#7b2ffc]/6 rounded-full blur-3xl animate-orb-5" />
        </div>

        {/* 6. Subtle Grid (Static, no mouse interaction) */}
        <div className="absolute inset-0 pointer-events-none z-5 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* 7. HUD Corner Brackets (Static) */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#00d4ff]/15 animate-pulse-slow z-10"></div>
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#00d4ff]/15 animate-pulse-slow delay-500 z-10"></div>
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#00d4ff]/15 animate-pulse-slow delay-1000 z-10"></div>
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#00d4ff]/15 animate-pulse-slow delay-1500 z-10"></div>

        {/* 8. Auto-Floating Particles (Drifting independently) */}
        <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/15 animate-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 4}px`,
                height: `${1 + Math.random() * 4}px`,
                animationDuration: `${25 + Math.random() * 45}s`,
                animationDelay: `${Math.random() * 35}s`,
                opacity: 0.04 + Math.random() * 0.2,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* 9. Lens Flare (Static) */}
        <div className="absolute top-[5%] right-[5%] w-[200px] h-[200px] pointer-events-none z-10 opacity-[0.05]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] via-transparent to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
        </div>

        {/* 10. Cosmic Dust Trail (Slow horizontal drift) */}
        <div className="absolute inset-0 pointer-events-none z-5 opacity-[0.015]">
          <div className="absolute top-[30%] left-[-10%] w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent animate-drift" />
          <div className="absolute top-[60%] left-[-10%] w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#7b2ffc] to-transparent animate-drift delay-1000" />
          <div className="absolute top-[80%] left-[-10%] w-[180%] h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent animate-drift delay-2000" />
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div className="relative z-40 w-full max-w-6xl">

          {/* Cinematic Title Sequence */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-6xl animate-float-logo">🛡️</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#4facfe] to-[#7b2ffc]">
                NetDefend AI
              </span>
            </h1>
            <p className="text-gray-400/80 text-sm md:text-base mt-3 tracking-[0.3em] uppercase font-light">
              — Network Intrusion Detection System —
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#00d4ff]/30"></div>
              <div className="h-[1px] w-12 bg-gradient-to-r from-[#00d4ff]/30 to-[#7b2ffc]/30"></div>
              <div className="h-[1px] w-12 bg-gradient-to-r from-[#7b2ffc]/30 to-transparent"></div>
            </div>
          </div>

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Upload Area */}
            <div className="md:col-span-2">
              <div className="cinematic-card rounded-2xl p-8 border border-white/5">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-500 ${
                    isDragActive 
                      ? 'border-[#00d4ff] bg-[#00d4ff]/10 shadow-[0_0_40px_rgba(0,212,255,0.1)]' 
                      : 'border-white/5 hover:border-[#00d4ff]/30 hover:bg-white/5 hover:shadow-[0_0_60px_rgba(0,212,255,0.05)]'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className={`text-7xl transition-transform duration-500 ${isDragActive ? 'scale-110' : ''}`}>
                      {isDragActive ? '📥' : '📂'}
                    </div>
                    <div>
                      {isDragActive ? (
                        <p className="text-[#00d4ff] text-lg font-semibold tracking-wider">DROP YOUR CSV HERE</p>
                      ) : (
                        <>
                          <p className="text-gray-300 text-lg font-light tracking-wide">
                            Drag &amp; drop your CSV file
                          </p>
                          <p className="text-gray-500/60 text-sm mt-2 tracking-wider">
                            or click to browse — Supports .csv, .txt
                          </p>
                        </>
                      )}
                    </div>
                    {file && (
                      <div className="mt-4 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                        <span className="text-lg">📄</span>
                        <span className="text-[#00d4ff] font-medium">{file.name}</span>
                        <span className="text-gray-500/60 text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center backdrop-blur-sm animate-shake">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`w-full mt-6 py-4 rounded-xl text-lg font-bold tracking-wider transition-all duration-500 ${
                    !file || loading
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'cinematic-btn text-white hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(0,212,255,0.2)]'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ANALYZING...
                    </span>
                  ) : (
                    '🚀 ANALYZE NETWORK TRAFFIC'
                  )}
                </button>
              </div>
            </div>

            {/* Side Stats */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <div className="cinematic-card rounded-2xl p-6 flex flex-col items-center text-center border border-white/5 group hover:border-[#00d4ff]/20 transition-all duration-500">
                <div className="text-4xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">🤖</div>
                <div className="text-sm font-light tracking-wider text-white/80">Random Forest</div>
                <div className="text-xs text-gray-500/60 mt-1 tracking-wider">100 DECISION TREES</div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent mt-3"></div>
              </div>
              <div className="cinematic-card rounded-2xl p-6 flex flex-col items-center text-center border border-white/5 group hover:border-[#7b2ffc]/20 transition-all duration-500">
                <div className="text-4xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">📊</div>
                <div className="text-sm font-light tracking-wider text-white/80">NSL-KDD</div>
                <div className="text-xs text-gray-500/60 mt-1 tracking-wider">125,973 RECORDS</div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#7b2ffc]/20 to-transparent mt-3"></div>
              </div>
              <div className="cinematic-card rounded-2xl p-6 flex flex-col items-center text-center border border-white/5 group hover:border-[#00d4ff]/20 transition-all duration-500 md:col-span-2">
                <div className="text-4xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">⚡</div>
                <div className="text-sm font-light tracking-wider text-white/80">Real-time Detection</div>
                <div className="text-xs text-gray-500/60 mt-1 tracking-wider">0.5ms INFERENCE</div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent mt-3"></div>
              </div>
            </div>
          </div>

          {/* Cinematic Footer */}
          <div className="text-center mt-12">
            <div className="flex justify-center items-center gap-6 text-gray-500/40 text-xs tracking-[0.2em] uppercase font-light">
              <span>Powered by Random Forest</span>
              <span className="w-px h-4 bg-gray-500/20"></span>
              <span>NSL-KDD Dataset</span>
              <span className="w-px h-4 bg-gray-500/20"></span>
              <span>Real-time Detection</span>
            </div>
            <div className="mt-4 text-gray-500/20 text-[10px] tracking-[0.3em] uppercase">
              <span className="animate-pulse-slow">●</span> SYSTEM ACTIVE <span className="animate-pulse-slow delay-500">●</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===== CINEMATIC CARD ===== */
        .cinematic-card {
          background: rgba(10, 16, 30, 0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.02);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cinematic-card:hover {
          border-color: rgba(255, 255, 255, 0.06);
          box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        /* ===== CINEMATIC BUTTON ===== */
        .cinematic-btn {
          background: linear-gradient(135deg, 
            rgba(0, 212, 255, 0.12), 
            rgba(123, 47, 252, 0.12)
          );
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          letter-spacing: 0.05em;
        }
        .cinematic-btn:hover {
          background: linear-gradient(135deg, 
            rgba(0, 212, 255, 0.2), 
            rgba(123, 47, 252, 0.2)
          );
          border-color: rgba(0, 212, 255, 0.2);
          box-shadow: 0 8px 40px rgba(0, 212, 255, 0.1);
        }

        /* ===== FILM GRAIN ===== */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -1%); }
          20% { transform: translate(2%, -2%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(2%, 2%); }
          70% { transform: translate(-1%, -2%); }
          80% { transform: translate(1%, 1%); }
          90% { transform: translate(-2%, 2%); }
        }
        .animate-grain {
          animation: grain 0.5s steps(2) infinite;
        }

        /* ===== AUTO-FLOATING GLOW ORBS ===== */
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, -60px) scale(1.1); }
          50% { transform: translate(-40px, 40px) scale(0.9); }
          75% { transform: translate(60px, -30px) scale(1.05); }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-70px, 50px) scale(1.15); }
          50% { transform: translate(50px, -50px) scale(0.85); }
          75% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes orb-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.4); }
        }
        @keyframes orb-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, -70px) scale(1.2); }
          66% { transform: translate(30px, 50px) scale(0.8); }
        }
        @keyframes orb-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, 40px) scale(1.1); }
          66% { transform: translate(-40px, -30px) scale(0.9); }
        }
        .animate-orb-1 { animation: orb-1 25s ease-in-out infinite; }
        .animate-orb-2 { animation: orb-2 30s ease-in-out infinite; }
        .animate-orb-3 { animation: orb-3 20s ease-in-out infinite; }
        .animate-orb-4 { animation: orb-4 22s ease-in-out infinite; }
        .animate-orb-5 { animation: orb-5 28s ease-in-out infinite; }

        /* ===== COSMIC DRIFT ===== */
        @keyframes drift {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(50%); opacity: 0; }
        }
        .animate-drift {
          animation: drift 15s linear infinite;
        }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }

        /* ===== PARTICLES ===== */
        @keyframes particle {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          10% { opacity: 0.3; }
          25% { transform: translate(120px, -80px) scale(1.5); opacity: 0.5; }
          50% { transform: translate(-50px, 90px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(80px, -50px) scale(1.2); opacity: 0.4; }
          90% { opacity: 0.2; }
          100% { transform: translate(0, 0) scale(0.5); opacity: 0; }
        }
        .animate-particle {
          animation: particle linear infinite;
          will-change: transform, opacity;
        }

        /* ===== PULSE SLOW ===== */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }

        /* ===== FLOAT LOGO ===== */
        @keyframes float-logo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-logo {
          animation: float-logo 3s ease-in-out infinite;
        }

        /* ===== FADE IN ===== */
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
        }

        /* ===== SHAKE ===== */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}