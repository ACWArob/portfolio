import { useEffect } from 'react'

const REPO = 'https://github.com/correlllab/HAMS/tree/grasp-2method-comparison'

const STATS = [
  ['H1', 'humanoid platform'],
  ['2', 'grasp methods compared'],
  ['MuJoCo + Isaac', 'simulators bridged'],
  ['CPU-only', 'Apple-Silicon port'],
  ['ROS2', 'real-time control'],
]

const ArchDiagram = () => (
  <figure className="cs-fig cs-fig-svg">
    <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HAMS simulation architecture">
      <defs>
        <style>{`
          .box{fill:#12332E;stroke:#2E8B7F;stroke-width:2;rx:12}
          .lbl{fill:#EAF2EF;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px}
          .sub{fill:#9FB8B1;font-family:'JetBrains Mono',monospace;font-size:11px}
          .bus{fill:#2E8B7F}
          .buslbl{fill:#0F1211;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px}
          .link{stroke:#3d5b54;stroke-width:2}
        `}</style>
      </defs>
      <line className="link" x1="150" y1="118" x2="150" y2="150" />
      <line className="link" x1="380" y1="118" x2="380" y2="150" />
      <line className="link" x1="610" y1="118" x2="610" y2="150" />
      <line className="link" x1="380" y1="196" x2="380" y2="228" />
      <rect className="box" x="40" y="48" width="220" height="70" rx="12" />
      <text className="lbl" x="150" y="82" text-anchor="middle">MuJoCo / RoboCasa</text>
      <text className="sub" x="150" y="102" text-anchor="middle">physics + scene</text>
      <rect className="box" x="270" y="48" width="220" height="70" rx="12" />
      <text className="lbl" x="380" y="82" text-anchor="middle">Isaac Sim</text>
      <text className="sub" x="380" y="102" text-anchor="middle">high-fidelity render</text>
      <rect className="box" x="500" y="48" width="220" height="70" rx="12" />
      <text className="lbl" x="610" y="82" text-anchor="middle">ROS 2 control</text>
      <text className="sub" x="610" y="102" text-anchor="middle">IK · grasp · safety</text>
      <rect className="bus" x="120" y="150" width="520" height="46" rx="12" />
      <text className="buslbl" x="380" y="178" text-anchor="middle">CycloneDDS · one shared ROS domain</text>
      <rect x="300" y="228" width="160" height="48" rx="12" fill="#0F1211" stroke="#5FBFB0" stroke-width="2" />
      <text className="lbl" x="380" y="257" text-anchor="middle">Unitree H1</text>
    </svg>
    <figcaption>Three components (two simulators plus the ROS2 control stack) share one CycloneDDS domain and drive the same H1.</figcaption>
  </figure>
)

