export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', padding: 24, display: 'grid', placeItems: 'center' }}>
      <div style={{ maxWidth: 720, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              fontWeight: 800,
              letterSpacing: 1.2,
              padding: '6px 10px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            VOLCANO
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Virtuoso AI Art Assistant</div>
            <div style={{ opacity: 0.75, marginTop: 4 }}>
              Model-aware prompt studio for ChatGPT Image Gen 1.5 and Nano Banana Pro
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 18,
            padding: 18,
            lineHeight: 1.5,
          }}
        >
          <p style={{ marginTop: 0 }}>
            Build stronger image prompts with learning modes, glossary intelligence, style DNA blending,
            color-to-words palettes, and guided prompt linting.
          </p>

          <ul style={{ margin: '14px 0 0 18px', opacity: 0.9 }}>
            <li>Beginner / Intermediate / Pro learning modes</li>
            <li>Glossary with smart vocabulary expansion</li>
            <li>Style DNA blending + bridge terms</li>
            <li>Color picker → prompt-friendly color words + palette schemes</li>
            <li>Explain-this-prompt mode</li>
            <li>Image reference helpers (aspect/orientation + suggestions)</li>
          </ul>

          <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
            <a
              href="/studio"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 14px',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 700,
                border: '1px solid rgba(34,197,94,0.55)',
              }}
            >
              Open Studio →
            </a>

            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 14px',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.18)',
                opacity: 0.9,
              }}
            >
              Supabase (optional)
            </a>
          </div>

          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.7 }}>
            Tip: On iPhone, open /studio in Safari → Share → Add to Home Screen to install as an app.
          </div>
        </div>
      </div>
    </main>
  );
}