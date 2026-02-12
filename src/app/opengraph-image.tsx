import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const boltIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" /></svg>';

export default async function Image() {
  const iconSvg = boltIconSvg;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030712', 
        backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        color: '#e5e7eb',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          border: '1px solid #374151', 
          backgroundColor: 'rgba(3, 7, 18, 0.9)',
          padding: '50px 70px',
          borderRadius: '20px',
          boxShadow: '0 0 80px -20px rgba(16, 185, 129, 0.3)',
          position: 'relative',
          zIndex: 10,
          width: '90%',
          maxWidth: '1000px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '50px', borderBottom: '1px solid #1f2937', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#eab308' }}></div>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e' }}></div>
            </div>
            
            <div style={{ color: '#6b7280', fontSize: '20px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                    src={`data:image/svg+xml,${encodeURIComponent(iconSvg.replace('currentColor', '#10b981'))}`}
                    width="20"
                    height="20"
                />
                ~/sercan/portfolio
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', fontSize: '28px', color: '#6b7280', fontFamily: 'monospace' }}>
            <span>run introduction --visual</span>
        </div>

        <div style={{ 
            fontSize: '72px', 
            fontWeight: 800, 
            lineHeight: 1.1,
            marginBottom: '40px', 
            background: 'linear-gradient(to bottom right, #ffffff 30%, #9ca3af 100%)', 
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-2px'
        }}>
            Sercan Duran
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '28px', color: '#9ca3af' }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '10px'}}>{'>'}</span> 
                    Student
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '10px'}}>{'>'}</span> 
                    Developer
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                {['Next.js', 'TypeScript', 'Tailwind', 'AI'].map((tech) => (
                    <div key={tech} style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        fontSize: '20px',
                        fontWeight: 600
                    }}>
                        {tech}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}