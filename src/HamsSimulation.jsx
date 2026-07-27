import { useEffect } from 'react'

const B = 'https://raw.githubusercontent.com/correlllab/HAMS/b7574bb/portfolio_assets/'
const REPO = 'https://github.com/correlllab/HAMS/tree/grasp-2method-comparison'

const STATS = [
  ['4', 'grasp methods compared'],
  ['3', 'base conditions'],
  ['world-anchored', 'executor fix'],
  ['CPU-only', 'Apple-Silicon port'],
  ['H1', 'humanoid platform'],
]

const ArchDiagram = () => (
  <figure className="cs-fig cs-fig-svg">
    <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HAMS simulation architecture">
      <defs>
        <style>{`
          .box{fill:#12332E;stroke:#2E8B7F;stroke-width:2}
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
      <rect x="300" y="228" width="160" height="48" rx="12" fill="#0F1211" stroke="#5FBFB0" strokeWidth="2" />
      <text className="lbl" x="380" y="257" text-anchor="middle">Unitree H1</text>
    </svg>
    <figcaption>Two simulators plus the ROS2 control stack share one CycloneDDS domain and drive the same H1.</figcaption>
  </figure>
)

const Fig = ({ src, cap }) => {
  const hide = (e) => { const f = e.currentTarget.closest('.cs-fig'); if (f) f.style.display = 'none' }
  return (
    <figure className="cs-fig">
      <img src={B + src} alt={cap} loading="lazy" onError={hide} />
      <figcaption>{cap}</figcaption>
    </figure>
  )
}

const CHAPTERS = [
  {
    n: '01', tag: 'Where I fit in', title: 'The sim side of a humanoid stack',
    body: "HAMS (Humanoid Agent Modular Stack) is the Correll Lab's platform for the Unitree H1: MuJoCo/RoboCasa and Isaac Sim bridged to a ROS2 control stack over one shared CycloneDDS domain. It is a team project. My part was the simulation experiments: comparing how the robot decides where to grasp, and figuring out why a standing humanoid keeps dropping grasps that a bolted-down arm would make easily.",
    learn: 'Know exactly which part of a big system is yours, and own it end to end.',
    svg: true,
  },
  {
    n: '02', tag: 'Running anywhere', title: 'Getting the humanoid off the GPU cluster',
    body: "The full stack assumed an NVIDIA workstation. I worked on a self-contained Apple-Silicon, CPU-only path so the humanoid sim runs on a laptop: MuJoCo rendering in software, ROS2 on FastDDS for arm64, and both the MuJoCo viewer and RViz streamed to a browser over noVNC. That turned 'you need the lab machine' into 'clone and run,' so I could iterate on experiments without booking the cluster.",
    learn: 'Lowering the cost to run something is a force multiplier for everyone on the project.',
    figs: [{ src: 'grasp_headcam.jpg', cap: "Head-camera view: the H1 reaching for a fridge handle in the RoboCasa kitchen, running in the CPU-only sim." }],
  },
  {
    n: '03', tag: 'Comparing grasps', title: 'Which planner should decide the grasp?',
    body: "I put four grasp-planning methods head to head under one protocol: a centroid heuristic, PCA top-down, NVIDIA's GraspGenX, and a ranked-skill method. Same objects and scoring, but crossed with three base conditions: frozen (bolted down), hanging (tethered), and standing free. The geometric methods did fine with a frozen base and fell apart once the robot stood on its own; the ranked skill stayed the most robust across all three.",
    learn: 'A fair comparison needs one protocol. Here the base condition mattered as much as the planner itself.',
    figs: [{ src: 'fig1_three_tier.png', cap: 'Grasp success by method and base condition (frozen, hanging, standing), with Wilson 95% confidence intervals.' }],
  },
  {
    n: '04', tag: 'Debugging real time', title: 'Why a standing robot drops the grasp',
    body: "A standing humanoid sways, and the old executor planned the reach in the pelvis frame, so every wobble dragged the target off the object. On the standing tier most methods scored 0 out of 20. I re-anchored execution to the world frame, and success came back across the board (centroid jumped from 0 to 24 out of 30). The bug was never the grasp planner. It was the moving reference frame.",
    learn: 'In robotics the interesting bugs live in the reference frame and the clock, not the logic.',
    figs: [{ src: 'fig2_executor_ablation.png', cap: 'Standing-tier ablation: the old pelvis-frame executor (grey) vs my world-anchored executor (green).' }],
  },
  {
    n: '05', tag: 'Measuring the wobble', title: 'Proving it with posturography',
    body: "To show the effect was real and not luck, I ran a posturography battery on the standing tier: mean sway velocity, medial-lateral RMS, 95% sway-ellipse area, and minimum margin-of-stability, measured per grasp method and tagged by outcome (success, unstable, wander, fall). It turns 'this one feels more stable' into numbers, and it shows exactly which methods disturb balance enough to tip the robot over.",
    learn: 'If balance is the hidden variable, measure it directly instead of arguing about it.',
    figs: [{ src: 'fig7_sway_rainclouds.png', cap: 'Posturography battery: base-disturbance metrics per grasp method, coloured by outcome.' }],
  },
  {
    n: '06', tag: 'What it enables', title: 'Test in sim, then trust the robot',
    body: "A humanoid sim that runs anywhere and behaves like the real robot means grasps and controllers can be compared, debugged, and measured before they ever touch hardware. That is the point of the work: a fast, safe loop, and evidence (not vibes) for which method to put on the real H1. It feeds a humanoid manipulation paper in progress.",
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
          <p className="cs-sub">My work on HAMS, the Correll Lab's humanoid stack: comparing grasp-planning methods on the H1, and tracking down why a standing robot drops grasps that a bolted-down arm makes easily.</p>
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
            {c.figs && c.figs.length > 0 && (
              <div className="cs-figs">{c.figs.map(f => <Fig key={f.src} src={f.src} cap={f.cap} />)}</div>
            )}
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
