import { useEffect } from 'react'

const B = 'https://raw.githubusercontent.com/ACWArob/magpie_control_rosify/ros/docs/figures/'
const REPO = 'https://github.com/ACWArob/magpie_control_rosify/tree/ros'

const STATS = [
  ['97/100', 'picks (95% CI 91.5-99.0)'],
  ['75/75', 'rotated blocks'],
  ['67/hr', 'episodes, unattended'],
  ['0', 'human labels'],
  ['~1.5', 'GPU-hours to train'],
]

const CHAPTERS = [
  {
    n: '01', date: 'May 2026', tag: 'The foundation',
    title: 'Getting the whole robot into one loop',
    body: "I brought a UR5e and our custom MAGPIE gripper up on ROS2: arm control, gripper driver, a wrist-mounted RealSense camera, and force sensing, all driven from a single Jupyter loop. On top of it I built the perception stack: SAM3 segmentation (squeezed onto an 8GB RTX 2070 through a subprocess bridge), point clouds, and grasp-pose planning that runs PCA and NVIDIA's GraspGenX in parallel, with a deterministic flat-face angle contract having the final word.",
    learn: 'A research stack is only worth as much as how fast you can iterate on it. Getting everything into one loop paid off every day after.',
    figs: [{ src: 'sam3_wrist_overlay.png', cap: 'Live SAM3 segmentation from the wrist camera, 0.96 confidence.' }],
  },
  {
    n: '02', date: 'June 2026', tag: 'The robot that grades its own homework',
    title: 'AutoGrasp: self-supervised data collection',
    body: "I built AutoGrasp: a scripted expert that detects an object with Gemini + SAM3, grasps it with force-adaptive control (DeliGrasp), then judges each attempt itself. An episode only enters the training set if the object measurably stayed held and a vision-language judge scores the grasp at 0.6 or higher. The result: about 67 clean training episodes per hour with zero human minutes. No teleoperation, no labeling.",
    learn: 'If the robot can grade its own work, data collection stops being the bottleneck.',
    figs: [{ src: 'appendix/fig1_pipeline.png', cap: 'The full self-generating loop: detect, angle, grasp, judge. Collection, training, and evaluation all share one grid protocol.' }],
  },
  {
    n: '03', date: 'Early July 2026', tag: 'The honest failure that taught the most',
    title: 'The policy that froze',
    body: "My first policy, 60 random-placement episodes trained into an ACT model (51.6M params) in 62 minutes on one GH200, could replay its own training data to 1.9mm accuracy, and then froze on rotated blocks in the real world. The forensics were brutal and clear: 71% of the training grasps executed at a single angle. Imitation learning averages conflicting demonstrations into inaction. The model was never the problem. The data was.",
    learn: 'Debug the dataset before you blame the architecture.',
    figs: [{ src: 'v0/fig1_angle_collapse.png', cap: 'The smoking gun: the angle histogram that explained the freeze.' }],
  },
  {
    n: '04', date: 'July 8, 2026', tag: 'Designing data like an engineer',
    title: 'Rebuilding collection around the failure',
    body: "I rebuilt collection around exactly what I had measured. Instead of random placement, a systematic 5x5 position grid crossed with 7 angles. Instead of a binary gripper action that could not express finger pre-positioning, a continuous aperture-in-millimeters action space. Every early failure mapped to a specific fix. 229 audited episodes, before anything shipped to the cluster.",
    learn: 'Design your data like an experiment: cover the space, make every action expressible, and audit before you train.',
    figs: [{ src: 'appendix/offline_aperture_staircase.png', cap: 'The new continuous action space. The policy later reproduced this staircase on its own.' }],
  },
  {
    n: '05', date: 'July 13, 2026', tag: '97 out of 100',
    title: 'The number, and where it wobbles',
    body: "The new policy was scored by a fully unattended instrument I built: the robot stages the block, the policy attempts the pick, a lift verifies the hold, every grasp is graded 0 to 1, and an algorithmic gate has the final say. Final: 97/100 picks (95% CI 91.5-99.0), including a perfect 75/75 on rotated blocks, the exact case the old policy froze on. The soft spot was a small fall-off at 0 degrees (22/25), where the policy still confuses 0 and 90.",
    learn: 'Measure everything, including your own success criteria, and pre-register them so a good number cannot fool you.',
    figs: [
      { src: 'v1_eval_heatmap.png', cap: '100 graded grasps across the 5x5 workspace and 4 block angles, colour = quality.' },
      { src: 'v1_eval_summary.png', cap: 'Per-angle breakdown: 25/25 at 25, 45, and 70 degrees; the only dip is at 0.' },
    ],
  },
  {
    n: '06', date: 'July 2026', tag: 'The extra testing',
    title: 'Where it works, and where it stops',
    body: "97/100 is only honest if you also say where it breaks. So I tested the edge: I moved the block one grid step (3 cm) past the trained zone, into never-seen territory. Inside the grid the policy holds 97%. One step outside, it collapses to 8/96. The policy interpolates cleanly within its data and does not extrapolate. That is not a bug to hide, it is the boundary of the data, measured, and it tells you exactly where the next episodes need to go.",
    learn: 'A great in-distribution number can hide a hard edge. Find the cliff on purpose.',
    figs: [{ src: 'v1_ood_ring_heatmap.png', cap: 'The trained zone (97%) and the ring one step outside it (8%): a hard extrapolation cliff.' }],
  },
  {
    n: '07', date: 'Ongoing', tag: 'Everything is measured',
    title: 'A project you can audit',
    body: "Every design decision, which detector, which grasp planner, which architecture, why no temporal ensembling, is documented with the number that decided it, chosen versus rejected. Next: drop the absolute (x, y) input so the policy leans fully on vision, add more objects and placing (not just grasping), and run simulation and real-time training in parallel toward a robot that keeps improving on its own.",
    learn: "Every decision should carry the number that made it. That is the difference between a demo and a result.",
    figs: [{ src: 'appendix/gate_scoreboard.png', cap: 'The decision scoreboard: every fork in the project, quantified.' }],
  },
]

