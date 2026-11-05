import { useEffect, useState } from 'react'
import AutoGrasp from './AutoGrasp'
import HamsSimulation from './HamsSimulation'

const RESUME = 'Adam_Abid_Master.pdf'
// Last known-good film count. Only used if public/letterboxd.json cannot be read.
const FILM_COUNT_FALLBACK = 1043
// Writing section stays hidden until there are real articles to link
const SHOW_WRITING = false

const LAB = [
  { src: './images/autograsp.jpg', alt: 'UR5e arm with the MAGPIE gripper picking up a block', cap: 'AutoGrasp · UR5e + MAGPIE gripper', pos: '50% 62%' },
  { src: './images/golem.jpg', alt: 'Unitree H1-2 humanoid at the battery disassembly cell', cap: 'GOLEM · Unitree H1-2, Correll Lab', pos: '50% 45%' },
  { src: './images/correll.jpg', alt: 'Adam presenting a research poster on fine-tuning SmolVLA', cap: 'Poster · fine-tuning SmolVLA, CU Boulder', pos: '60% 40%' },
]

const RobotSVG = ({ className, id }) => (
  <svg id={id} className={className} width="120" height="130" viewBox="0 0 120 130">
    <line x1="60" y1="22" x2="60" y2="10" stroke="#5FBFB0" strokeWidth="2" />
    <circle cx="60" cy="7" r="4" fill="#5FBFB0" />
    <rect x="30" y="22" width="60" height="50" rx="14" fill="#182825" stroke="#2E8B7F" strokeWidth="2" />
    <circle className="eye" cx="48" cy="46" r="6.5" fill="#5FBFB0" />
    <circle className="eye" cx="72" cy="46" r="6.5" fill="#5FBFB0" />
    <rect x="50" y="60" width="20" height="4" rx="2" fill="#2E8B7F" />
    <rect x="40" y="76" width="40" height="34" rx="10" fill="#182825" stroke="#2E8B7F" strokeWidth="2" />
    <circle cx="60" cy="92" r="5" fill="#2E8B7F" />
  </svg>
)

const Metric = ({ v, pre = '', suf = '', label }) => <div><b data-count={v} data-prefix={pre} data-suffix={suf}>{pre}0{suf}</b><small>{label}</small></div>

// image with a quiet dotted-grid fallback (never shows a file path to visitors)
const Img = ({ src, alt, className, fit, bg, ph }) => {
  const [ok, setOk] = useState(false)
  return (
    <div className={'imgbox ' + (fit === 'contain' ? 'contain ' : '') + (className || '')} style={ok && bg ? { background: bg } : undefined}>
      {src && <img src={src} alt={alt} loading="lazy" style={{ opacity: ok ? 1 : 0 }} onLoad={() => setOk(true)} onError={() => setOk(false)} />}
      {!ok && ph && <span className="imghint">{ph}</span>}
    </div>
  )
}

const SwapImg = ({ srcs, alt, className }) => {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI(x => (x + 1) % srcs.length), 3500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className={'imgbox ' + (className || '')}>
      {srcs.map((s, k) => <img key={k} src={s} alt={alt} loading="lazy" className="swap-layer" style={{ opacity: k === i ? 1 : 0 }} />)}
    </div>
  )
}

const FILMS = [
  { t: 'The Battle of Algiers', url: 'https://letterboxd.com/film/the-battle-of-algiers/', img: 'https://a.ltrbxd.com/resized/sm/upload/kt/5s/28/w3/battle-algiers-1200-1200-675-675-crop-000000.jpg?v=70389d0066' },
  { t: 'Edge of Tomorrow', url: 'https://letterboxd.com/film/edge-of-tomorrow/', img: 'https://a.ltrbxd.com/resized/sm/upload/zo/77/9c/w6/edge%20of%20tomorrow-1200-1200-675-675-crop-000000.jpg?v=5d8152fdb2' },
  { t: 'Grave of the Fireflies', url: 'https://letterboxd.com/film/grave-of-the-fireflies/', img: 'https://a.ltrbxd.com/resized/sm/upload/9v/zy/xh/u3/grave-of-fireflies-1200-1200-675-675-crop-000000.jpg?v=adde23c8bd' },
  { t: 'La La Land', url: 'https://letterboxd.com/film/la-la-land/', img: 'https://a.ltrbxd.com/resized/sm/upload/a6/th/cz/kf/la-la-land-1200-1200-675-675-crop-000000.jpg?v=874a46b231' },
]

const CITIES = {
  bay: [37.6, -122.2],
  dubai: [25.2, 55.27],
  tunis: [36.8, 10.18],
  boulder: [40.02, -105.27],
}

