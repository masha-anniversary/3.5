import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Scroll reveal component ────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, stagger = false }: {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`${stagger ? 'reveal-stagger' : 'reveal'} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────
const photos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&h=800&fit=crop&auto=format',
    caption: 'Our first trip together — that tiny cafe in the rain.',
    date: 'March 2023',
    hearts: 14,
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=600&fit=crop&auto=format',
    caption: 'Golden hour on the rooftop. You looked like a painting.',
    date: 'July 2023',
    hearts: 21,
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=700&h=750&fit=crop&auto=format',
    caption: 'Late night drives and your playlist on repeat.',
    date: 'October 2023',
    hearts: 9,
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=700&h=650&fit=crop&auto=format',
    caption: 'Morning light, messy hair, happiest I have ever been.',
    date: 'January 2024',
    hearts: 17,
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=700&h=800&fit=crop&auto=format',
    caption: 'The beach day that turned into a whole adventure.',
    date: 'June 2024',
    hearts: 25,
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&h=600&fit=crop&auto=format',
    caption: 'Picnic in the park. Your laugh echoed everywhere.',
    date: 'August 2024',
    hearts: 12,
  },
]

const places = [
  { id: 1, lat: 48.8566, lng: 2.3522, name: 'Paris', note: 'Where we got completely lost and it was perfect.', emoji: '🗼' },
  { id: 2, lat: 51.5074, lng: -0.1278, name: 'London', note: 'That tiny pub in Soho where you taught me darts.', emoji: '🎯' },
  { id: 3, lat: 41.9028, lng: 12.4964, name: 'Rome', note: 'Gelato at midnight. Three scoops each.', emoji: '🍦' },
  { id: 4, lat: 52.3676, lng: 4.9041, name: 'Amsterdam', note: 'Bikes, canals, and terrible navigation.', emoji: '🚲' },
  { id: 5, lat: 40.4168, lng: -3.7038, name: 'Madrid', note: 'We stayed out until 4am and had no regrets.', emoji: '🌙' },
  { id: 6, lat: 50.0755, lng: 14.4378, name: 'Prague', note: 'The castle at sunrise. Just us and the city below.', emoji: '🏰' },
]

const letterLines = [
  "I didn't expect you.",
  "That's the truest thing I can say. I wasn't looking, wasn't ready, wasn't sure about any of it — and then there you were, talking about something I can't even remember now, and I thought: oh. There she is.",
  "A year of you has been a year of noticing things I'd stopped noticing. The way a city feels different at 7am. What a meal tastes like when someone you love made it. How much lighter a room gets when you walk into it.",
  "I've kept a running list in my head — things I want to tell you and forget to. That you're funnier than you think you are. That the way you get excited about small things is one of my favourite things about you. That I'm still a little amazed, most days, that you chose me.",
  "Thank you for this year. For the patience, the kindness, the honesty. For pushing me when I needed it and letting me be when I didn't. For being exactly yourself — no performance, no pretending.",
  "Here's to every year after this one.",
  "All my love, always —",
]

// ── Heart button ───────────────────────────────────────────────────────────
function HeartButton({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial)
  const [active, setActive] = useState(false)
  const [pop, setPop] = useState(false)

  const toggle = () => {
    setActive(a => !a)
    setCount(c => active ? c - 1 : c + 1)
    setPop(true)
    setTimeout(() => setPop(false), 300)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-sm select-none"
      style={{
        color: active ? 'var(--primary)' : 'var(--muted-fg)',
        transform: pop ? 'scale(1.25)' : 'scale(1)',
        transition: 'transform 0.2s ease, color 0.2s ease',
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count}
    </button>
  )
}

// ── Custom map pin ─────────────────────────────────────────────────────────
function makePin(emoji: string) {
  return L.divIcon({
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      background:var(--card,#fff9f4);
      border:2px solid var(--border,#e5d0c0);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;
      box-shadow:0 2px 10px rgba(44,26,14,0.15);
    ">${emoji}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  })
}

// ── Sections ───────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ minHeight: '100svh', background: 'var(--bg)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(194,97,74,0.10) 0%, transparent 70%)',
        }}
      />
      <p
        className="font-display italic mb-4 reveal"
        style={{ fontSize: 'clamp(2.8rem,8vw,5.5rem)', lineHeight: 1.05, color: 'var(--fg)' }}
      >
        for you,<br />always.
      </p>
      <p className="text-base reveal" style={{ color: 'var(--muted-fg)', maxWidth: 320, transitionDelay: '0.15s' }}>
        one year of us — captured, mapped, and written down.
      </p>
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 reveal"
        style={{ color: 'var(--muted-fg)', transitionDelay: '0.3s' }}
      >
        <span className="text-xs uppercase tracking-widest">scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="14" height="22" rx="7" />
          <circle cx="8" cy="7" r="2" fill="currentColor">
            <animate attributeName="cy" values="7;15;7" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <HeroAutoReveal />
    </section>
  )
}

function HeroAutoReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const timer = setTimeout(() => els.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150)
    }), 200)
    return () => clearTimeout(timer)
  }, [])
  return null
}

function PhotoCard({ photo, delay }: { photo: typeof photos[0]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className="rounded-3xl overflow-hidden shadow-sm"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="relative">
          <img
            src={photo.url}
            alt={photo.caption}
            loading="lazy"
            className="w-full object-cover"
            style={{ maxHeight: 480 }}
          />
          <span
            className="absolute bottom-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'rgba(253,246,239,0.88)', color: 'var(--muted-fg)' }}
          >
            {photo.date}
          </span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <p className="font-display italic text-base leading-snug" style={{ color: 'var(--fg)' }}>
            {photo.caption}
          </p>
          <HeartButton initial={photo.hearts} />
        </div>
      </div>
    </Reveal>
  )
}

function PhotoSection() {
  return (
    <section className="py-24 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted-fg)' }}>chapter one</span>
          <h2 className="font-display italic mt-2" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--fg)' }}>
            moments
          </h2>
        </Reveal>

        <div className="space-y-10">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} delay={0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MapSection() {
  return (
    <section className="py-24 px-4" style={{ background: 'var(--secondary)' }}>
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted-fg)' }}>chapter two</span>
          <h2 className="font-display italic mt-2" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--fg)' }}>
            places we found each other
          </h2>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-fg)' }}>
            tap any pin
          </p>
        </Reveal>

        <Reveal>
          <div
            className="rounded-3xl overflow-hidden shadow-md"
            style={{ height: 460, border: '1px solid var(--border)' }}
          >
            <MapContainer
              center={[48, 10]}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution=""
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {places.map(p => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={makePin(p.emoji)}>
                  <Popup>
                    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <p className="font-display italic text-base mb-1" style={{ color: 'var(--fg)' }}>
                        {p.name}
                      </p>
                      <p className="text-sm leading-snug" style={{ color: 'var(--muted-fg)' }}>
                        {p.note}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {places.map(p => (
              <span
                key={p.id}
                className="text-sm px-3 py-1.5 rounded-full"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                {p.emoji} {p.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function LetterSection() {
  return (
    <section className="py-24 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted-fg)' }}>chapter three</span>
          <h2 className="font-display italic mt-2" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--fg)' }}>
            a letter
          </h2>
        </Reveal>

        <Reveal stagger>
          <div className="space-y-6">
            {letterLines.map((line, i) => (
              <p
                key={i}
                className={i === 0 || i === letterLines.length - 1
                  ? 'font-display italic text-2xl'
                  : 'text-base leading-relaxed'}
                style={{ color: i === 0 || i === letterLines.length - 1 ? 'var(--primary)' : 'var(--fg)' }}
              >
                {line}
              </p>
            ))}
          </div>
        </Reveal>

        <div
          className="mt-16 h-px"
          style={{ background: 'linear-gradient(to right, transparent, var(--border), transparent)' }}
        />

        <Reveal className="text-center mt-10">
          <p className="font-display italic text-lg" style={{ color: 'var(--muted-fg)' }}>
            happy anniversary.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="text-center py-10 px-4" style={{ background: 'var(--secondary)', borderTop: '1px solid var(--border)' }}>
      <p className="font-display italic text-2xl" style={{ color: 'var(--fg)' }}>made with love</p>
      <p className="text-sm mt-1" style={{ color: 'var(--muted-fg)' }}>just for you</p>
    </footer>
  )
}

// ── Nav dots ───────────────────────────────────────────────────────────────
function NavDots() {
  const sections = ['hero', 'photos', 'map', 'letter']
  const [active, setActive] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target.id)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { threshold: 0.5 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5"
      aria-label="Page sections"
    >
      {sections.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          className="block rounded-full transition-all duration-300"
          style={{
            width: active === i ? 10 : 7,
            height: active === i ? 10 : 7,
            background: active === i ? 'var(--primary)' : 'var(--border)',
          }}
        />
      ))}
    </nav>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <NavDots />
      <div id="hero"><HeroSection /></div>
      <div id="photos"><PhotoSection /></div>
      <div id="map"><MapSection /></div>
      <div id="letter"><LetterSection /></div>
      <Footer />
    </>
  )
}
