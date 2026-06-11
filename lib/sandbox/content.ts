export const SANDBOX_LANDINGS = [
  {
    slug: "on-my-way",
    title: "On My Way",
    subtitle: "The Action Layer",
    description:
      "The platform that makes implementation visible — post action items, track commitments, connect actors to opportunities and funding.",
    accent: "var(--brand-orange)",
    dates: "Partnership · Youth COP 2026",
  },
  {
    slug: "z-cop",
    title: "Z-COP",
    subtitle: "Youth Policy Implementation Summit",
    description:
      "A five-day annual summit to assess needs, design implementation paths, and demonstrate what results-first development gatherings can generate.",
    accent: "var(--brand-blue)",
    dates: "August 30 – September 3, 2026",
  },
] as const;

export const OMW_PIPELINE = [
  {
    step: "01",
    name: "The Global Call",
    role: "The Network",
    accent: "var(--brand-blue)",
    description:
      "A youth mobilisation network active in 170+ countries. Identifies local priorities, connects civic actors, and drives change agendas at every level.",
  },
  {
    step: "02",
    name: "MESA Institute",
    role: "Strategic Partner — The Policy Bridge",
    accent: "var(--brand-green)",
    description:
      "An independent think tank — the table for the next generation. MESA bridges the generational divide between youth and the institutions shaping their future, turning the priorities surfaced by The Global Call into rigorous, adoptable policy across pillars like Planetary Resilience.",
  },
  {
    step: "03",
    name: "On My Way",
    role: "The Action Layer",
    accent: "var(--brand-orange)",
    description:
      "Makes implementation visible. Post action items, track commitments, connect actors to opportunities and funding. What gets posted, gets done.",
  },
] as const;

export const OMW_PARTNERSHIP_AXES = [
  {
    title: "Mapping local priorities",
    platform: "On My Way",
    description:
      "Identify 2–3 urgent local priorities for youth and community development — employment, mental health, education, housing, or civic participation — integrated into the Global Call pipeline and translated into policy and action.",
  },
  {
    title: "Connecting the local ecosystem",
    platform: "The Global Call",
    description:
      "Map youth organisations, associations, and civic actors in your area at no cost. Connect your city or country to a 170+ country network of civic action.",
  },
  {
    title: "Youth COP participation",
    platform: "All three",
    description:
      "Represent your organisation by animating a local hub, sending representatives to plenary sessions, or both. Local insights feed in real time into the global event agenda.",
  },
  {
    title: "Policy partnership",
    platform: "MESA Institute",
    description:
      "Our partner think tank MESA convenes fellows and experts to turn the priorities submitted by your organisation into rigorous, institution-ready policy proposals that inform programmes on On My Way.",
  },
] as const;

export const OMW_TIMELINE = [
  {
    period: "May – June 2026",
    detail:
      "Partner onboarding · mapping tools · local priorities · youth centre survey · government stakeholders identified",
  },
  {
    period: "June – July 2026",
    detail:
      "Submission of mappings · MESA analyses · first programmes activated on On My Way · COP session preparation",
  },
  {
    period: "June 30 – July 2",
    detail:
      "Global Shapers Annual Summit · mapping results presentation · hub role definition for COP",
  },
  {
    period: "Aug 30 – Sept 3",
    detail:
      "Youth COP · local hub animation · insight collection · national agendas · global network connection",
  },
  {
    period: "September 2026+",
    detail:
      "Programme deployment · commitment tracking · coordinator network consolidation · pilot hub recognition",
  },
] as const;

export const OMW_ASK_OFFER = {
  ask: [
    "Identify 2–3 local priorities to integrate into our pipeline",
    "Designate a focal point for coordination within your organisation",
    "Mobilise your local network to connect civic actors to the platform",
    "Participate in the Youth COP (Aug 30 – Sept 3, 2026)",
    "Share your local knowledge and stakeholder relationships",
  ],
  offer: [
    "On My Way platform — free access for your hub and local network",
    "The Global Call — mapping of local civic actors and connection to 170+ countries",
    "MESA Institute (partner think tank) — youth priorities turned into institution-ready policy proposals",
    "Official role as COP 2026 Local Coordinator with international visibility",
    "Full toolkit: mapping forms, facilitation guides, tracking spreadsheets",
    "No financial contribution required",
  ],
} as const;

export const ZCOP_PROBLEMS = [
  "Institutions fail to deliver",
  "Talent is misallocated and pressured by AI",
  "Geopolitical and climate crises are amplified",
] as const;

export const ZCOP_SOLUTIONS = [
  "Creating an autonomous system of action",
  "Supporting policymaking from ideation to execution",
  "Inspiring opportunities for the next generation — monitored, customisable, adaptable",
] as const;

export const ZCOP_GOALS = {
  preEvent: [
    "Set 3 government priorities",
    "Onboard +100 national impact organisations across 10 national points",
    "Engage on 1 foresight strategy for each government",
  ],
  event: [
    "Distribute programming",
    "Define long-term civil society roles",
    "Plan social cohesion R&D blueprint",
  ],
  general: [
    "Trusted, reliable institutions",
    "Inspiring, empowered individuals",
    "Thriving societies",
  ],
} as const;