const MS = [
  { year: '2020–21', place: 'Bay Area', title: 'Nara Vision', img: 'nara', fit: 'contain', bg: '#96F2CC', city: 'bay', desc: 'My first AI build: a Google Cloud Vision web app doing landmark, logo, OCR, emotion, and species recognition across 100+ images, demoed at the Synopsys Science Fair.' },
  { year: '2022', place: 'Dubai', title: 'Snap Inc. (AR Intern)', img: 'snap', city: 'dubai', desc: 'Shipped AR lenses used 100k+ times in Lens Studio with custom Blender models.' },
  { year: '2022', place: 'Tunisia', title: 'AIHack Tunisia × Bamboogeeks', img: 'aihack', city: 'tunis', desc: "Mentored 50+ builders at Africa & MENA's biggest ML hackathon (InstaDeep × Google, 1,000+ participants)." },
  { year: '2022–24', place: 'Dubai', title: 'High School Events', img: 'highschool', city: 'dubai', desc: "Founded my school's Muslim Student Association (70K+ AED raised for charity) and ran a charity football match (300+) and t-shirt fundraiser (300+ sold) that raised another 56K+ AED, alongside a school-wide Ideathon." },
  { year: '2024', place: 'Dubai', title: 'IB Transformer Research', img: 'ib', city: 'dubai', desc: 'Fine-tuned MarianMT and mBART for Arabic translation as an IB research project (A / top 8% worldwide).' },
  { year: '2024', place: 'Bay Area', title: 'Clinic Platform', img: 'clinic', city: 'bay', desc: 'Shipped a full-stack scheduling app that cut double-bookings 90% (Django REST, AJAX, Google OAuth).' },
  { year: '2025', place: 'Boulder', title: 'CU Boulder + Research', img: 'cuboulder', city: 'boulder', desc: 'Started CS + Statistics (graduating May 2028) and joined the $1.8M ARPA-E Correll lab and CU Quants.' },
  { year: '2026', place: 'Boulder', title: 'NSBE Torch Chair', img: 'nsbe', city: 'boulder', desc: "Torch Chair for CU Boulder's National Society of Black Engineers chapter, growing the community and pipeline for the next generation of engineers." },
  { year: '2026', place: 'Boulder', title: 'AutoGrasp + Humanoid Sim', img: 'autograsp', city: 'boulder', desc: 'A UR5e that collects and grades its own grasp data, reaching a 97/100 policy with zero human labels, plus humanoid simulation work (HAMS) that fed the GOLEM paper. AutoGrasp paper in progress.' },
  { year: '2027', place: 'Next', title: 'The dream internship', img: '', ph: 'next stop: loading', city: 'boulder', desc: 'To be determined 👀' },
]

