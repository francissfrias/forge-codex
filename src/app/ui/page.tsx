/* ─── Design System Showcase ─────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='mb-12'>
      <h2 className='font-dota text-dota-gold-400 text-xl tracking-widest uppercase mb-4 pb-2 border-b border-dota-border'>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({
  bg,
  label,
  hex,
}: {
  bg: string;
  label: string;
  hex: string;
}) {
  return (
    <div className='flex flex-col gap-1 items-center'>
      <div
        className={`w-14 h-14 rounded-panel border border-dota-border ${bg}`}
      />
      <span className='text-2xs text-dota-text-secondary font-ui text-center leading-tight'>
        {label}
      </span>
      <span className='text-2xs text-dota-text-muted font-mono'>{hex}</span>
    </div>
  );
}

function AttrCard({
  label,
  colorClass,
  lightClass,
  darkClass,
  shadow,
}: {
  label: string;
  colorClass: string;
  lightClass: string;
  darkClass: string;
  shadow: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-panel overflow-hidden border border-dota-border shadow-dota-card ${shadow} w-36`}
    >
      <div className={`h-12 ${lightClass}`} />
      <div className={`h-12 ${colorClass}`} />
      <div className={`h-12 ${darkClass}`} />
      <div className='bg-dota-bg-card px-2 py-2 text-center'>
        <span className='font-dota text-dota-text-primary text-xs tracking-widest uppercase'>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function DesignShowcase() {
  return (
    <main className='min-h-screen bg-dota-bg text-dota-text-primary'>
      {/* ── Top navigation bar ── */}
      <nav className='bg-dota-header-gradient border-b border-dota-border shadow-dota-panel px-8 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-badge bg-dota-gold-gradient shadow-glow-gold' />
          <span className='font-dota text-dota-gold-400 text-lg tracking-widest uppercase'>
            Dota Item Builder
          </span>
        </div>
        <div className='flex gap-6'>
          {['Heroes', 'Items', 'Builds', 'Stats'].map((n) => (
            <span
              key={n}
              className='font-ui text-dota-text-secondary text-sm tracking-wider uppercase hover:text-dota-text-primary cursor-pointer transition-colors'
            >
              {n}
            </span>
          ))}
        </div>
        <button className='bg-dota-cta-gradient text-white font-dota text-sm px-5 py-2 rounded-panel shadow-glow-cta tracking-widest uppercase hover:shadow-glow-cta transition-shadow'>
          Play Dota
        </button>
      </nav>

      <div className='max-w-6xl mx-auto px-8 py-10'>
        {/* ── Page title ── */}
        <header className='mb-12 text-center'>
          <h1 className='font-dota text-6xl font-black tracking-widest uppercase text-dota-gold-400 drop-shadow-[0_0_24px_rgba(212,151,10,0.6)] mb-3'>
            Design System
          </h1>
          <p className='font-ui text-dota-text-secondary text-lg tracking-wide'>
            Dota Item Builder — Color & Typography Reference
          </p>
        </header>

        {/* ── Typography ── */}
        <Section title='Typography'>
          <div className='bg-dota-bg-panel rounded-panel shadow-dota-panel border border-dota-border p-8 space-y-6'>
            <div>
              <span className='text-2xs text-dota-text-muted font-mono uppercase tracking-widest block mb-2'>
                font-dota · Faculty Glyphic (headings)
              </span>
              <p className='font-dota text-5xl font-black text-dota-gold-400 tracking-wider'>
                The Battle of Ancients
              </p>
              <p className='font-dota text-3xl font-bold text-dota-text-primary tracking-wide mt-1'>
                Hero Selection Screen
              </p>
              <p className='font-dota text-xl text-dota-text-secondary mt-1'>
                Item Build Guide — Patch 7.38
              </p>
            </div>
            <div className='border-t border-dota-border pt-6'>
              <span className='text-2xs text-dota-text-muted font-mono uppercase tracking-widest block mb-2'>
                font-ui · Inter (UI labels)
              </span>
              <p className='font-ui text-2xl text-dota-text-primary'>
                Strength · Agility · Intelligence · Universal
              </p>
              <p className='font-ui text-base text-dota-text-secondary mt-1'>
                Neutral Item — Tier 3 drop after 25:00
              </p>
              <p className='font-ui text-sm text-dota-text-muted mt-1'>
                Passives stack. Does not require activation.
              </p>
            </div>
            <div className='border-t border-dota-border pt-6'>
              <span className='text-2xs text-dota-text-muted font-mono uppercase tracking-widest block mb-2'>
                font-mono · Geist Mono
              </span>
              <p className='font-mono text-dota-cta text-sm'>
                Damage: +120 · Attack Speed: +45 · Cost: 4750g
              </p>
              <p className='font-mono text-dota-text-muted text-2xs mt-1'>
                ID: item_black_king_bar · Cooldown: 65s
              </p>
            </div>
          </div>
        </Section>

        {/* ── Backgrounds ── */}
        <Section title='Background Tokens'>
          <div className='flex flex-wrap gap-4'>
            {[
              { bg: 'bg-dota-bg', label: 'bg', hex: '#0e0b14' },
              { bg: 'bg-dota-bg-panel', label: 'bg-panel', hex: '#160f22' },
              { bg: 'bg-dota-bg-card', label: 'bg-card', hex: '#1a1228' },
              { bg: 'bg-dota-bg-overlay', label: 'bg-overlay', hex: '#110d1c' },
              { bg: 'bg-dota-bg-hover', label: 'bg-hover', hex: '#241840' },
              { bg: 'bg-dota-bg-input', label: 'bg-input', hex: '#1c1430' },
            ].map((s) => (
              <Swatch key={s.label} {...s} />
            ))}
          </div>
        </Section>

        {/* ── Gold Scale ── */}
        <Section title='Gold Scale'>
          <div className='flex flex-wrap gap-3'>
            {[
              { bg: 'bg-dota-gold-50', hex: '#fffbe6', label: '50' },
              { bg: 'bg-dota-gold-100', hex: '#fff3b0', label: '100' },
              { bg: 'bg-dota-gold-200', hex: '#ffe066', label: '200' },
              { bg: 'bg-dota-gold-300', hex: '#ffd233', label: '300' },
              { bg: 'bg-dota-gold-400', hex: '#f5b800', label: '400' },
              { bg: 'bg-dota-gold-500', hex: '#d4970a', label: '500 ★' },
              { bg: 'bg-dota-gold-600', hex: '#b07a00', label: '600' },
              { bg: 'bg-dota-gold-700', hex: '#7a5200', label: '700' },
              { bg: 'bg-dota-gold-800', hex: '#4d3200', label: '800' },
              { bg: 'bg-dota-gold-900', hex: '#261800', label: '900' },
            ].map((s) => (
              <Swatch key={s.label} {...s} />
            ))}
          </div>
        </Section>

        {/* ── Attribute Colors ── */}
        <Section title='Attribute Colors'>
          <div className='flex flex-wrap gap-6'>
            <AttrCard
              label='Strength'
              colorClass='bg-dota-strength'
              lightClass='bg-dota-strength-light'
              darkClass='bg-dota-strength-dark'
              shadow='shadow-glow-str'
            />
            <AttrCard
              label='Agility'
              colorClass='bg-dota-agility'
              lightClass='bg-dota-agility-light'
              darkClass='bg-dota-agility-dark'
              shadow='shadow-glow-agi'
            />
            <AttrCard
              label='Intelligence'
              colorClass='bg-dota-intelligence'
              lightClass='bg-dota-intelligence-light'
              darkClass='bg-dota-intelligence-dark'
              shadow='shadow-glow-int'
            />
            <AttrCard
              label='Universal'
              colorClass='bg-dota-universal'
              lightClass='bg-dota-universal-light'
              darkClass='bg-dota-universal-dark'
              shadow='shadow-glow-uni'
            />
          </div>
        </Section>

        {/* ── Text Colors ── */}
        <Section title='Text Colors'>
          <div className='bg-dota-bg-panel rounded-panel border border-dota-border p-6 space-y-3'>
            {[
              {
                cls: 'text-dota-text-primary',
                label: 'text-primary',
                sample: 'Primary — warm off-white body text for content',
                hex: '#e8dcc8',
              },
              {
                cls: 'text-dota-text-secondary',
                label: 'text-secondary',
                sample: 'Secondary — muted parchment for labels',
                hex: '#a89070',
              },
              {
                cls: 'text-dota-text-muted',
                label: 'text-muted',
                sample: 'Muted — very subtle brown-grey for hints',
                hex: '#6a5540',
              },
              {
                cls: 'text-dota-text-gold',
                label: 'text-gold',
                sample: 'Gold — currency values and highlights',
                hex: '#d4970a',
              },
              {
                cls: 'text-dota-text-disabled',
                label: 'text-disabled',
                sample: 'Disabled — unavailable or locked text',
                hex: '#3d2e20',
              },
            ].map(({ cls, label, sample, hex }) => (
              <div key={label} className='flex items-baseline gap-4'>
                <span className='font-mono text-2xs text-dota-text-muted w-36 shrink-0'>
                  {label}
                </span>
                <span className={`font-ui text-base ${cls}`}>{sample}</span>
                <span className='font-mono text-2xs text-dota-text-muted ml-auto'>
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Borders ── */}
        <Section title='Borders'>
          <div className='flex gap-6'>
            {[
              { border: 'border-dota-border', label: 'border', hex: '#2e2045' },
              {
                border: 'border-dota-border-bright',
                label: 'border-bright',
                hex: '#4a3070',
              },
              {
                border: 'border-dota-border-gold',
                label: 'border-gold',
                hex: '#8a6a1a',
              },
            ].map(({ border, label, hex }) => (
              <div
                key={label}
                className={`flex-1 h-14 rounded-panel border-2 bg-dota-bg-card flex flex-col items-center justify-center gap-1 ${border}`}
              >
                <span className='font-mono text-2xs text-dota-text-secondary'>
                  {label}
                </span>
                <span className='font-mono text-2xs text-dota-text-muted'>
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Tier Badges ── */}
        <Section title='Neutral Item Tiers'>
          <div className='flex gap-4 flex-wrap'>
            {[
              {
                color: 'bg-dota-tier-1',
                label: 'Tier 1',
                hex: '#8c9e88',
                time: '0:00+',
              },
              {
                color: 'bg-dota-tier-2',
                label: 'Tier 2',
                hex: '#5ba3d9',
                time: '15:00+',
              },
              {
                color: 'bg-dota-tier-3',
                label: 'Tier 3',
                hex: '#c47eff',
                time: '25:00+',
              },
              {
                color: 'bg-dota-tier-4',
                label: 'Tier 4',
                hex: '#ff9a3c',
                time: '35:00+',
              },
              {
                color: 'bg-dota-tier-5',
                label: 'Tier 5',
                hex: '#ff4f4f',
                time: '60:00+',
              },
            ].map(({ color, label, hex, time }) => (
              <div
                key={label}
                className={`${color} text-dota-bg rounded-badge px-4 py-2 flex flex-col items-center min-w-24`}
              >
                <span className='font-dota text-sm font-bold tracking-wider'>
                  {label}
                </span>
                <span className='font-mono text-2xs opacity-70'>{time}</span>
                <span className='font-mono text-2xs opacity-50 mt-0.5'>
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shadows & Glows ── */}
        <Section title='Shadows & Glows'>
          <div className='flex flex-wrap gap-4'>
            {[
              {
                shadow: 'shadow-dota-panel',
                label: 'dota-panel',
                bg: 'bg-dota-bg-panel',
              },
              {
                shadow: 'shadow-dota-card',
                label: 'dota-card',
                bg: 'bg-dota-bg-card',
              },
              {
                shadow: 'shadow-dota-card-hover',
                label: 'card-hover ★',
                bg: 'bg-dota-bg-card',
              },
              {
                shadow: 'shadow-glow-gold',
                label: 'glow-gold',
                bg: 'bg-dota-gold-500',
              },
              {
                shadow: 'shadow-glow-str',
                label: 'glow-str',
                bg: 'bg-dota-strength',
              },
              {
                shadow: 'shadow-glow-agi',
                label: 'glow-agi',
                bg: 'bg-dota-agility',
              },
              {
                shadow: 'shadow-glow-int',
                label: 'glow-int',
                bg: 'bg-dota-intelligence',
              },
              {
                shadow: 'shadow-glow-uni',
                label: 'glow-uni',
                bg: 'bg-dota-universal',
              },
              {
                shadow: 'shadow-glow-cta',
                label: 'glow-cta',
                bg: 'bg-dota-cta',
              },
            ].map(({ shadow, label, bg }) => (
              <div
                key={label}
                className={`${bg} ${shadow} rounded-panel w-28 h-16 flex items-center justify-center`}
              >
                <span className='font-mono text-2xs text-white/80 text-center px-1 leading-tight'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Gradients ── */}
        <Section title='Gradients'>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {[
              { cls: 'bg-dota-panel-gradient', label: 'panel' },
              { cls: 'bg-dota-header-gradient', label: 'header' },
              { cls: 'bg-dota-gold-gradient', label: 'gold' },
              { cls: 'bg-dota-str-gradient', label: 'str' },
              { cls: 'bg-dota-agi-gradient', label: 'agi' },
              { cls: 'bg-dota-int-gradient', label: 'int' },
              { cls: 'bg-dota-uni-gradient', label: 'uni' },
              { cls: 'bg-dota-cta-gradient', label: 'cta' },
            ].map(({ cls, label }) => (
              <div
                key={label}
                className={`${cls} h-16 rounded-panel flex items-end px-3 py-2`}
              >
                <span className='font-mono text-2xs text-white/70'>
                  bg-dota-{label}-gradient
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Animations ── */}
        <Section title='Animations'>
          <div className='flex flex-wrap gap-8 items-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='animate-dota-pulse bg-dota-gold-500 shadow-glow-gold rounded-badge px-5 py-3'>
                <span className='font-dota text-dota-bg font-bold tracking-wider'>
                  76,885 ⬡
                </span>
              </div>
              <span className='font-mono text-2xs text-dota-text-muted'>
                animate-dota-pulse
              </span>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div
                className='animate-dota-shimmer rounded-panel h-10 w-48'
                style={{
                  background:
                    'linear-gradient(90deg, #d4970a 0%, #ffe066 40%, #d4970a 60%, #8a6a1a 100%)',
                  backgroundSize: '200% auto',
                }}
              />
              <span className='font-mono text-2xs text-dota-text-muted'>
                animate-dota-shimmer
              </span>
            </div>
          </div>
        </Section>

        {/* ── Sample Item Card ── */}
        <Section title='Sample Component — Item Card'>
          <div className='flex gap-4 flex-wrap'>
            {[
              {
                name: 'Black King Bar',
                cost: '4,750',
                color: 'bg-dota-gold-gradient',
                shadow: 'shadow-glow-gold',
                tag: 'Weapon',
              },
              {
                name: 'Butterfly',
                cost: '4,975',
                color: 'bg-dota-agi-gradient',
                shadow: 'shadow-glow-agi',
                tag: 'Agility',
              },
              {
                name: "Linken's Sphere",
                cost: '4,600',
                color: 'bg-dota-int-gradient',
                shadow: 'shadow-glow-int',
                tag: 'Magic',
              },
              {
                name: 'Crimson Guard',
                cost: '4,375',
                color: 'bg-dota-str-gradient',
                shadow: 'shadow-glow-str',
                tag: 'Armor',
              },
            ].map(({ name, cost, color, shadow, tag }) => (
              <div
                key={name}
                className={`bg-dota-bg-card border border-dota-border rounded-panel ${shadow} shadow-dota-card w-40 overflow-hidden hover:border-dota-border-gold hover:shadow-dota-card-hover transition-all cursor-pointer`}
              >
                <div className={`${color} h-24`} />
                <div className='p-3'>
                  <p className='font-dota text-dota-text-primary text-xs tracking-wide leading-tight'>
                    {name}
                  </p>
                  <div className='flex items-center justify-between mt-2'>
                    <span className='font-mono text-2xs text-dota-text-muted'>
                      {tag}
                    </span>
                    <span className='font-dota text-dota-gold text-xs'>
                      {cost}g
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CTA Row ── */}
        <Section title='CTA Button'>
          <div className='flex gap-4 items-center'>
            <button className='bg-dota-cta-gradient text-white font-dota text-base px-8 py-3 rounded-panel shadow-glow-cta tracking-widest uppercase hover:brightness-110 active:brightness-90 transition-all'>
              Play Dota
            </button>
            <button className='border border-dota-border-gold text-dota-gold font-dota text-base px-8 py-3 rounded-panel hover:bg-dota-bg-hover tracking-widest uppercase transition-colors'>
              View Builds
            </button>
            <button className='bg-dota-bg-panel border border-dota-border text-dota-text-secondary font-ui text-sm px-6 py-3 rounded-panel hover:border-dota-border-bright hover:text-dota-text-primary tracking-wide transition-colors'>
              Filter Items
            </button>
          </div>
        </Section>
      </div>
    </main>
  );
}