export const ZCOP_OUTPUTS = [
  {
    title: "National action page",
    description:
      "Three national priorities, each supported by at least three programmes, publicly visible on On My Way and aligned to the SDGs. A live, trackable commitment structure — not a declaration.",
  },
  {
    title: "Government engagement plan",
    description:
      "Proposals mapped by institutional level. Named decision-makers, leverage points, and open requests governments can respond to directly on the platform.",
  },
  {
    title: "21-day activation + 1-year programme",
    description:
      "A specific, named, verifiable activation item launched at Day 4 closing plenary. At least three priorities with three programmes each, aligned to sustainable development goals.",
  },
  {
    title: "Peer partnership request",
    description:
      "A joint deliverable logged on the platform with a matched peer country. Due within 10 days of COP closing. Visible to all delegations.",
  },
  {
    title: "Monitoring commitments",
    description:
      "Trackable throughout the year alongside leadership scaling and hub developments. Linked to SDG indicators where applicable.",
  },
] as const;

export const ZCOP_PREP_PHASES = [
  {
    phase: "3 months before (~June 2026)",
    detail:
      "Global Call asks distributed. Insight survey open. Focal points confirmed. Initial government contacts identified.",
  },
  {
    phase: "2 months before (~July 2026)",
    detail:
      "Organisation mapping complete on On My Way. National priority shortlist drafted. MESA fellows organise pre-thinking on national agendas.",
  },
  {
    phase: "1 month before (~August 2026)",
    detail:
      "On My Way accounts activated. Multilateral engagement levels mapped. Hub participants briefed. Government focal contacts confirmed.",
  },
  {
    phase: "2 weeks before (~Aug 17)",
    detail:
      "All accounts active and tested. Peer delegations' provisional maps visible. MESA fellows complete national agenda pre-thinking.",
  },
  {
    phase: "Day before (Aug 29)",
    detail:
      "All pre-submitted insights reviewed. Hub logistics confirmed. Day 0 agenda confirmed with all participants.",
  },
] as const;

export const ZCOP_DAILY_THEMES = [
  {
    day: "Day 0 · Aug 30",
    theme: "Setting the Stage",
    accent: "var(--text-muted)",
    scale: "Landscape review",
    focus:
      "Review of all pre-submitted insights. Platform and pipeline orientation. Mapping of national programmes across all four theme areas.",
  },
  {
    day: "Day 1 · Aug 31",
    theme: "Self",
    accent: "var(--theme-self)",
    scale: "Individual · Family · Immediate relationships",
    focus:
      "What at the individual level prevents young people from acting on sustainable development challenges? What programmes build agency toward SDG-relevant action?",
  },
  {
    day: "Day 2 · Sept 1",
    theme: "Community",
    accent: "var(--theme-community)",
    scale: "Neighbourhood · Local group · Youth council",
    focus:
      "What at the collective level prevents communities from organising around sustainable development priorities? What programmes strengthen community-level mobilisation?",
  },
  {
    day: "Day 3 · Sept 2",
    theme: "Institutions",
    accent: "var(--theme-institutions)",
    scale: "Schools · Local government · Ministries · NGOs",
    focus:
      "What at the institutional level blocks youth from influencing sustainable development decisions? What programmes shift institutional behaviour toward SDG-aligned outcomes?",
  },
  {
    day: "Day 4 · Sept 3",
    theme: "Systems",
    accent: "var(--theme-systems)",
    scale: "National policy · Economic structures · Global cooperation",
    focus:
      "What structural conditions prevent lasting change? How do programme portfolios built across Days 1–3 form a coherent national response — and survive a change of government?",
  },
] as const;

export const ZCOP_DAILY_CYCLE = [
  { time: "Previous evening", session: "Mapping Workshop", note: "Org leaders map tomorrow's theme. Provisional map posted to On My Way." },
  { time: "Morning 1", session: "Pipeline Review", note: "Review all platform posts. Confirm stakeholder tasks. Tech onboarding." },
  { time: "Morning 2", session: "Global Call Insights", note: "Theme introduction using insights. Flag proposals for MESA and On My Way." },
  { time: "Morning 3", session: "Physical Activity", note: "Learning by doing — practice activities from previous day's theme." },
  { time: "Morning 4", session: "Activity Feedback", note: "Debrief physical session. Brainstorm new programme concepts." },
  { time: "Lunch", session: "Output Drafting", note: "Platform check. Output packages drafted. Partner identification." },
  { time: "After lunch", session: "Mentoring Circles", note: "Peer-led small groups on today's theme implementation challenges." },
  { time: "Afternoon", session: "Programme Definition", note: "Each hub posts at least one action item as an open request." },
  { time: "Early evening", session: "Reflection & Media", note: "Joyful processing. Media team captures testimonies and content." },
  { time: "Evening", session: "Programme Finalisation", note: "All entries complete on On My Way. Tomorrow's provisional map posted." },
] as const;