function JourneyTimeline() {
  return (
    <div className="timeline" id="timeline">
      <div className="tl-line"></div><div className="tl-fill" id="tlfill"></div>
      {MS.map((m, k) => (
        <div className={k % 2 ? 'node alt' : 'node'} key={k}>
          <div className="node-row">
            <div className="node-text">
              <div className="yr">{m.year} · {m.place}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
            <Img src={m.img ? `./images/${m.img}.jpg` : ''} alt={m.title} fit={m.fit} bg={m.bg} ph={m.ph} className="node-img" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Home() {
  const [imgOk, setImgOk] = useState(false)
  const [films, setFilms] = useState(FILM_COUNT_FALLBACK)
  const [labOpen, setLabOpen] = useState(false)

  // live Letterboxd count, refreshed daily by .github/workflows/letterboxd.yml
  // falls back silently to FILM_COUNT_FALLBACK if the file is missing or malformed
  useEffect(() => {
    let alive = true
    // read straight from GitHub so the nightly count update shows up without a Netlify deploy
    fetch('https://raw.githubusercontent.com/ACWArob/portfolio/main/public/letterboxd.json', { cache: 'no-store' })
      .then(r => (r.ok ? r : fetch('./letterboxd.json')))
      .catch(() => fetch('./letterboxd.json'))
      .then(r => (r && r.ok ? r.json() : null))
      .then(d => { if (alive && d && Number.isFinite(d.films) && d.films > 0) setFilms(d.films) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  // lab photos stay hidden until the robot (or the text toggle) is clicked
  useEffect(() => {
    if (!labOpen) return
    const red = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('lab-strip')?.scrollIntoView({ behavior: red ? 'auto' : 'smooth', block: 'nearest' })
  }, [labOpen])

  // grasp path, robot orbit, reveals, timeline, count-up
  useEffect(() => {
    const red = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = document.getElementById('nav')
    const onNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onNav)

    const hero = document.getElementById('hero')


    // robot orbits the photo: its spot on the ring follows the cursor's angle around the photo
    const eyes = document.querySelectorAll('#robot .eye'); const robot = document.getElementById('robot')
    const photo = document.querySelector('#hero .photo'); const orbit = document.getElementById('orbit'); const ring = document.getElementById('orbit-ring')
    const REST = 40, RW = 120, RH = 130 // rest angle (deg, down-right like the old static spot), robot svg size
    let ang = REST, target = REST, lean = 0, orbitRaf = 0
    const place = () => {
      const w = photo.offsetWidth, gap = parseFloat(getComputedStyle(orbit).getPropertyValue('--orbit-gap')) || 22
      const r = w / 2 + gap, a = ang * Math.PI / 180
      const x = w / 2 + r * Math.cos(a) - RW / 2, y = w / 2 + r * Math.sin(a) - RH / 2
      robot.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + lean + 'deg)'
      ring.style.transform = 'rotate(' + ang + 'deg)'
    }
    const tick = () => {
      const diff = ((target - ang + 540) % 360) - 180
      ang += diff * 0.1
      lean += (Math.max(-14, Math.min(14, diff * 0.5)) - lean) * 0.2
      if (Math.abs(diff) < 0.05 && Math.abs(lean) < 0.05) { ang = target; lean = 0; place(); orbitRaf = 0; return }
      place(); orbitRaf = requestAnimationFrame(tick)
    }
    const kick = () => { if (!orbitRaf) orbitRaf = requestAnimationFrame(tick) }
    const onRobot = e => {
      const pr = photo.getBoundingClientRect()
      target = Math.atan2(e.clientY - (pr.top + pr.height / 2), e.clientX - (pr.left + pr.width / 2)) * 180 / Math.PI
      const rr = robot.getBoundingClientRect(), ex = e.clientX - (rr.left + rr.width / 2), ey = e.clientY - (rr.top + rr.height / 2)
      const d = Math.hypot(ex, ey) || 1, k = Math.min(3, d / 40)
      eyes.forEach(el => el.setAttribute('transform', 'translate(' + (ex / d * k) + ',' + (ey / d * k) + ')'))
      kick()
    }
    const onLeave = () => { target = REST; eyes.forEach(el => el.setAttribute('transform', 'translate(0,0)')); kick() }
    place(); robot.classList.add('placed'); requestAnimationFrame(() => orbit.classList.add('on'))
    window.addEventListener('resize', place)
    if (!red) { hero.addEventListener('mousemove', onRobot); hero.addEventListener('mouseleave', onLeave) }

    // grasp path: a dotted end-effector trajectory (approach, align, grasp) that ends on the photo's orbit ring
    const gp = document.getElementById('grasp-path')
    const gpMain = document.getElementById('gp-main'), gpMask = document.getElementById('gp-mpath')
    const gpGhosts = gp.querySelectorAll('.gp-ghost'), gpWps = gp.querySelectorAll('.gp-wp'), gpLabels = gp.querySelectorAll('text')
    let gpDrawn = false, gpTimer = 0
    const gpFinish = () => { gpMask.style.transition = ''; gpMask.style.strokeDasharray = ''; gpMask.style.strokeDashoffset = ''; gp.classList.add('done') }
    const drawPath = () => {
      const hr = hero.getBoundingClientRect(), pr = photo.getBoundingClientRect()
      const W = hr.width, H = hr.height
      gp.setAttribute('viewBox', '0 0 ' + W + ' ' + H)
      const gap = parseFloat(getComputedStyle(orbit).getPropertyValue('--orbit-gap')) || 22
      const px = pr.left - hr.left + pr.width / 2, py = pr.top - hr.top + pr.height / 2, R = pr.width / 2 + gap
      const S = [px - 4.6 * R, H - 40], W1 = [px - 1.8 * R, py + 0.9 * R], W2 = [px - 1.45 * R, py + 0.05 * R]
      const ea = 205 * Math.PI / 180, E = [px + R * Math.cos(ea), py + R * Math.sin(ea)]
      const f = v => v[0].toFixed(1) + ' ' + v[1].toFixed(1)
      const d = 'M ' + f(S) + ' C ' + f([S[0] + (W1[0] - S[0]) * 0.6, S[1]]) + ' ' + f([W1[0] - 0.35 * R, W1[1] + 0.55 * R]) + ' ' + f(W1) +
        ' S ' + f([W2[0] - 0.05 * R, W2[1] + 0.45 * R]) + ' ' + f(W2) + ' S ' + f([E[0] - 0.55 * R, E[1] + 0.05 * R]) + ' ' + f(E)
      gpMain.setAttribute('d', d); gpMask.setAttribute('d', d); gpGhosts.forEach(g => g.setAttribute('d', d))
      ;[W1, W2, E].forEach((w, i) => { gpWps[i].setAttribute('cx', w[0]); gpWps[i].setAttribute('cy', w[1]) })
      const lp = [[W1[0] + 16, W1[1] + 4], [W2[0] + 14, W2[1] - 12], [E[0] - 76, E[1] - 14]]
      gpLabels.forEach((t, i) => { t.setAttribute('x', lp[i][0]); t.setAttribute('y', lp[i][1]) })
      if (gpDrawn) return
      gpDrawn = true
      let L = 0
      try { L = gpMain.getTotalLength() } catch (e) { L = 0 }
      if (red || !L) { gpFinish(); return }
      gpMask.style.strokeDasharray = L + ' ' + L; gpMask.style.strokeDashoffset = L
      gpMask.getBoundingClientRect()
      requestAnimationFrame(() => { gpMask.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.45,0,.2,1) .25s'; gpMask.style.strokeDashoffset = 0 })
      gpMask.addEventListener('transitionend', gpFinish, { once: true })
      gpTimer = setTimeout(gpFinish, 2600)
    }
    const ro = new ResizeObserver(() => { if (gpDrawn && !gp.classList.contains('done')) gpFinish(); drawPath() })
    ro.observe(hero); drawPath()

    // reveal
    const io = new IntersectionObserver(en => en.forEach(x => x.isIntersecting && x.target.classList.add('in')), { threshold: .18 })
    document.querySelectorAll('.node,.xcard').forEach(el => io.observe(el))

    // timeline fill
    const tl = document.getElementById('timeline'), fill = document.getElementById('tlfill')
    const onScroll = () => { if (!tl) return; const r = tl.getBoundingClientRect(); let p = (window.innerHeight * 0.75 - r.top) / r.height; p = Math.max(0, Math.min(1, p)); fill.style.height = (p * 100) + '%' }
    window.addEventListener('scroll', onScroll); onScroll()

    // count-up
    const countUp = el => {
      const target = parseFloat(el.dataset.count), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', dec = (target % 1 !== 0) ? 1 : 0
      let t0 = null; const step = ts => { if (!t0) t0 = ts; const p = Math.min(1, (ts - t0) / 1400); el.textContent = pre + (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step) }
      requestAnimationFrame(step)
    }
    const cio = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { countUp(x.target); cio.unobserve(x.target) } }), { threshold: .6 })
    document.querySelectorAll('[data-count]').forEach(el => { if (red) el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || ''); else cio.observe(el) })

    return () => {
      window.removeEventListener('scroll', onNav); ro.disconnect(); clearTimeout(gpTimer)
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', place)
      hero.removeEventListener('mousemove', onRobot); hero.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(orbitRaf)
      io.disconnect(); cio.disconnect()
    }
  }, [])

  return (
    <>
      <nav id="nav">
        <div className="brand"><div className="mono-badge">AA</div><span>Adam Abid</span></div>
        <div className="navlinks">
          <a href="#about">About</a><a href="#journey">Journey</a><a href="#experience">Experience</a>
          <a href="#projects">Projects</a><a href="#fun">Life</a>{SHOW_WRITING && <a href="#articles">Articles</a>}
          <a className="btn-solid" href={RESUME} target="_blank" rel="noreferrer">Résumé</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <svg id="grasp-path" className="grasp-path" aria-hidden="true">
          <defs><mask id="gp-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><path id="gp-mpath" className="gp-mpath" /></mask></defs>
          <path className="gp-ghost late" transform="translate(18 -22)" />
          <path className="gp-ghost late" transform="translate(-26 30)" />
          <path id="gp-main" className="gp-main" mask="url(#gp-mask)" />
          <circle className="gp-wp late" r="5" /><circle className="gp-wp late" r="5" /><circle className="gp-wp gp-end late" r="4" />
          <text className="late">01 approach</text><text className="late">02 align</text><text className="late">03 grasp</text>
        </svg>
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">Builder-researcher · Robotics &amp; ML</div>
            <h1 className="name">ADAM ABID</h1>
            <p className="tagline">I build intelligent systems, and the communities around them.</p>
            <div className="loc"><span><b>Boulder</b></span><span>·</span><span><b>Bay Area</b></span></div>
            <div className="cta">
              <a className="primary" href="#experience">View Work →</a>
              <a href={RESUME} target="_blank" rel="noreferrer">Résumé</a>
              <a href="https://linkedin.com/in/adam-w-abid" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/acwarob" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <button type="button" className="lab-toggle" aria-expanded={labOpen} aria-controls="lab-strip" onClick={() => setLabOpen(o => !o)}>{labOpen ? 'hide the lab ↑' : 'see the lab ↓'}</button>
          </div>
          <div className="hero-visual">
            <div className="photo-wrap">
            <div className="photo">
              <img className="photo-img" src="./profile.jpg" alt="Adam Abid" style={{ opacity: imgOk ? 1 : 0 }} onLoad={() => setImgOk(true)} onError={() => setImgOk(false)} />
              {!imgOk && <div className="photo-fallback"><svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="18" fill="#2E8B7F" /><path d="M22 82c0-16 12-26 28-26s28 10 28 26" fill="#2E8B7F" /></svg></div>}
              {!imgOk && <span className="ph">save your photo as profile.jpg</span>}
            </div>
            <div className="orbit" id="orbit" aria-hidden="true"><div className="orbit-ring" id="orbit-ring"></div></div>
            <button type="button" id="robot" className="robot-hero robot-btn" aria-label={labOpen ? 'Hide lab photos' : 'Show lab photos'} aria-expanded={labOpen} aria-controls="lab-strip" title="see the lab" onClick={() => setLabOpen(o => !o)}><RobotSVG /></button>
            </div>
          </div>
        </div>
        <div className="scrollhint mono"><span>scroll ↓</span></div>
      </section>

      {/* LAB PHOTOS: revealed on click */}
      <div id="lab-strip" className="lab-strip" hidden={!labOpen}>
        <div className="wrap lab-grid">
          {LAB.map((f, i) => (
            <figure key={f.src} style={{ '--i': i }}>
              <img src={f.src} alt={f.alt} loading="lazy" style={{ objectPosition: f.pos }} />
              <figcaption>{f.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="pad">
        <div className="wrap">
          <div className="shead"><span className="num">01</span><h2>About</h2></div>
          <div className="about-grid">
            <div>
              <p>I'm a builder who cares most about the person on the other end of the screen. I got my start in the Bay Area and have been on a build-and-learn loop ever since, drawn to <b>user-focused machine learning</b> that turns research into things people actually use. I'm always in the middle of a side project, quick to pick up new tools, and at my best when I'm learning something new and pulling a team along with me.</p>
              <div className="facts"><span>CU Boulder</span><span>CS + Statistics</span><span>3.92 GPA</span><span>Graduating May 2028</span><span>US Citizen</span><span>Runner 🏃</span><span>Hiker 🥾</span><span>Coffee ☕</span><span>Film buff 🎬</span><span>Bilingual (EN/AR)</span><span>Real Madrid ⚽</span></div>
            </div>
            <div className="coffee">
              <Img src="./about.jpg" alt="Adam with coffee" hint="add about.jpg (you + coffee)" className="about-img" />
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="pad">
        <div className="wrap">
          <div className="shead"><span className="num">02</span><h2>The Journey</h2></div>
          <p className="jlead">From a Bay Area science fair to a Boulder robotics lab.</p>
          <JourneyTimeline />
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="pad">
        <div className="wrap">
          <div className="shead"><span className="num">03</span><h2>Experience</h2></div>
          <div className="xgrid">
            <div className="xcard">
              <Img src="./images/correll.jpg" alt="Correll Lab" hint="images/correll.jpg" className="xcard-img" />
              <div className="top"><div><h3>Correll Lab · CU Robotics</h3><div className="role">Research Assistant</div></div><div className="when">2025–now</div></div>
              <p>Two robotics projects. <b>AutoGrasp</b>: a UR5e + MAGPIE gripper that self-collects and grades its own grasp data, reaching a 97/100 policy with zero human labels (SPUR final project). <b>HAMS</b>: simulation work for a humanoid manipulation paper on the Correll Lab H1, comparing grasp methods and hardening the real-time sim stack, which fed the lab's GOLEM paper (arXiv 2608.21550). AutoGrasp paper in progress.</p>
              <div className="metrics"><Metric v="97" label="/100 grasp policy" /><Metric v="1.8" pre="$" suf="M" label="ARPA-E lab" /></div>
              <div className="chips"><span>ROS2</span><span>MuJoCo</span><span>Isaac Sim</span><span>ACT</span><span>GraspGenX</span></div>
            </div>
            <div className="xcard">
              <Img src="./images/naveera.jpg" alt="Naveera site rebuild" hint="images/naveera.jpg" className="xcard-img" />
              <div className="top"><div><h3>Naveera · NEMT Software</h3><div className="role">Contract Web Engineer</div></div><div className="when">2026 · Denver</div></div>
              <p>Rebuilding a Denver non-emergency medical transport routing company's site as one scroll-driven WebGL film. Their value is invisible in a screenshot, so the last beat is the product itself: pick a capability class, click the map, and the nearest <b>compliant</b> vehicle breaks route and runs the detour. The scene is a pure function of scroll position, which is what lets the client's real footage replace a 3D beat through one config field.</p>
              <div className="metrics"><Metric v="19" label="prerendered routes" /><Metric v="5" label="beats, one camera move" /><Metric v="70" label="route/viewport checks" /></div>
              <div className="chips"><span>Next.js 16</span><span>React 19</span><span>TypeScript</span><span>Three.js / R3F</span><span>GSAP ScrollTrigger</span></div>
            </div>
            <div className="xcard">
              <div className="imgbox xcard-img xcard-band" aria-hidden="true"><RobotSVG /></div>
              <div className="top"><div><h3>Campos Student Center · CU Boulder</h3><div className="role">Community and Scholarship Assistant</div></div><div className="when">2026–now</div></div>
              <p>Mentoring first-year BOLD Scholars one-on-one with resource referrals as they start at CU Boulder, co-planning community events with Campos staff, and managing participation and quiz data for program staff.</p>
              <div className="metrics"><Metric v="4" suf="+" label="events" /><Metric v="100" suf="+" label="students reached" /><Metric v="80" suf="+" label="students tracked" /></div>
              <div className="chips"><span>Mentoring</span><span>Leadership</span><span>Events</span><span>Data</span></div>
            </div>
            <div className="xcard">
              <Img src="./images/cuquants.jpg" alt="CU Quants team" hint="images/cuquants.jpg" className="xcard-img" />
              <div className="top"><div><h3>CU Quants</h3><div className="role">Software Engineer</div></div><div className="when">2025–now</div></div>
              <p>Building <b>QuantX</b>, a market-simulation trading platform, plus an adversarial agent that stress-tests it. Support a student fund that beat the S&amp;P by 20% last quarter.</p>
              <div className="metrics"><Metric v="200" pre="$" suf="K" label="fund tested" /><Metric v="20" suf="%" label="vs S&amp;P" /><Metric v="75" suf="+" label="scenarios" /></div>
              <div className="chips"><span>Python</span><span>Simulation</span><span>Backtesting</span><span>Adversarial agent</span></div>
            </div>
            <div className="xcard">
              <Img src="./images/snap.jpg" alt="Snap AR" hint="images/snap.jpg" className="xcard-img" />
              <div className="top"><div><h3>Snap Inc.</h3><div className="role">AR Development Intern</div></div><div className="when">2022–2024 · Dubai</div></div>
              <p>Engineered AR tracking and shipped lenses with custom Blender 3D models, recognized internally for delivery speed and adoption.</p>
              <div className="metrics"><Metric v="100" suf="k+" label="global uses" /></div>
              <div className="chips"><span>JavaScript</span><span>TypeScript</span><span>Lens Studio</span><span>Blender</span></div>
            </div>
            <div className="xcard">
              <Img src="./images/bamboogeeks.jpg" alt="Bamboogeeks" hint="images/bamboogeeks.jpg" className="xcard-img" />
              <div className="top"><div><h3>Bamboogeeks</h3><div className="role">AI Mentor &amp; Project Manager</div></div><div className="when">2022–now · Dubai</div></div>
              <p>Designed technical tracks and mentored 50+ builders across MEA hackathons, including AIHack Tunisia (InstaDeep × Google, 1,000+ participants from 14+ countries).</p>
              <div className="metrics"><Metric v="50" suf="+" label="mentored" /><Metric v="1000" suf="+" label="participants" /></div>
              <div className="chips"><span>Mentorship</span><span>Machine Learning</span><span>Events</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="pad">
        <div className="wrap">
          <div className="shead"><span className="num">04</span><h2>Projects &amp; Research</h2></div>
          <div className="xgrid">
            <a className="xcard xcard-link feature" href="#/projects/autograsp">
              <div className="feat-tag">Flagship · Case study</div>
              <div className="top"><div><h3>AutoGrasp</h3><div className="role">Robotics Research</div></div><div className="when">2026 · in progress</div></div>
              <p>Teaching a robot to teach itself: a ROS2 stack, a self-grading data engine, and the honest failure that led to a <b>97/100</b> grasp policy with zero human labels.</p>
              <div className="metrics"><Metric v="97" label="/100 picks" /><Metric v="0" label="human labels" /><Metric v="66.7" label="episodes/hr" /></div>
              <div className="chips"><span>ROS2</span><span>SAM3</span><span>ACT</span><span>LeRobot</span><span>GraspGenX</span></div>
              <div className="cs-read">Read the case study →</div>
            </a>
            <a className="xcard xcard-link feature" href="#/projects/hams-simulation">
              <div className="feat-tag">Robotics Research · Simulation</div>
              <div className="top"><div><h3>HAMS Simulation</h3><div className="role">Correll Lab · humanoid paper</div></div><div className="when">2026</div></div>
              <p>My simulation work on HAMS, the Correll Lab's Unitree H1 stack: four grasp-planning methods compared across frozen, hanging and standing bases, a world-frame executor fix that took centroid grasping on a standing robot from 0 to 24 of 30 trials, and a CPU-only port so the sim runs on a laptop. It fed the lab's GOLEM paper.</p>
              <div className="metrics"><Metric v="24" label="/30 standing grasps, up from 0" /><Metric v="4" label="grasp methods compared" /></div>
              <div className="chips"><span>MuJoCo</span><span>RoboCasa</span><span>Isaac Sim</span><span>ROS2</span><span>Grasp comparison</span></div>
              <div className="cs-read">Read the case study →</div>
            </a>
            <a className="xcard xcard-link" href="https://arxiv.org/abs/2608.21550" target="_blank" rel="noreferrer">
              <Img src="./images/golem.jpg" alt="Unitree H1-2 humanoid at the RAPID battery disassembly cell" hint="images/golem.jpg" className="xcard-img" />
              <div className="feat-tag">Paper · arXiv 2608.21550</div>
              <div className="top"><div><h3>GOLEM</h3><div className="role">Correll Lab · co-author</div></div><div className="when">2026</div></div>
              <p>Modular humanoid autonomy for EV battery disassembly on the Unitree H1-2: walking, balance, manipulation, navigation and memory are swappable modules behind common interfaces, in sim and on the real robot. My part was the simulated fridge-handle grasp benchmark in RoboCasa, comparing centroid, antipodal and GraspGenX grasping with the robot tethered and standing.</p>
              <div className="chips"><span>Unitree H1-2</span><span>ROS 2</span><span>MuJoCo</span><span>RoboCasa</span><span>GraspGenX</span></div>
              <div className="cs-read">Read the paper →</div>
            </a>
            <a className="xcard xcard-link" href="https://devpost.com/software/niche-flg7ip" target="_blank" rel="noreferrer">
              <Img src="./images/niche.jpg" alt="Niche app: swipe real clothes and see them on you" hint="images/niche.jpg" className="xcard-img" />
              <div className="top"><div><h3>Niche</h3><div className="role">Cal Hacks 13.0 · with Nabil and Ryan Djaber</div></div><div className="when">2026</div></div>
              <p>A shopping app that styles new clothes around the closet you already own: swipe real listings from 8 stores, see each piece on your own photo, and check out once across every store. Claude ranks the feed rules-first and scores fits, Gemini swaps one garment into your real photo, and Capital One's Nessie API splits one cart into a purchase per store.</p>
              <div className="metrics"><Metric v="0" suf="%" label="style clashes, down from 11%" /><Metric v="780" label="backend tests" /><Metric v="8" label="stores, one cart" /></div>
              <div className="chips"><span>Flutter</span><span>FastAPI</span><span>Claude</span><span>Gemini</span><span>Capital One Nessie</span></div>
              <div className="cs-read">View on Devpost →</div>
            </a>
            <a className="xcard xcard-link" href="https://github.com/ACWArob/ask-algeria" target="_blank" rel="noreferrer">
              <Img src="./images/askalgeria.jpg" alt="Ask Algeria home page" hint="images/askalgeria.jpg" className="xcard-img" />
              <div className="top"><div><h3>Ask Algeria</h3><div className="role">Multilingual civic assistant</div></div><div className="when">2026</div></div>
              <p>Plain answers about Algerian public services in English, French, Arabic and Darija, taken only from official pages. It searches about 1,150 official pages and PDFs, cites every fact, and tailors answers to your own wilaya or consulate. Many .dz sites block foreign visitors, so a tester inside Algeria runs a polite crawler to keep pages current. Independent, not a government site.</p>
              <div className="metrics"><Metric v="146" label="missions in 104 countries" /><Metric v="4" label="languages" /></div>
              <div className="chips"><span>Next.js</span><span>TypeScript</span><span>Claude API</span><span>MiniSearch</span><span>Vercel</span></div>
              <div className="cs-read">View on GitHub →</div>
            </a>
            <a className="xcard xcard-link" href="https://github.com/ACWArob/Trace" target="_blank" rel="noreferrer">
              <Img src="./images/trace.jpg" alt="Trace cinema shelf" hint="images/trace.jpg" className="xcard-img" />
              <div className="top"><div><h3>Trace</h3><div className="role">Personal media tracker</div></div><div className="when">2026</div></div>
              <p>Films, TV, books, albums and memories, each in its own illustrated room. Imports full Letterboxd, Goodreads and IMDb histories, searches real catalogs, and blends public ratings into a Trace score weighted by vote count, with the formula on screen. Browser JavaScript and the Python standard library, no install step or paid API.</p>
              <div className="chips"><span>JavaScript</span><span>Python</span><span>SQLite</span><span>Product Design</span></div>
              <div className="cs-read">View on GitHub →</div>
            </a>
            <a className="xcard xcard-link" href="https://naveeratest.netlify.app" target="_blank" rel="noreferrer">
              <div className="top"><div><h3>Naveera Site Rebuild</h3><div className="role">WebGL · Contract · Denver</div></div><div className="when">2026 · in progress</div></div>
              <p>One continuous camera move along a 21km road, fully procedural with no imported 3D models, ending in an interactive dispatch board that enforces capability as a hard constraint: a stretcher call is never answered by the ambulatory van parked next to it. Built so the client's real footage can replace any 3D beat without rewriting a transition.</p>
              <div className="chips"><span>Next.js</span><span>Three.js</span><span>React Three Fiber</span><span>GSAP ScrollTrigger</span><span>TypeScript</span></div>
              <div className="cs-read">View the build →</div>
            </a>
            <div className="xcard">
              <div className="top"><div><h3>Nara Vision</h3><div className="role">Computer-Vision Web App</div></div><div className="when">2020–21</div></div>
              <p>A web app on Google Cloud Vision with five features: landmark recognition, logo detection, OCR, facial-emotion, and species/label classification, validated across 100+ images and demoed at the Synopsys Science Fair.</p>
              <div className="chips"><span>JavaScript</span><span>Google Cloud Vision</span><span>OCR</span><span>HTML/CSS</span></div>
            </div>
            <div className="xcard">
              <div className="top"><div><h3>Clinic Scheduling System</h3><div className="role">Full-Stack App · San Mateo, CA</div></div><div className="when">2024</div></div>
              <p>A physician-clinic platform that cut double-bookings 90% with automated rescheduling, notifications, and calendar sync, built with Django REST + AJAX + Google OAuth and maintained via monthly Scrum sprints.</p>
              <div className="chips"><span>Django REST</span><span>AJAX</span><span>Google OAuth</span><span>Scrum</span></div>
            </div>
            <div className="xcard">
              <div className="top"><div><h3>Arabic Translation Research</h3><div className="role">IB Research · Dubai</div></div><div className="when">2024</div></div>
              <p>Compared MarianMT vs mBART transformers, fine-tuned in TensorFlow on CCMatrix, benchmarking corruption/denoising effects on translation fidelity. Graded A (top 8% worldwide).</p>
              <div className="chips"><span>TensorFlow</span><span>Transformers</span><span>NLP</span><span>Hugging Face</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* OFF THE CLOCK */}
      <section id="fun" className="pad">
        <div className="wrap">
          <div className="shead"><span className="num">05</span><h2>Off the Clock</h2></div>
          <div className="fungrid">
            <div className="funcard">
              <div className="funtop"><span className="funicon">🎬</span><h3>Film</h3></div>
              <p>{films.toLocaleString()} films logged and counting. My four favorites:</p>
              <div className="filmrow">
                {FILMS.map(f => (
                  <a key={f.t} className="film-poster" href={f.url} target="_blank" rel="noreferrer">
                    <img src={f.img} alt={f.t} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <span className="film-cap">{f.t}</span>
                  </a>
                ))}
              </div>
              <a className="funlink" href="https://letterboxd.com/ACWArob/" target="_blank" rel="noreferrer">On Letterboxd →</a>
            </div>
            <div className="funcard">
              <Img src="./images/madrid.jpg" alt="At the Bernabeu" hint="images/madrid.jpg" className="fun-img" />
              <div className="funtop"><span className="funicon">🏟️</span><h3>Sports</h3></div>
              <ul className="funlist"><li>⚽ Fútbol: Hala Madrid</li><li>🏈 NFL: Denver Broncos, #TebowTime</li><li>🏀 NBA: Nuggets &amp; Warriors (yes, both, I know it's illegal)</li></ul>
            </div>
            <div className="funcard">
              <Img src="./images/academicgames.jpg" alt="Academic Games" hint="images/academicgames.jpg" className="fun-img" />
              <div className="funtop"><span className="funicon">🧠</span><h3>Trivia</h3></div>
              <p>I love trivia, especially history and sports. Give me a buzzer and a category and I'm happy.</p>
            </div>
            <div className="funcard">
              <Img src="./images/coffee.jpg" alt="Coffee" hint="images/coffee.jpg" className="fun-img" />
              <div className="funtop"><span className="funicon">☕</span><h3>Coffee</h3></div>
              <p>I make my own at home, dialing in the grind and the ratio. It is the ritual that starts every build.</p>
            </div>
            <div className="funcard">
              <Img src="./images/books.jpg" alt="Reading" hint="images/books.jpg" className="fun-img" />
              <div className="funtop"><span className="funicon">📚</span><h3>Books</h3></div>
              <p>Always mid-book, usually a mix of classics and the odd sci-fi.</p>
            </div>
            <div className="funcard">
              <Img src="./images/hiking.jpg" alt="Hiking" hint="images/hiking.jpg" className="fun-img" />
              <div className="funtop"><span className="funicon">🥾</span><h3>Outdoors</h3></div>
              <p>When I am not building, I am on a trail. Hiking and running are how I reset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      {SHOW_WRITING && (
      <section id="articles" className="pad" style={{ background: 'var(--ink2)' }}>
        <div className="wrap">
          <div className="shead"><span className="num">06</span><h2>Writing</h2></div>
          <div className="art-empty">Your LinkedIn articles + a markdown blog land here. Send me the links and I'll wire up the cards.</div>
        </div>
      </section>
      )}

      {/* FOOTER */}
      <footer>
        <RobotSVG className="robot-foot" />
        <h2>Let's build something.</h2>
        <p className="sub">Or just grab a coffee ☕. I'm always up for a good conversation.</p>
        <div className="flinks">
          <a className="foot-btn" href="mailto:adam.abid@colorado.edu">Email me</a>
          <a className="foot-link" href="https://linkedin.com/in/adam-w-abid" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="foot-link" href="https://github.com/acwarob" target="_blank" rel="noreferrer">GitHub</a>
          <a className="foot-link" href="tel:+16502937226">(650) 293-7226</a>
        </div>
        <div className="foot-note">Designed &amp; built by Adam Abid · Boulder · Bay Area</div>
      </footer>
    </>
  )
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (route.startsWith('#/projects/autograsp')) return <AutoGrasp />
  if (route.startsWith('#/projects/hams-simulation')) return <HamsSimulation />
  return <Home />
}
