export function BackgroundFX({ breached = false }) {
  const accent = breached ? 'rgba(255,59,92,0.5)' : 'rgba(168,85,247,0.5)';
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="cyber-grid" style={{ opacity: breached ? 0.5 : 0.7 }} />
      <div
        className="radar"
        style={{
          width: '90vmin',
          height: '90vmin',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          opacity: 0.5,
        }}
      />
      {/* concentric rings */}
      {[40, 60, 80].map((s) => (
        <div
          key={s}
          className="absolute rounded-full border"
          style={{
            width: `${s}vmin`,
            height: `${s}vmin`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            borderColor: accent,
            opacity: 0.12,
          }}
        />
      ))}
      {/* floating particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full float-slow"
          style={{
            width: 4,
            height: 4,
            left: `${(i * 41) % 100}%`,
            top: `${(i * 67) % 100}%`,
            background: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#a855f7' : '#e024a5',
            boxShadow: '0 0 8px currentColor',
            animationDelay: `${(i % 8) * 0.4}s`,
            opacity: 0.6,
          }}
        />
      ))}
      <div className="vignette" />
    </div>
  );
}
