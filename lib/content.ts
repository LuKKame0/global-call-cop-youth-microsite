import type {
  ExampleFramework,
  FaqItem,
  FrameworkGuide,
  ProcessStage,
  StepDefinition,
  StoryBeat,
  StoryMetric,
  ThemeDefinition,
} from "@/types/submission";

export const APP_NAME = "COP - Youth Policy Implementation";
export const APP_VERSION = "mvp-v1";
export const FORM_DRAFT_KEY = "cop-youth-policy-implementation-draft:v1";

export const STEP_DEFINITIONS: readonly StepDefinition[] = [
  {
    id: "intro",
    label: "Intro + Basic Info",
    eyebrow: "National focal point",
    description:
      "Anchor the submission with country context, youth structure, and the respondent who will receive confirmation.",
  },
  {
    id: "self",
    label: "Self",
    eyebrow: "Theme 1",
    description:
      "Name the barrier, the civic identity shift required, and the resilience conditions young people need to act.",
  },
  {
    id: "community",
    label: "Community",
    eyebrow: "Theme 2",
    description:
      "Describe the collective layer: who mobilises, what is co-designed, and how peer learning moves across communities.",
  },
  {
    id: "institutions",
    label: "Institutions",
    eyebrow: "Theme 3",
    description:
      "Translate youth priorities into named institutional asks, sectoral entry points, and global collaboration links.",
  },
  {
    id: "systems",
    label: "Systems",
    eyebrow: "Theme 4",
    description:
      "Capture the systemic reform, the cultural shift, and the infrastructure needed to make implementation durable.",
  },
  {
    id: "review",
    label: "Review + Submit",
    eyebrow: "Final check",
    description:
      "Review the full framework before publishing it to the COP implementation pipeline and the Google Sheets register.",
  },
] as const;

