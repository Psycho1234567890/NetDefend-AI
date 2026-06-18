export default function Watermark() {
  return (
    <>
      {/* Background Diagonal Watermark */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none select-none opacity-[0.04] rotate-[-25deg]"
        style={{ transform: 'translate(-50%, -50%) rotate(-25deg)' }}
      >
        
      </div>

      {/* Glassmorphism Bottom Right Badge */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
        <div className="bg-[rgba(20,27,43,0.5)] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-2xl shadow-[#00d4ff]/10 flex items-center gap-3">
          <span className="text-[#00d4ff] text-xl">🛡️</span>
          <div>
            <span className="text-white font-semibold text-sm">Made by </span>
            <span className="text-[#00d4ff] font-bold text-sm">Psychomods</span>
          </div>
        </div>
      </div>
    </>
  );
}