const Fig = ({ src, cap }) => {
  const hide = (e) => { const f = e.currentTarget.closest('.cs-fig'); if (f) f.style.display = 'none' }
  return (
    <figure className="cs-fig">
      <img src={B + src} alt={cap} loading="lazy" onError={hide} />
      <figcaption>{cap}</figcaption>
    </figure>
  )
}

export default function AutoGrasp() {
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
          <div className="kicker">SPUR Final Project · Correll Lab · 2026</div>
          <h1 className="cs-title">Teaching a Robot to Teach Itself</h1>
          <p className="cs-sub">A UR5e that collects and grades its own training data, from a ROS2 stack to a 97% grasp policy with zero human labels.</p>
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
            <div className="cs-ch-meta"><span className="cs-ch-n">Chapter {c.n}</span><span className="cs-ch-date">{c.date}</span></div>
            <div className="cs-ch-tag">{c.tag}</div>
            <h2 className="cs-ch-title">{c.title}</h2>
            <p className="cs-ch-body">{c.body}</p>
            {c.figs.length > 0 && (
              <div className={'cs-figs' + (c.figs.length > 1 ? ' two' : '')}>
                {c.figs.map(f => <Fig key={f.src} src={f.src} cap={f.cap} />)}
              </div>
            )}
            <p className="cs-learn"><span>What I learned</span>{c.learn}</p>
          </article>
        ))}
      </main>

      <footer className="cs-foot">
        <div className="cs-wrap">
          <h3>Want the full engineering log?</h3>
          <p className="cs-foot-sub">Every figure, protocol, ablation, and decision above lives in the repo.</p>
          <div className="cs-foot-links">
            <a className="foot-btn" href={REPO} target="_blank" rel="noreferrer">github.com/ACWArob/magpie_control_rosify</a>
            <a className="foot-link" href="#projects">← Back to portfolio</a>
          </div>
          <div className="cs-built">Built with UR5e · ROS2 · LeRobot · ACT · SAM3 · GraspGenX · Gemini · NSF ACCESS (DeltaAI)</div>
          <div className="cs-built">SPUR final project · Correll Lab · mentored by William Xie · PI Prof. Nikolaus Correll</div>
        </div>
      </footer>
    </div>
  )
}