export const THEME_DEFINITIONS: readonly ThemeDefinition[] = [
  {
    key: "self",
    number: 1,
    shortLabel: "Self",
    title: "Courage & Agency",
    fullLabel: "Self - Courage & Agency",
    accentToken: "var(--theme-self)",
    tagline:
      "Change starts with individuals. The first barrier is often believing we can act.",
    scale:
      "Scale: the individual, family, immediate relationships, and formal youth leadership roles where they exist.",
    actionHint:
      "Be concrete: name the barrier, the leadership shift, and the first condition that unlocks agency.",
    expandedBody: [
      "The Self layer exists because implementation rarely begins with a ministry memo. It begins when a young person decides that action is possible, legitimate, and worth the emotional cost of trying.",
      "For many countries, the first break in the system is not policy design but confidence: cynicism, fatigue, economic pressure, and the feeling that youth voice changes nothing. A strong submission names that barrier honestly.",
      "This layer should also identify what actually builds agency in context: mentoring, civic roles, peer validation, mental-health support, visible examples of change, or formal youth mandates that feel real.",
    ],
    fields: [
      {
        key: "personal_barriers",
        label: "Courage & personal barriers",
        placeholder:
          "What stops young people from believing they can act? What builds courage and initiative?",
        helper:
          "Identify the main emotional, social, or economic barrier and the specific condition that starts to change it.",
        tags: ["self", "courage", "agency", "barriers"],
      },
      {
        key: "leadership_identity",
        label: "Leadership & civic identity",
        placeholder:
          "What does leadership look like - informal or formal? How do youth see themselves as agents of change?",
        helper:
          "Point to the roles, behaviours, or pathways that turn participation into visible youth leadership.",
        tags: ["self", "leadership", "civic-identity"],
      },
      {
        key: "challenges_resilience",
        label: "Personal challenges & resilience",
        placeholder:
          "What individual challenges do young people face - mental health, economic pressure, disillusionment?",
        helper:
          "Describe the pressure points clearly and note the resilience support or ecosystem response that is missing.",
        tags: ["self", "resilience", "mental-health", "economic-pressure"],
      },
    ],
  },
  {
    key: "community",
    number: 2,
    shortLabel: "Community",
    title: "Collective Action",
    fullLabel: "Community - Collective Action",
    accentToken: "var(--theme-community)",
    tagline:
      "Ideas grow when people organise. Change becomes real when people act together.",
    scale:
      "Scale: family, neighbourhood, local group, youth council, community network - formal or informal.",
    actionHint:
      "Surface the collective mechanism, the co-designed initiative, and the peer network that could move within 10 days.",
    expandedBody: [
      "Community is where individual intention becomes durable action. This layer asks whether youth energy can assemble itself into teams, councils, neighbourhood groups, or peer networks that actually move things forward.",
      "The submission should clarify how collective action currently works, where it gets blocked, and which local initiative already shows the possibility of co-design rather than symbolic consultation.",
      "It is also the place to show whether peer infrastructure exists. If lessons cannot travel across communities, even strong local practice remains isolated and fragile.",
    ],
    fields: [
      {
        key: "team_mobilising",
        label: "Building teams & mobilising",
        placeholder:
          "How are young people organising? What enables or blocks collective action in your context?",
        helper:
          "Name the structure or informal network that mobilises people, plus the real bottleneck to collective action.",
        tags: ["community", "mobilising", "teams", "collective-action"],
      },
      {
        key: "local_codesign",
        label: "Local initiatives & co-design",
        placeholder:
          "What community-level programs are youth building or co-designing?",
        helper:
          "Describe the actual initiative, who co-designs it, and how youth decision-making shows up in practice.",
        tags: ["community", "codesign", "local-initiatives"],
      },
      {
        key: "knowledge_sharing",
        label: "Knowledge-sharing across communities",
        placeholder:
          "How do youth groups exchange learnings? What peer networks exist or are needed?",
        helper:
          "Show how insight travels today and what peer infrastructure is needed for repeatable learning.",
        tags: ["community", "knowledge-sharing", "peer-networks"],
      },
    ],
  },
  {
    key: "institutions",
    number: 3,
    shortLabel: "Institutions",
    title: "Working with Systems",
    fullLabel: "Institutions - Working with Systems",
    accentToken: "var(--theme-institutions)",
    tagline:
      "To scale impact, youth must understand how institutions work - and how to change them.",
    scale:
      "Scale: schools, local government, ministries, NGOs, companies, and UN bodies.",
    actionHint:
      "Name the institutional ask, the decision-maker or leverage point, and the global link that could strengthen the request.",
    expandedBody: [
      "Institutions are where community legitimacy meets formal power. This layer is not about abstract advocacy language; it is about naming the actor, the leverage point, and the action that would change implementation conditions.",
      "The strongest responses identify where youth already has a foothold, where the door is still closed, and which sectoral ask is realistic enough to pursue without flattening political reality.",
      "This is also where national work begins to connect upward: UN Youth channels, regional bodies, and shared networks become useful only when they strengthen a concrete institutional ask rather than replace it.",
    ],
    fields: [
      {
        key: "education_local_government",
        label: "Education & local government",
        placeholder:
          "What are your key asks to schools, municipalities, or local youth councils?",
        helper:
          "Write the clearest ask you can: who needs to act, what should shift, and why that lever matters.",
        tags: ["institutions", "education", "local-government"],
      },
      {
        key: "sector_engagement",
        label: "National & sectoral engagement",
        placeholder:
          "How does youth engage with ministries, NGOs on climate, health, employment, agriculture?",
        helper:
          "Describe the current institutional relationship, the sectoral gap, and where real leverage exists.",
        tags: ["institutions", "sectors", "ministries", "engagement"],
      },
      {
        key: "global_branch",
        label: "Global collaborative branch",
        placeholder:
          "How does your country connect to UN Youth, regional bodies, The Global Call network?",
        helper:
          "Reference the global platform, regional body, or UN-linked mechanism that can extend the national ask upward.",
        tags: ["institutions", "global-branch", "un-youth", "network"],
      },
    ],
  },
  {
    key: "systems",
    number: 4,
    shortLabel: "Systems",
    title: "Transforming Society",
    fullLabel: "Systems - Transforming Society",
    accentToken: "var(--theme-systems)",
    tagline:
      "Real transformation happens when structures evolve. The ultimate goal is systemic change.",
    scale:
      "Scale: economic systems, national policy, cultural narratives, and global cooperation.",
    actionHint:
      "State the structural reform, the monitoring logic, and the infrastructure or cooperation needed to make it stick.",
    expandedBody: [
      "Systems is the layer that asks what would still matter after the conference closes, leadership rotates, or a short funding cycle ends. It is about structural durability, not just momentum.",
      "A strong systems response identifies the reform, cultural shift, or infrastructure change that would alter conditions for young people at scale, and it explains why that change is bigger than a single programme.",
      "This layer is also where monitoring and shared digital infrastructure become essential. If implementation cannot be tracked, compared, and revisited, systemic change stays rhetorical.",
    ],
    fields: [
      {
        key: "policy_transformation",
        label: "Economic & policy transformation",
        placeholder:
          "What reforms would transform conditions for young people - jobs, housing, climate, migration?",
        helper:
          "Focus on the reform that would most shift national conditions and explain what it unlocks.",
        tags: ["systems", "policy", "economy", "transformation"],
      },
      {
        key: "cultural_narratives",
        label: "Cultural narratives & participation",
        placeholder:
          "What cultural shifts are needed - cynicism, apathy, representation? What seats do youth need?",
        helper:
          "Describe the narrative barrier, the participation gap, and the formal seat or accountability mechanism youth need.",
        tags: ["systems", "culture", "participation", "representation"],
      },
      {
        key: "digital_infrastructure",
        label: "Global cooperation & digital infrastructure",
        placeholder:
          "What international coordination or digital tools would enable lasting systemic change?",
        helper:
          "Name the shared platform, data flow, or coordination mechanism that would make implementation visible and durable.",
        tags: ["systems", "digital", "global-cooperation", "infrastructure"],
      },
    ],
  },
] as const;

