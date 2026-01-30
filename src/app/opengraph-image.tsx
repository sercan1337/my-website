import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030712', // bg-gray-950
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          color: '#e5e7eb', // text-gray-200
        }}
      >
        {/* Arka Plan Glow Efekti */}
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)', // rgba(green-500, 0.1)
                filter: 'blur(50px)',
            }}
        />

        {/* Ana İçerik Kutusu */}
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: '1px solid #1f2937', // border-gray-800
                backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900/80
                padding: '60px 80px',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                maxWidth: '80%',
            }}
        >
            {/* Terminal Üst Barı (Süs) */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '12px', width: '100%' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                <div style={{ color: '#6b7280', fontSize: '20px', marginLeft: 'auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>~/sercan</div>
            </div>

            {/* Büyük Başlık */}
            <div style={{ fontSize: '80px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '20px' }}>{'>'}</span> ~/sercan
            </div>

            {/* Alt Başlık / Slogan (Değiştirilen Kısım) */}
            <div style={{ color: '#9ca3af', fontSize: '32px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex' }}>
                    <span style={{ color: '#6b7280' }}>$ role:</span> System Architect & Digital Crafter
                </div>
                <div style={{ display: 'flex' }}>
                    <span style={{ color: '#6b7280' }}>$ focus:</span> Building scalable systems & refined interfaces.
                </div>
            </div>

            {/* Alt Bilgi / Komut Çıktısı */}
             <div style={{ color: '#10b981', fontSize: '24px', marginTop: '40px', padding: '10px 20px', border: '1px solid #10b981', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                System ready. Exploring..._
            </div>
        </div>
      </div>,
    {
      ...size,
    }
  );
}