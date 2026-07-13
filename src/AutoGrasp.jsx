import { useEffect } from 'react'

const B = 'https://raw.githubusercontent.com/ACWArob/magpie-vla/ros/docs/figures/'

const STATS = [
  ['97/100', 'picks'],
  ['75/75', 'rotated'],
  ['66.7/hr', 'episodes, unattended'],
  ['0', 'human labels'],
  ['1.5', 'GPU-hours to train'],
]

const CHAPTERS = [
  {
    n: '01', date: 'May 2026', tag: 'The foundation',
    title: 'Getting the whole robot into one loop',
    body: "I modernized a UR5e and our custom MAGPIE gripper onto ROS2: arm control, gripper driver, a wrist-mounted RealSense camera, and force-torque sensing, all driven from a single Jupyter loop. On top of it I built the perception stack: SAM3 segmentation (squeezed onto an 8GB RTX 2070 through a subprocess bridge), point clouds, and grasp-pose planning with NVIDIA's GraspGenX, where I contributed our gripper's embodiment.",
    learn: 'A research stack is only worth as much as how fast you can iterate on it. Getting everything into one loop paid off every day after.',
    figs: [{ src: 'sam3_wrist_overlay.png', cap: 'Live SAM3 segmentation from the wrist camera, 0.96 confidence.' }],
  },
  {
    n: '02', date: 'June 2026', tag: 'The robot that grades its own homework',
    title: 'AutoGrasp: self-supervised data collection',
    body: "I built AutoGrasp: a scripted expert that picks objects with force-adaptive grasping (DeliGrasp's VLM physics priors) and then judges each attempt itself. An episode only enters the training set if the object measurably stayed held and a vision-language judge scores the grasp at 0.6 or higher. The result: 66.7 clean training episodes per hour with zero human minutes. No teleoperation, no labeling.",
    learn: 'If the robot can grade its own work, data collection stops being the bottleneck.',
    figs: [],
  },
  {
    n: '03', date: 'Early July 2026', tag: 'The honest failure that taught the most',
    title: 'The policy that froze',
    body: "My first policy, 60 random-placement episodes trained into an ACT model in 62 minutes on an NSF supercomputer, could replay its own training data to 1.9mm accuracy, and then froze on rotated blocks in the real world. The forensics were brutal and clear: 71% of the training grasps were at a single angle. Imitation learning averages conflicting demonstrations into inaction. The model was never the problem. The data was.",
    learn: 'Debug the dataset before you blame the architecture.',
    figs: [{ src: 'v0/fig1_angle_collapse.png', cap: 'The smoking gun: the angle histogram that explained the freeze.' }],
  },
  {
    n: '04', date: 'July 8, 2026', tag: 'Designing data like an engineer',
    title: 'Rebuilding collection around the failure',
    body: "I rebuilt collection around exactly what I had measured. Instead of random placement, a 5x5 position grid crossed with 7 angles and jitter. Instead of a binary gripper action that literally could not express finger pre-positioning (over a third of every trajectory), a continuous aperture action space. Episodes now end at lift. 229 audited episodes in one afternoon, at 2.1x the old speed, before anything shipped to the cluster.",
    learn: 'Design your data like an experiment: cover the space, make every action expressible, and audit before you train.',
    figs: [{ src: 'appendix/offline_aperture_staircase.png', cap: 'The new continuous action space. The policy later reproduced this staircase on its own.' }],
  },
  {
    n: '05', date: 'July 13, 2026', tag: '97 out of 100',
    title: 'The number, and the three that failed',
    body: "The new policy was scored by a fully unattended instrument I built: the robot stages the block, the policy attempts the pick, an 8cm lift verifies the hold, every grasp is graded 0 to 1, and hardware faults are quarantined so they can never pollute the score. Final: 97/100 picks, including a perfect 75/75 on rotated blocks, the exact case the old policy failed. The 3 failures were all at 0 degrees, precisely where the dataset audit had warned: a label-aliasing bug I traced to a single mod-90 discontinuity in the angle code, measured (a 47-vs-15 episode bimodality), and patched against pre-registered success criteria.",
    learn: 'Measure everything, including your own success criteria, and pre-register them so a good number cannot fool you.',
    figs: [
      { src: 'v1_eval_heatmap.png', cap: '100 graded grasps, colour = grasp quality.' },
      { src: 'appendix/fig1_pipeline.png', cap: 'The full loop: collection, judging, training, and evaluation all share one grid protocol.' },
    ],
  },
  {
    n: '06', date: 'Ongoing', tag: 'Everything is measured',
    title: 'A project you can audit',
    body: "Every design decision in the pipeline, which detector, which grasp planner, which architecture, why no temporal ensembling, is documented with the number that decided it, chosen versus rejected. Right now: a workshop paper in preparation. Next: multi-object generalization and a continual-learning memory.",
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
        <a className="btn-solid" href="https://github.com/ACWArob/magpie-vla" target="_blank" rel="noreferrer">View the code</a>
      </nav>

      <header className="cs-hero">
        <div className="cs-wrap">
          <div className="kicker">Robotics Research · Correll Lab · 2026</div>
          <h1 className="cs-title">Teaching a Robot to Teach Itself</h1>
          <p className="cs-sub">From a ROS2 stack to a 97% grasp policy, with zero human labels.</p>
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
          <p className="cs-foot-sub">Every figure, protocol, and decision above lives in the repo.</p>
          <div className="cs-foot-links">
            <a className="foot-btn" href="https://github.com/ACWArob/magpie-vla" target="_blank" rel="noreferrer">github.com/ACWArob/magpie-vla</a>
            <a className="foot-link" href="#projects">← Back to portfolio</a>
          </div>
          <div className="cs-built">Built with UR5e · ROS2 · LeRobot · ACT · SAM3 · GraspGenX · NSF ACCESS (DeltaAI)</div>
        </div>
      </footer>
    </div>
  )
}