export const PROCESS_STAGES: readonly ProcessStage[] = [
  {
    id: "map",
    title: "Map the national reality",
    detail:
      "The wizard starts with local barriers, community structures, institutional asks, and the systemic shift each focal point can actually describe with confidence.",
  },
  {
    id: "shape",
    title: "Shape action-ready inputs",
    detail:
      "Every step pushes toward concrete language: named actors, leverage points, monitoring logic, and the first visible implementation move.",
  },
  {
    id: "publish",
    title: "Publish to the COP pipeline",
    detail:
      "A validated submission becomes a normalized JSON record, a flat sheet row for operations, and RAG chunks for downstream synthesis.",
  },
  {
    id: "activate",
    title: "Keep implementation visible",
    detail:
      "The output is built for practical follow-up: regional aggregation, policy review, and later integration into broader implementation reporting.",
  },
] as const;

export const LANDING_STORY_BEATS: readonly StoryBeat[] = [
  {
    id: "why-now",
    eyebrow: "Why now",
    title: "Declarations are not enough anymore",
    detail:
      "The COP needs country inputs that move past aspiration and into implementation language: named barriers, specific asks, shared infrastructure, and the first visible action after the conference cycle.",
    accentToken: "var(--theme-self)",
    expandedBody: [
      "The moment calls for submissions that can survive operational scrutiny. Many youth-policy spaces are rich in aspiration but too light in implementation detail to guide real coordination.",
      "Why now means asking for signals that can travel: named barriers, practical asks, and structured evidence of where youth implementation is already moving or still blocked.",
      "This is the difference between a compelling statement and an implementation framework that can support follow-up across countries and institutions.",
    ],
  },
  {
    id: "national-voice",
    eyebrow: "National voice",
    title: "Each submission should sound like a real country context",
    detail:
      "This is not a generic survey. It is a national focal-point tool designed to capture how youth policy implementation actually feels on the ground, from local confidence to institutional leverage.",
    accentToken: "var(--theme-community)",
    expandedBody: [
      "National voice matters because comparability should never erase context. A strong framework still sounds like the country that produced it: its institutions, youth structures, barriers, and political texture remain visible.",
      "The platform is structured enough to support synthesis, but it is built to preserve the lived logic of each country rather than force everything into generic language too early.",
      "That balance is why the prompts move gradually from individual conditions into community, institutions, and systems instead of starting with abstract policy statements.",
    ],
  },
  {
    id: "multilateral-readiness",
    eyebrow: "Multilateral readiness",
    title: "Structured enough for synthesis, human enough for policy",
    detail:
      "The system turns each framework into normalized records, flat operational rows, and chunked thematic outputs so the same response can support both coordination and later multilateral analysis.",
    accentToken: "var(--theme-systems)",
    expandedBody: [
      "Multilateral readiness is not just about diplomatic tone. It is about whether a country response can be transformed into formats that multiple audiences can actually use.",
      "Operational teams need clear rows and statuses. Reviewers need coherent country narratives. Synthesis and later RAG workflows need well-bounded thematic chunks. The platform is built to serve all three without requiring respondents to submit three times.",
      "That is why the same framework becomes a nested JSON record, a flat submission row, and chunked thematic entries immediately after validation.",
    ],
  },
] as const;

export const LANDING_METRICS: readonly StoryMetric[] = [
  {
    label: "4 layers",
    value: "Self to systems",
    detail:
      "The architecture mirrors how youth-led change grows from agency into structures.",
    expandedBody: [
      "The four-layer architecture is intentional. It reflects how implementation logic actually propagates: from whether people believe they can act, to whether they can act together, to whether institutions respond, to whether systems change.",
      "Keeping those layers visible prevents the submission from collapsing into either pure emotion or pure policy abstraction. Both matter, but they need an order.",
      "That order also keeps comparisons cleaner across countries because every submission follows the same sequence of escalation.",
    ],
  },
  {
    label: "12 prompts",
    value: "Narrative precision",
    detail:
      "Every answer is focused enough to become a usable implementation signal later on.",
    expandedBody: [
      "Twelve prompts is a deliberate balance: enough space to capture nuance, but bounded enough that every answer has a clear place in the final data structure.",
      "Each prompt is written to invite narrative specificity rather than generic statements, so the output can later support review, synthesis, and cross-country comparison.",
      "This precision is what allows the same response to feed both human reading and machine-ready chunking.",
    ],
  },
  {
    label: "1 output flow",
    value: "Web to sheets to RAG",
    detail:
      "A single submission becomes operational data, a review record, and synthesis-ready chunks.",
    expandedBody: [
      "The MVP is designed around one clean output flow. Respondents should not need to think about pipelines, but the system should be ready for them.",
      "Once a framework is submitted, it is validated, normalized, flattened for Google Sheets, chunked for thematic analysis, and backed up for operational resilience.",
      "That one flow is what keeps the tool deployable on Vercel while still preparing it for more ambitious downstream use.",
    ],
  },
] as const;

