import { useEffect, useState, useRef } from 'react'
import AutoGrasp from './AutoGrasp'
import HamsSimulation from './HamsSimulation'

const RESUME = 'Adam_Abid_Master.pdf'
const WORDS = ['Applied ML', 'Robotics', 'Software', 'Customer-Focused']

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

const Img = ({ src, alt, hint, className }) => {
  const [ok, setOk] = useState(false)
  return (
    <div className={'imgbox ' + (className || '')}>
      <img src={src} alt={alt} loading="lazy" style={{ opacity: ok ? 1 : 0 }} onLoad={() => setOk(true)} onError={() => setOk(false)} />
      {!ok && <span className="imghint">{hint}</span>}
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
  { year: '2020–21', place: 'Bay Area', title: 'Nara Vision', img: 'nara', city: 'bay', desc: 'My first AI build: a Google Cloud Vision web app doing landmark, logo, OCR, emotion, and species recognition across 100+ images, demoed at the Synopsys Science Fair.' },
  { year: '2022', place: 'Dubai', title: 'Snap Inc. (AR Intern)', img: 'snap', city: 'dubai', desc: 'Shipped AR lenses used 100k+ times in Lens Studio with custom Blender models.' },
  { year: '2022', place: 'Tunisia', title: 'AIHack Tunisia × Bamboogeeks', img: 'aihack', city: 'tunis', desc: "Mentored 50+ builders at Africa & MENA's biggest ML hackathon (InstaDeep × Google, 1,000+ participants)." },
  { year: '2022–24', place: 'Dubai', title: 'High School Events', img: 'highschool', city: 'dubai', desc: "Founded my school's Muslim Student Association (70K+ AED raised for charity) and ran a charity football match (300+) and t-shirt fundraiser (300+ sold) that raised another 56K+ AED, alongside a school-wide Ideathon." },
  { year: '2024', place: 'Dubai', title: 'IB Transformer Research', img: 'ib', city: 'dubai', desc: 'Fine-tuned MarianMT and mBART for Arabic translation as an IB research project (A / top 8% worldwide).' },
  { year: '2024', place: 'Bay Area', title: 'Clinic Platform', img: 'clinic', city: 'bay', desc: 'Shipped a full-stack scheduling app that cut double-bookings 90% (Django REST, AJAX, Google OAuth).' },
  { year: '2025', place: 'Boulder', title: 'CU Boulder + Research', img: 'cuboulder', city: 'boulder', desc: 'Started CS + Statistics (graduating May 2028) and joined the $1.8M ARPA-E Correll lab and CU Quants.' },
  { year: '2026', place: 'Boulder', title: 'NSBE Torch Chair', img: 'nsbe', city: 'boulder', desc: "Torch Chair for CU Boulder's National Society of Black Engineers chapter, growing the community and pipeline for the next generation of engineers." },
  { year: '2026', place: 'Boulder', title: 'AutoGrasp + Humanoid Sim', img: 'autograsp', city: 'boulder', desc: 'A UR5e that collects and grades its own grasp data, reaching a 97/100 policy with zero human labels, plus humanoid simulation work (HAMS). Papers in progress.' },
  { year: '2027', place: 'Next', title: 'The dream internship', img: 'goal', city: 'boulder', desc: 'To be determined 👀' },
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
            <Img src={`./images/${m.img}.jpg`} alt={m.title} hint={`images/${m.img}.jpg`} className="node-img" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Home() {
  const [ri, setRi] = useState(0)
  const [imgOk, setImgOk] = useState(false)
  const reduce = useRef(false)

  // rotating positioning word
  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce.current) return
    const id = setInterval(() => setRi(i => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  // canvas net, robot tracking, reveals, timeline, count-up
  useEffect(() => {
    const red = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = document.getElementById('nav')
    const onNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onNav)

    // neural network
    const cv = document.getElementById('net'); const ctx = cv.getContext('2d')
    let W, H, nodes = [], raf, mouse = { x: -999, y: -999 }
    const build = () => { nodes = []; const n = Math.min(64, Math.floor(W * H / 22000)); for (let k = 0; k < n; k++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }) }
    const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; build() }
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let a = 0; a < nodes.length; a++) {
        const p = nodes[a]
        if (!red) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1 }
        for (let b = a + 1; b < nodes.length; b++) {
          const q = nodes[b], d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 140) { ctx.strokeStyle = 'rgba(46,139,127,' + (0.45 * (1 - d / 140)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
        }
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        ctx.beginPath(); ctx.arc(p.x, p.y, md < 120 ? 3.2 : 2, 0, 7); ctx.fillStyle = md < 120 ? '#5FBFB0' : 'rgba(95,191,176,.55)'; ctx.fill()
      }
      if (!red) raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize', size)
    const hero = document.getElementById('hero')
    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    hero.addEventListener('mousemove', onMove)
    size(); draw()

    // robot cursor tracking
    const eyes = document.querySelectorAll('#robot .eye'); const robot = document.getElementById('robot')
    const onRobot = e => {
      const cx = window.innerWidth * 0.72, cy = window.innerHeight * 0.5
      const dx = Math.max(-3, Math.min(3, (e.clientX - cx) / 120)), dy = Math.max(-3, Math.min(3, (e.clientY - cy) / 120))
      eyes.forEach(el => el.setAttribute('transform', 'translate(' + dx + ',' + dy + ')'))
      if (robot) robot.style.transform = 'translate(' + (dx * 1.4) + 'px,' + (dy * 1.4) + 'px)'
    }
    if (!red) window.addEventListener('mousemove', onRobot)

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
      window.removeEventListener('scroll', onNav); window.removeEventListener('resize', size)
      window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onRobot)
      hero.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); io.disconnect(); cio.disconnect()
    }
  }, [])

  return (
    <>
      <nav id="nav">
        <div className="brand"><div className="mono-badge">AA</div><span>Adam Abid</span></div>
        <div className="navlinks">
          <a href="#about">About</a><a href="#journey">Journey</a><a href="#experience">Experience</a>
          <a href="#projects">Projects</a><a href="#fun">Life</a><a href="#articles">Articles</a>
          <a className="btn-solid" href={RESUME} target="_blank" rel="noreferrer">Résumé</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <canvas id="net"></canvas>
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">FOCUSED ON <span className="rotor"><span className="rotor-word" key={ri}>{WORDS[ri]}</span></span></div>
            <h1 className="name">ADAM ABID</h1>
            <p className="tagline">I build intelligent systems, and the communities around them.</p>
            <div className="loc"><span>📍 <b>Boulder</b></span><span>·</span><span><b>Bay Area</b></span></div>
            <div className="cta">
              <a className="primary" href="#experience">View Work →</a>
              <a href={RESUME} target="_blank" rel="noreferrer">Résumé</a>
              <a href="https://linkedin.com/in/adam-w-abid" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/acwarob" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="photo-wrap">
            <div className="photo">
              <img className="photo-img" src="./profile.jpg" alt="Adam Abid" style={{ opacity: imgOk ? 1 : 0 }} onLoad={() => setImgOk(true)} onError={() => setImgOk(false)} />
              {!imgOk && <div className="photo-fallback"><svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="18" fill="#2E8B7F" /><path d="M22 82c0-16 12-26 28-26s28 10 28 26" fill="#2E8B7F" /></svg></div>}
              {!imgOk && <span className="ph">save your photo as profile.jpg</span>}
            </div>
            <RobotSVG id="robot" className="robot-hero" />
            </div>
          </div>
        </div>
        <div className="scrollhint mono"><span>scroll ↓</span></div>
      </section>

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
              <p>Two robotics projects. <b>AutoGrasp</b>: a UR5e + MAGPIE gripper that self-collects and grades its own grasp data, reaching a 97/100 policy with zero human labels (SPUR final project). <b>HAMS</b>: simulation work for a humanoid manipulation paper on the Correll Lab H1, comparing grasp methods and hardening the real-time sim stack. Papers in progress.</p>
              <div className="metrics"><Metric v="97" label="/100 grasp policy" /><Metric v="1.8" pre="$" suf="M" label="ARPA-E lab" /></div>
              <div className="chips"><span>ROS2</span><span>MuJoCo</span><span>Isaac Sim</span><span>ACT</span><span>GraspGenX</span></div>
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
              <div className="top"><div><h3>HAMS Simulation</h3><div className="role">Correll Lab · humanoid paper</div></div><div className="when">2026 · in progress</div></div>
              <p>My simulation work on the Correll Lab H1 humanoid: getting the stack to run on a laptop (CPU-only), a head-to-head comparison of grasp-planning methods, and the real-time debugging (DDS sensor drops, controller stability) that makes a humanoid grasp reliably in sim.</p>
              <div className="chips"><span>MuJoCo</span><span>RoboCasa</span><span>Isaac Sim</span><span>ROS2</span><span>Grasp comparison</span></div>
              <div className="cs-read">Read the case study →</div>
            </a>
            <div className="xcard">
              <div className="top"><div><h3>Nara Vision</h3><div className="role">Computer-Vision Web App</div></div><div className="when">2020–21</div></div>
              <p>A web app on Google Cloud Vision with five features: landmark recognition, logo detection, OCR, facial-emotion, and species/label classification, validated across 100+ images and demoed at the Synopsys Science Fair.</p>
              <div className="chips"><span>JavaScript</span><span>Google Cloud Vision</span><span>OCR</span><span>HTML/CSS</span></div>
            </div>
            <div className="xcard">
              <div className="top"><div><h3>Clinic Scheduling System</h3><div className="role">Full-Stack App · Dubai</div></div><div className="when">2024</div></div>
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
              <p>1,043 films logged and counting. My four favorites:</p>
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
              <SwapImg srcs={['./images/coffee.jpg', './images/coffee2.jpg']} alt="Coffee" className="fun-img" />
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
      <section id="articles" className="pad" style={{ background: 'var(--ink2)' }}>
        <div className="wrap">
          <div className="shead"><span className="num">06</span><h2>Writing</h2></div>
          <div className="art-empty">Your LinkedIn articles + a markdown blog land here. Send me the links and I'll wire up the cards.</div>
        </div>
      </section>

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
