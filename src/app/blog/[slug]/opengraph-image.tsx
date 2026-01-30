import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Resim boyutları (Standart OG boyutları)
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // Yazının slug'ını al ve başlık formatına çevir
  const slug = (await params).slug;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Tarih simülasyonu (Gerçek projede veritabanından alınır)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const iconSvg = await readFile(
    join(process.cwd(), 'src', 'app', 'icon.svg'),
    'utf-8'
  );

  return new ImageResponse(
    (
      // --- TASARIM BAŞLANGICI ---
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#030712', // bg-gray-950
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          color: '#e5e7eb',
        }}
      >
        {/* Arka Plan Glow Efekti */}
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(50px)',
                zIndex: '0',
            }}
        />

        {/* Ana İçerik Kutusu */}
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: '1px solid #1f2937',
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: '50px 60px',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                zIndex: '10',
                width: '100%',
                height: '100%',
                justifyContent: 'space-between',
            }}
        >
            {/* Üst Kısım: Dosya Yolu ve Başlık */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Dosya Yolu Ekmek Kırıntısı */}
                <div style={{ color: '#6b7280', fontSize: '24px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        src={`data:image/svg+xml,${encodeURIComponent(iconSvg.replace('currentColor', '#10b981'))}`}
                        width="24"
                        height="24"
                        style={{ display: 'flex' }}
                    />
                    <span style={{ color: '#10b981', marginRight: '10px' }}>~/sercan/blog/</span>
                    <span style={{ color: '#9ca3af' }}>{slug.slice(0, 20)}{slug.length > 20 ? '...' : ''}.md</span>
                </div>

                {/* Başlık */}
                <div
                style={{
                    fontSize: '64px',
                    fontWeight: 'bold',
                    color: 'white',
                    lineHeight: 1.1,
                    marginBottom: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
                >
                <span style={{ color: '#10b981', marginRight: '20px' }}>#</span> {title}
                </div>
            </div>

            {/* Alt Kısım: Meta Bilgileri (Terminal Çıktısı Gibi) */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: 'auto',
                    fontSize: '24px',
                    color: '#9ca3af',
                    borderTop: '1px solid #374151',
                    paddingTop: '30px',
                    width: '100%',
                }}
            >
                <div>
                    <span style={{ color: '#10b981' }}>$ author:</span> sercan
                </div>
                <div>
                    <span style={{ color: '#10b981' }}>$ date:</span> {date}
                </div>
                <div>
                    <span style={{ color: '#10b981' }}>$ status:</span> published / public
                </div>
            </div>
        </div>
      </div>
      // --- TASARIM BİTİŞİ ---
    ),
    {
      ...size,
    }
  );
}