export const EXAMPLE_FRAMEWORKS: readonly ExampleFramework[] = [
  {
    country: "Philippines",
    youthStructure: "Sangguniang Kabataan (SK)",
    profile:
      "A structured national youth governance model with formal local mandates, budget authority, and a strong need for coordination across thousands of units.",
    themeHighlights: {
      self:
        "Cynicism after broken promises is the first barrier, so youth agency is built by making barangay-level leadership feel real, trusted, and mentored.",
      community:
        "City and provincial SK federations already exist but need better peer learning and co-design infrastructure to spread working practice nationwide.",
      institutions:
        "The main institutional asks focus on civic education, clearer climate mandates, and a stronger bridge between local SK work and UN-linked youth representation.",
      systems:
        "Structural reform points toward protected youth funds, binding participation seats, and a national digital platform that can connect every SK unit.",
    },
  },
  {
    country: "France",
    youthStructure: "Conseils de jeunes & ECOSOC Youth Forum",
    profile:
      "A civic renewal case where youth participation exists, but formal structures need stronger legitimacy, national coordination, and more accountable institutional follow-through.",
    themeHighlights: {
      self:
        "The individual barrier is learned political disengagement, so the task is to turn climate anxiety and precarity into agency through meaningful youth roles.",
      community:
        "Local participatory models exist, but they remain fragmented; the missing layer is a stronger peer-to-peer ecosystem that connects councils across the country.",
      institutions:
        "Priority asks include formal advisory standing, better civic education, and stronger youth participation inside climate and migration monitoring structures.",
      systems:
        "The long-range reform package points to voting reform, youth impact assessment, public response duties, and connected civic infrastructure.",
    },
  },
] as const;

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Who should submit a framework?",
    answer:
      "The primary audience is a national focal point, youth council lead, or equivalent coordinator who can speak for a country-level youth structure and describe both lived barriers and implementation pathways.",
  },
  {
    question: "What makes this different from a normal form?",
    answer:
      "The prompts are designed to capture policy implementation logic, not just opinions. Each response is shaped to be meaningful for national review, operations in Google Sheets, and later thematic synthesis.",
  },
  {
    question: "Why are the four themes fixed?",
    answer:
      "The fixed arc keeps submissions comparable across countries while still leaving room for local specificity. It also mirrors the COP logic from individual agency through collective action and institutions into systemic change.",
  },
  {
    question: "Can a submission be drafted on mobile?",
    answer:
      "Yes. The framework flow is mobile-first, autosaves locally on the device, and keeps step navigation simple so focal points can draft, pause, and resume from a phone.",
  },
  {
    question: "What happens after someone clicks submit?",
    answer:
      "The system validates the payload, creates a normalized JSON record, sends a flat row and RAG chunk rows to the Google Sheets webhook, stores a backup snapshot, and then sends a confirmation email when configured.",
  },
  {
    question: "What if email delivery fails?",
    answer:
      "Email is treated as a soft-fail. The submission still succeeds if the sheet write worked, and the API returns a warning so the record is not lost.",
  },
] as const;

export const FRAMEWORK_GUIDES: readonly FrameworkGuide[] = [
  {
    title: "Prepare a national lens",
    detail:
      "Bring the country name, the youth structure you represent, and the respondent details that should appear in the implementation register.",
  },
  {
    title: "Write like an operator, not a slogan",
    detail:
      "The strongest frameworks name who moves, what blocks them, which institution matters, and what systemic shift would actually change conditions.",
  },
  {
    title: "Expect a structured output",
    detail:
      "When submitted, your answers are converted into both a complete national record and 12 thematic chunks for later analysis and synthesis.",
  },
] as const;

export const DEFAULT_FORM_VALUES = {
  country: "",
  youth_structure: "",
  name: "",
  email: "",
  themes: {
    self: {
      personal_barriers: "",
      leadership_identity: "",
      challenges_resilience: "",
    },
    community: {
      team_mobilising: "",
      local_codesign: "",
      knowledge_sharing: "",
    },
    institutions: {
      education_local_government: "",
      sector_engagement: "",
      global_branch: "",
    },
    systems: {
      policy_transformation: "",
      cultural_narratives: "",
      digital_infrastructure: "",
    },
  },
} as const;