export const SANDBOX_CONTACT = {
  email: "contact@example.com",
  website: "example.org",
  leads: [
    { name: "Program Lead", role: "Founder — On My Way & The Global Call", email: "lead@example.com" },
    { name: "Institute Director", role: "Executive Director — MESA Institute", email: "director@example.com" },
  ],
} as const;

export const OMW_STORY_BEATS = [
  {
    id: "signal",
    chapter: "01 · The signal",
    headline: "Local actors already know what their communities need.",
    body: "Youth organisations, civic hubs, diaspora networks, diplomatic missions — they hold the relationships and the intelligence. The energy is there. What is missing is the pipe.",
    stat: { value: "170+", label: "countries with latent civic signal" },
    accent: "var(--brand-blue)",
  },
  {
    id: "gap",
    chapter: "02 · The gap",
    headline: "Three breaks stop change before it scales.",
    body: "Intelligence never reaches institutions. Policy never reaches communities. Commitments are made — then forgotten. Each break is a silent veto on implementation.",
    stat: { value: "3", label: "critical disconnects in the chain" },
    accent: "var(--brand-pink)",
  },
  {
    id: "loop",
    chapter: "03 · The loop",
    headline: "Mobilise. Analyse. Implement. Feedback. Refine.",
    body: "The Global Call gathers the signal. Our partner MESA Institute — the table for the next generation — translates it into policy language institutions can adopt. On My Way makes every commitment visible — and therefore real.",
    stat: { value: "5", label: "steps in the coordination loop" },
    accent: "var(--brand-green)",
  },
  {
    id: "proof",
    chapter: "04 · The proof",
    headline: "What gets posted, gets done.",
    body: "On My Way is not a dashboard for aspiration. It is the public record of implementation — action items, open requests, named decision-makers, tracked outcomes.",
    stat: { value: "100%", label: "accountability when it's on-platform" },
    accent: "var(--brand-orange)",
  },
] as const;

export const OMW_GAP_STATS = [
  { label: "Intelligence lost", value: 68, unit: "%", narrative: "of local insights never reach institutional decision-makers" },
  { label: "Policy stranded", value: 54, unit: "%", narrative: "of youth policy proposals lack a delivery pathway" },
  { label: "Commitments untracked", value: 81, unit: "%", narrative: "of multilateral pledges have no public monitoring layer" },
] as const;

export const ZCOP_STORY_BEATS = [
  {
    id: "crisis",
    chapter: "01 · The fracture",
    headline: "Institutions promise. Delivery stalls. Talent drifts.",
    body: "Geopolitical pressure, AI disruption, and climate urgency amplify a deeper failure: the gap between what is declared and what is implemented — especially for youth.",
    stat: { value: "3", label: "systemic fractures we address" },
    accent: "var(--brand-pink)",
  },
  {
    id: "summit",
    chapter: "02 · The summit",
    headline: "Five days. One pipeline. National hubs, global amplification.",
    body: "Z-COP is not a conference of speeches. It is a working summit where local coordinators animate hubs, post outputs in real time, and build a national portfolio of trackable programmes.",
    stat: { value: "5", label: "days of cumulative implementation work" },
    accent: "var(--brand-blue)",
  },
  {
    id: "arc",
    chapter: "03 · The arc",
    headline: "Self → Community → Institutions → Systems.",
    body: "Each day climbs one scale of change. The themes are not independent — they accumulate. By Day 4, hubs hold a coherent national response aligned to the SDGs.",
    stat: { value: "4", label: "scales in one implementation arc" },
    accent: "var(--brand-green)",
  },
  {
    id: "record",
    chapter: "04 · The record",
    headline: "If it is not on On My Way, it did not happen.",
    body: "Every output — national action page, government engagement plan, 21-day activation, peer partnership — is a posted, public, trackable entry. The platform is the accountability layer.",
    stat: { value: "10", label: "sessions per day, one rhythm" },
    accent: "var(--brand-orange)",
  },
] as const;

export const ZCOP_IMPACT_METRICS = [
  { label: "National priorities", value: 3, suffix: "", detail: "per country, each with 3+ programmes" },
  { label: "Impact organisations", value: 100, suffix: "+", detail: "onboarded pre-event across 10 national points" },
  { label: "Activation window", value: 21, suffix: " days", detail: "immediate verifiable launch at Day 4 plenary" },
  { label: "Peer partnerships", value: 10, suffix: " days", detail: "to deliver joint cross-country deliverables" },
] as const;

export const ZCOP_PREP_FUNNEL = [
  { phase: "T-90", label: "Survey live", progress: 20 },
  { phase: "T-60", label: "Mapping complete", progress: 40 },
  { phase: "T-30", label: "Accounts active", progress: 65 },
  { phase: "T-14", label: "Maps visible", progress: 85 },
  { phase: "T-1", label: "Hubs ready", progress: 100 },
] as const;
