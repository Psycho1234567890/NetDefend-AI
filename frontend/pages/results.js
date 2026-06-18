import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attacks');
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsClient(true);
    
    // Generate particles ONLY on the client (after hydration)
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          top: Math.random() * 100,
          left: Math.random() * 100,
          width: 1 + Math.random() * 4,
          height: 1 + Math.random() * 4,
          duration: 20 + Math.random() * 50,
          delay: Math.random() * 35,
          opacity: 0.04 + Math.random() * 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    const stored = sessionStorage.getItem('netdefend_results');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.push('/');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05080f]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float-logo">🛡️</div>
          <div className="text-[#00d4ff] text-xl tracking-[0.2em] uppercase font-light">
            Loading Analysis...
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, attacks, normal, download_urls } = data;
  
  const pieData = [
    { name: 'Normal', value: stats.normal },
    { name: 'Attacks', value: stats.attacks }
  ];
  const COLORS = ['#69f0ae', '#ff5252'];

  const attackTypeData = Object.entries(stats.attack_types || {}).map(([name, value]) => ({
    name,
    value
  })).slice(0, 8);

  const allRows = activeTab === 'attacks' ? attacks : normal;

const downloadFile = (url) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://netdefend-ai-backend.onrender.com';
  window.open(`${API_URL}${url}`, '_blank');
};

  return (
    <>
      <Head>
        <title>📊 NetDefend AI - Analysis Results</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden bg-[#05080f] p-6 md:p-8">

        {/* ========== BACKGROUND LAYERS ========== */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#05080f] via-[#0a1628] to-[#0f0a1a]"></div>
        
        <div className="absolute inset-0 pointer-events-none z-10"
             style={{
               background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)'
             }} />

        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] mix-blend-overlay"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat',
               backgroundSize: '512px 512px',
             }} />

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#00d4ff]/8 rounded-full blur-3xl animate-orb-1"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#7b2ffc]/8 rounded-full blur-3xl animate-orb-2"></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-[#4facfe]/5 rounded-full blur-3xl animate-orb-3"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none z-5 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />

        {/* PARTICLES - RENDERED ONLY ON CLIENT (NO HYDRATION ISSUES) */}
        {isClient && (
          <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-white/15 animate-particle"
                style={{
                  top: `${p.top}%`,
                  left: `${p.left}%`,
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  opacity: p.opacity,
                  filter: 'blur(0.5px)',
                }}
              />
            ))}
          </div>
        )}

        {/* ========== MAIN CONTENT ========== */}
        <div className="relative z-20 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="cinematic-card p-3 rounded-xl hover:bg-white/5 transition-all duration-500"
              >
                <span className="text-xl opacity-60 hover:opacity-100 transition-opacity">←</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#7b2ffc]">
                    Analysis Results
                  </span>
                </h1>
                <p className="text-gray-500/60 text-xs tracking-[0.2em] uppercase font-light mt-1">
                  Threat Intelligence Report
                </p>
              </div>
            </div>
            <div className="cinematic-card px-5 py-2.5 rounded-full border border-green-500/20">
              <span className="text-green-400 text-xs flex items-center gap-2 tracking-wider">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                SYSTEM ACTIVE
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="cinematic-card rounded-2xl p-6 text-center border border-white/5">
              <div className="text-gray-500/60 text-xs tracking-wider uppercase">Total Packets</div>
              <div className="text-3xl font-bold text-white mt-2 tracking-tight">{stats.total.toLocaleString()}</div>
            </div>
            <div className="cinematic-card rounded-2xl p-6 text-center border-red-500/10 hover:border-red-500/30 transition-all duration-500">
              <div className="text-gray-500/60 text-xs tracking-wider uppercase">🚨 Attacks Detected</div>
              <div className="text-3xl font-bold text-[#ff5252] mt-2 tracking-tight">{stats.attacks.toLocaleString()}</div>
            </div>
            <div className="cinematic-card rounded-2xl p-6 text-center border-green-500/10 hover:border-green-500/30 transition-all duration-500">
              <div className="text-gray-500/60 text-xs tracking-wider uppercase">✅ Normal Traffic</div>
              <div className="text-3xl font-bold text-[#69f0ae] mt-2 tracking-tight">{stats.normal.toLocaleString()}</div>
            </div>
            <div className="cinematic-card rounded-2xl p-6 text-center border-[#00d4ff]/10 hover:border-[#00d4ff]/30 transition-all duration-500">
              <div className="text-gray-500/60 text-xs tracking-wider uppercase">Attack Percentage</div>
              <div className="text-3xl font-bold text-[#00d4ff] mt-2 tracking-tight">{stats.attack_percentage}%</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="cinematic-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-gray-300 font-light tracking-wider text-sm mb-4">Traffic Distribution</h3>
              <div className="h-[300px] w-full">
                {isClient && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'rgba(10, 16, 30, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                        labelStyle={{ color: '#e0e0e0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="cinematic-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-gray-300 font-light tracking-wider text-sm mb-4">Top Attack Types</h3>
              <div className="h-[300px] w-full">
                {isClient && attackTypeData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attackTypeData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#8892b0', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(10, 16, 30, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" fill="#ff5252" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {isClient && attackTypeData.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-500/60 text-sm tracking-wider">
                    No attack type labels found in data
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => downloadFile(download_urls.attacks)}
              className="cinematic-card px-6 py-3 rounded-xl text-red-400 font-light tracking-wider transition-all duration-500 flex items-center gap-2 hover:bg-red-500/5 hover:border-red-500/20"
            >
              ⬇️ Download Block List ({stats.attacks} attacks)
            </button>
            <button
              onClick={() => downloadFile(download_urls.normal)}
              className="cinematic-card px-6 py-3 rounded-xl text-green-400 font-light tracking-wider transition-all duration-500 flex items-center gap-2 hover:bg-green-500/5 hover:border-green-500/20"
            >
              ⬇️ Download Safe List ({stats.normal} normal)
            </button>
          </div>

          {/* Data Table */}
          <div className="cinematic-card rounded-2xl overflow-hidden border border-white/5 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setActiveTab('attacks')}
                className={`flex-1 py-4 px-4 text-xs font-light tracking-wider uppercase transition-all duration-500 ${
                  activeTab === 'attacks'
                    ? 'text-[#ff5252] border-b-2 border-[#ff5252] bg-red-500/5'
                    : 'text-gray-500/60 hover:text-gray-300'
                }`}
              >
                🚨 Attacks ({attacks.length})
              </button>
              <button
                onClick={() => setActiveTab('normal')}
                className={`flex-1 py-4 px-4 text-xs font-light tracking-wider uppercase transition-all duration-500 ${
                  activeTab === 'normal'
                    ? 'text-[#69f0ae] border-b-2 border-[#69f0ae] bg-green-500/5'
                    : 'text-gray-500/60 hover:text-gray-300'
                }`}
              >
                ✅ Normal ({normal.length})
              </button>
            </div>

            <div className="max-h-[400px] overflow-auto scrollbar-thin">
              {allRows.length === 0 ? (
                <div className="text-center py-12 text-gray-500/60 text-sm tracking-wider">
                  No {activeTab} records found in this file.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 sticky top-0 backdrop-blur-sm">
                    <tr className="text-gray-500/60 text-xs font-light tracking-wider uppercase">
                      <th className="px-4 py-3 font-light">#</th>
                      <th className="px-4 py-3 font-light">Protocol</th>
                      <th className="px-4 py-3 font-light">Service</th>
                      <th className="px-4 py-3 font-light">Src Bytes</th>
                      <th className="px-4 py-3 font-light">Dst Bytes</th>
                      <th className="px-4 py-3 font-light">Confidence</th>
                      {activeTab === 'attacks' && <th className="px-4 py-3 font-light">Attack Type</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {allRows.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-t border-white/5 transition-all duration-300 ${
                          activeTab === 'attacks' ? 'hover:bg-red-500/5' : 'hover:bg-green-500/5'
                        }`}
                      >
                        <td className="px-4 py-2 text-gray-500/60 text-xs">{idx + 1}</td>
                        <td className="px-4 py-2 text-gray-300 text-xs">{row.protocol_type || '-'}</td>
                        <td className="px-4 py-2 text-gray-300 text-xs">{row.service || '-'}</td>
                        <td className="px-4 py-2 text-gray-300 text-xs">{row.src_bytes || 0}</td>
                        <td className="px-4 py-2 text-gray-300 text-xs">{row.dst_bytes || 0}</td>
                        <td className={`px-4 py-2 text-xs font-medium ${row.attack_confidence > 0.5 ? 'text-[#ff5252]' : 'text-[#69f0ae]'}`}>
                          {(row.attack_confidence * 100).toFixed(1)}%
                        </td>
                        {activeTab === 'attacks' && (
                          <td className="px-4 py-2 text-[#ff5252] text-xs font-medium">{row.label || 'Unknown'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500/40 text-[10px] tracking-[0.3em] uppercase font-light animate-fade-in" style={{ animationDelay: '1s' }}>
            NetDefend AI • Analysis Complete • {stats.total.toLocaleString()} records processed
          </div>
        </div>
      </div>

      <style jsx>{`
        .cinematic-card {
          background: rgba(10, 16, 30, 0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cinematic-card:hover {
          border-color: rgba(255, 255, 255, 0.06);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7);
        }

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
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.2); }
        }
        .animate-orb-1 { animation: orb-1 25s ease-in-out infinite; }
        .animate-orb-2 { animation: orb-2 30s ease-in-out infinite; }
        .animate-orb-3 { animation: orb-3 20s ease-in-out infinite; }

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

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        @keyframes float-logo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-logo {
          animation: float-logo 3s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.2);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.4);
        }

        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </>
  );
}