const CHAPTERS = [
  {
    n: '01', tag: 'Where I fit in', title: 'The sim side of a humanoid stack',
    body: "HAMS (Humanoid Agent Modular Stack) is the Correll Lab's platform for the Unitree H1: MuJoCo/RoboCasa and Isaac Sim bridged to a ROS2 control stack over one shared CycloneDDS domain. It is a team project. My part was the simulation side, getting the humanoid to run reliably in sim, comparing how it decides where to grasp, and hunting the bugs that only appear in real time.",
    learn: 'Know exactly which part of a big system is yours, and own it end to end.',
    svg: true,
  },
  {
    n: '02', tag: 'Running anywhere', title: 'Getting the humanoid off the GPU cluster',
    body: "The full stack assumed an NVIDIA workstation. I worked on a self-contained Apple-Silicon, CPU-only path so the humanoid sim runs on a laptop: MuJoCo rendering in software, ROS2 on FastDDS for arm64, and both the MuJoCo viewer and RViz streamed to a browser over noVNC. That turned 'you need the lab machine' into 'clone and run,' which meant I (and anyone else) could iterate on the sim without booking the cluster.",
    learn: 'Lowering the cost to run something is a force multiplier for everyone on the project.',
  },
  {
    n: '03', tag: 'Comparing grasps', title: 'Two ways to decide where to grab',
    body: "The core of my contribution was a head-to-head grasp-method comparison in sim. I put a geometric approach (PCA on the object's point cloud) against a learned cross-embodiment model (GraspGenX) under one protocol: same objects, same poses, same scoring. Holding everything constant except the planner is what makes the result mean something, rather than comparing two setups that happen to differ everywhere.",
    learn: 'A fair comparison needs one protocol. Hold everything constant except the thing you are testing.',
  },
  {
    n: '04', tag: 'Debugging real time', title: 'The bugs that only appear when the clock is running',
    body: "Most of the work was making it reliable. I traced dropped sensor data down to kernel UDP buffers and a single-core network interrupt (the robot's 500 Hz state stream was arriving at ~400 Hz with multi-second stalls). I chased a motor watchdog that dropped the H1 under a slow sim clock, and a pre-grasp motion-planning path that kept failing, which I routed around with direct servo control. None of these are logic bugs; they only show up once everything is running together in real time.",
    learn: 'In robotics, the interesting bugs live in timing, not logic.',
  },
  {
    n: '05', tag: 'What it enables', title: 'Test in sim, then trust the robot',
    body: "A humanoid sim that runs anywhere and behaves like the real robot means grasps and policies can be tried, compared, and debugged before they ever touch hardware. That is the point of the sim work: a fast, safe loop that feeds a humanoid manipulation paper in progress.",
    learn: 'Good simulation is not a demo, it is the fastest and safest way to iterate.',
  },
]

export default function HamsSimulation() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const io = new IntersectionObserver(en => en.forEach(x => x.isIntersecting && x.target.classList.add('in')), { threshold: .12 })
    document.querySelectorAll('.cs-chapter').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="cs">
      <nav className="cs-nav">
        <a className="cs-back" href="#projects">← Adam Abid</a>
        <a className="btn-solid" href={REPO} target="_blank" rel="noreferrer">View the code</a>
      </nav>

      <header className="cs-hero">
        <div className="cs-wrap">
          <div className="kicker">Robotics Research · Correll Lab · 2026</div>
          <h1 className="cs-title">Proving a Humanoid in Simulation</h1>
          <p className="cs-sub">My work on HAMS, the Correll Lab's humanoid stack: getting the H1 to run in sim anywhere, comparing grasp-planning methods head to head, and debugging the real-time issues that make it reliable.</p>
          <div className="cs-stats">
            {STATS.map(([v, l]) => (
              <div key={l} className="cs-stat"><b>{v}</b><span>{l}</span></div>
            ))}
          </div>
        </div>
      </header>

      <main className="cs-wrap cs-timeline">
        <div className="cs-line" />
        {CHAPTERS.map(c => (
          <article className="cs-chapter" key={c.n}>
            <div className="cs-dot" />
            <div className="cs-ch-meta"><span className="cs-ch-n">Chapter {c.n}</span><span className="cs-ch-date">{c.tag}</span></div>
            <h2 className="cs-ch-title">{c.title}</h2>
            <p className="cs-ch-body">{c.body}</p>
            {c.svg && <div className="cs-figs"><ArchDiagram /></div>}
            <p className="cs-learn"><span>What I learned</span>{c.learn}</p>
          </article>
        ))}
      </main>

      <footer className="cs-foot">
        <div className="cs-wrap">
          <h3>See the stack</h3>
          <p className="cs-foot-sub">The simulation, the grasp comparison, and the fixes live in the repo.</p>
          <div className="cs-foot-links">
            <a className="foot-btn" href={REPO} target="_blank" rel="noreferrer">github.com/correlllab/HAMS</a>
            <a className="foot-link" href="#projects">← Back to portfolio</a>
          </div>
          <div className="cs-built">Built with MuJoCo · RoboCasa · Isaac Sim · ROS2 · CycloneDDS · Docker</div>
          <div className="cs-built">Part of HAMS, the Correll Lab's humanoid stack (a team project). My work: simulation, grasp-method comparison, and real-time debugging. Mentor William Xie · PI Prof. Nikolaus Correll.</div>
        </div>
      </footer>
    </div>
  )
}
