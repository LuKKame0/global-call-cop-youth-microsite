import { mergeDictionary } from "@/lib/i18n/merge-dictionary";
import { pagesEn } from "@/lib/i18n/pages/en";
import type { CoreDictionary } from "@/lib/i18n/core-dictionary";
import type { Dictionary } from "@/lib/i18n/types";

export const enCore = {
  meta: {
    brand: "The Global Call",
    tagline: "Youth Policy Implementation",
  },
  nav: {
    about: "About",
    network: "Network",
    activities: "Our Activities",
    zCop: "Z-COP",
    join: "Join",
    faq: "FAQ",
    startFramework: "Start Framework",
    home: "Home",
    buildTheFuture: "Build the Future",
    onMyWay: "On My Way",
  },
  language: {
    label: "Language",
    choose: "Choose your language",
  },
  footer: {
    eyebrow: "Call to action",
    title: "Bring the national framework into the room",
    description:
      "If the goal is implementation, the input has to be structured enough to travel. The framework landing is where a focal point can draft, review, and submit that national signal cleanly from any device.",
    startFramework: "Start the framework",
    reviewFaq: "Review FAQ & examples",
    organizedBy: "Organised by The Global Call",
    digitalPlatform: "Digital platform: On My Way",
  },
  common: {
    submit: "Submit",
    submitting: "Submitting…",
    success: "Thank you — we received your submission.",
    error: "Something went wrong. Please try again.",
    required: "Required",
    yes: "Yes",
    no: "No",
    maybe: "Maybe",
    learnMore: "Learn more",
    requestOnboarding: "Request onboarding",
    partnerWithZCop: "Join Z-COP as partner",
    backToHome: "Back to home",
    skipToContent: "Skip to main content",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  join: {
    metaTitle: "Join",
    metaDescription:
      "Join The Global Call network or register as a national focal point for youth policy implementation.",
    title: "Join the coordination layer",
    subtitle:
      "Apply to the global network or register as a national focal point. Both paths connect you to 170+ countries working on implementation.",
    tabs: {
      general: "Join the network",
      focalPoint: "National focal point",
    },
    general: {
      title: "Enter the global coordination layer",
      description:
        "Share who you are and how you want to contribute. We connect youth, institutions, and allies into one implementation pipeline.",
      name: "Full name",
      email: "Email",
      organization: "Organisation",
      role: "Role",
      country: "Country",
      intent: "How do you want to contribute?",
      intentPlaceholder: "Briefly describe your interest and capacity",
    },
    focalPoint: {
      title: "Join as national focal point",
      description:
        "Register your interest in coordinating national youth policy implementation. Focal points help map priorities, onboard organisations, and connect their country to Z-COP.",
      firstName: "First name",
      lastName: "Last name",
      linkedin: "LinkedIn profile URL",
      age: "Age",
      country: "Country",
      city: "City",
      hostZCop: "Interested in hosting Z-COP activities locally?",
      hostZCopHelp: "Local hubs animate programming before, during, and after the summit.",
    },
    success: "Thank you — your application was received. We will be in touch.",
    error: "We could not submit your application. Please check your details and try again.",
  },
  activities: {
    metaTitle: "Our Activities",
    metaDescription:
      "The Global Call programmes — from mobilisation to policy to implementation — plus partner pathways to Z-COP.",
    eyebrow: "Programmes",
    title: "Our activities",
    subtitle:
      "Two flagship programmes anchor the Global Call. Supporting activities connect local action to global coordination.",
    programmesEyebrow: "Flagship programmes",
    programmesTitle: "Two main programmes",
    otherEyebrow: "More activities",
    otherTitle: "Other Global Call activities",
    programmes: [
      {
        name: "The Global Call",
        role: "The Network",
        description:
          "A youth mobilisation network active in 170+ countries. Identifies local priorities, connects civic actors, and drives change agendas at every level.",
      },
      {
        name: "On My Way",
        role: "The Action Layer",
        description:
          "Makes implementation visible. Post action items, track commitments, connect actors to opportunities and funding. What gets posted, gets done.",
      },
    ],
    otherActivities: [
      {
        name: "MESA Institute",
        role: "Strategic Partner — The Policy Bridge",
        description:
          "An independent think tank — the table for the next generation. MESA bridges the generational divide between youth and the institutions shaping their future, turning the priorities surfaced by The Global Call into rigorous, adoptable policy across pillars like Planetary Resilience.",
      },
      {
        name: "National framework",
        role: "Structured input",
        description:
          "National focal points submit structured implementation frameworks that travel from local context into multilateral rooms.",
      },
      {
        name: "Z-COP",
        role: "Annual summit",
        description:
          "A five-day working summit where national hubs build trackable programme portfolios aligned to the SDGs.",
      },
    ],
    partnerEyebrow: "Partner pathway",
    partnerTitle: "Join Z-COP as partner",
    partnerDescription:
      "Organisations, youth hubs, and institutions can partner on local hub animation, programming, and the implementation pipeline leading to August 2026.",
    partnerCta: "Become a Z-COP partner",
  },
  zCop: {
    metaTitle: "Z-COP",
    metaDescription:
      "Z-COP 2026 — five-day youth policy implementation summit, August 30 to September 3.",
    eyebrow: "Conference of Youth Policy Implementation",
    title: "Z-COP",
    heroDescription:
      "A five-day annual summit to assess needs, design implementation paths, prepare organisations, and practise the delivery pipeline — built on respect, coordination, and the belief that the people closest to the problems are best placed to solve them.",
    dates: "August 30 – September 3, 2026",
    heroTag: "Coordinated at national level, amplified globally",
    problemEyebrow: "The problem",
    problemTitle: "Institutions fail to deliver. Talent is misallocated. Crises amplify.",
    seeProblems: "What we see",
    ourResponse: "Our response",
    problems: [
      "Institutions fail to deliver",
      "Talent is misallocated and pressured by AI",
      "Geopolitical and climate crises are amplified",
    ],
    solutions: [
      "Creating an autonomous system of action",
      "Supporting policymaking from ideation to execution",
      "Inspiring opportunities for the next generation — monitored, customisable, adaptable",
    ],
    pipelineEyebrow: "Delivery pipeline",
    pipelineTitle: "Three platforms. One mission.",
    pipelineDescription: "From policy insight to community implementation — all connected.",
    pipelineNote:
      "Local coordinators animate local hubs, convening ministers and youth leaders. People share insights on The Global Call. With our partner MESA Institute, those insights become policy direction. Programmes are implemented using On My Way.",
    themesEyebrow: "Four themes — one arc",
    themesTitle: "Each day works through one scale of change",
    themesDescription:
      "Self creates the individual foundation. Community creates collective infrastructure. Institutions provide the lever for scale. Systems is where structural change becomes real.",
    cycleEyebrow: "Daily structure",
    cycleTitle: "The daily cycle — ten sessions, one rhythm",
    cycleDescription:
      "Every day follows the same cycle. The theme changes. The structure does not. What looks like repetition across five days is accumulation.",
    cyclePrinciples:
      "Three principles: the work is cumulative — nothing starts from scratch. The platform is the record — if it is not on On My Way, it did not happen. The pipeline must stay in sync — The Global Call, our partner MESA Institute, and On My Way aligned before each day's programme begins.",
    partnerEyebrow: "Engage with the pipeline",
    partnerTitle: "Become a natural partner",
    partnerDescription:
      "Ask for your onboarding meeting. National focal points, youth organisations, and government bodies each have defined roles before, during, and after the Z-COP.",
    partnerEmailCta: "Request onboarding",
    themes: [
      {
        day: "Day 0 · Aug 30",
        theme: "Setting the Stage",
        scale: "Landscape review",
        focus:
          "Review of all pre-submitted insights. Platform and pipeline orientation. Mapping of national programmes across all four theme areas.",
      },
      {
        day: "Day 1 · Aug 31",
        theme: "Self",
        scale: "Individual · Family · Immediate relationships",
        focus:
          "What at the individual level prevents young people from acting on sustainable development challenges?",
      },
      {
        day: "Day 2 · Sept 1",
        theme: "Community",
        scale: "Neighbourhood · Local group · Youth council",
        focus:
          "What at the collective level prevents communities from organising around sustainable development priorities?",
      },
      {
        day: "Day 3 · Sept 2",
        theme: "Institutions",
        scale: "Schools · Local government · Ministries · NGOs",
        focus:
          "What at the institutional level blocks youth from influencing sustainable development decisions?",
      },
      {
        day: "Day 4 · Sept 3",
        theme: "Systems",
        scale: "National policy · Economic structures · Global cooperation",
        focus:
          "What structural conditions prevent lasting change? How do programme portfolios form a coherent national response?",
      },
    ],
    dailyCycle: [
      {
        time: "Previous evening",
        session: "Mapping Workshop",
        note: "Org leaders map tomorrow's theme. Provisional map posted to On My Way.",
      },
      {
        time: "Morning 1",
        session: "Pipeline Review",
        note: "Review all platform posts. Confirm stakeholder tasks. Tech onboarding.",
      },
      {
        time: "Morning 2",
        session: "Global Call Insights",
        note: "Theme introduction using insights. Flag proposals for MESA and On My Way.",
      },
      {
        time: "Morning 3",
        session: "Physical Activity",
        note: "Learning by doing — practice activities from previous day's theme.",
      },
      {
        time: "Morning 4",
        session: "Activity Feedback",
        note: "Debrief physical session. Brainstorm new programme concepts.",
      },
      {
        time: "Lunch",
        session: "Output Drafting",
        note: "Platform check. Output packages drafted. Partner identification.",
      },
      {
        time: "After lunch",
        session: "Mentoring Circles",
        note: "Peer-led small groups on today's theme implementation challenges.",
      },
      {
        time: "Afternoon",
        session: "Programme Definition",
        note: "Each hub posts at least one action item as an open request.",
      },
      {
        time: "Early evening",
        session: "Reflection & Media",
        note: "Joyful processing. Media team captures testimonies and content.",
      },
      {
        time: "Evening",
        session: "Programme Finalisation",
        note: "All entries complete on On My Way. Tomorrow's provisional map posted.",
      },
    ],
    pipeline: [
      {
        name: "The Global Call",
        role: "The Network",
        description:
          "A youth mobilisation network active in 170+ countries. Identifies local priorities, connects civic actors, and drives change agendas at every level.",
      },
      {
        name: "MESA Institute",
        role: "Strategic Partner — The Policy Bridge",
        description:
          "An independent think tank — the table for the next generation. MESA bridges the generational divide between youth and the institutions shaping their future, turning the priorities surfaced by The Global Call into rigorous, adoptable policy.",
      },
      {
        name: "On My Way",
        role: "The Action Layer",
        description:
          "Makes implementation visible. Post action items, track commitments, connect actors to opportunities and funding.",
      },
    ],
  },
} as CoreDictionary;

export const en: Dictionary = mergeDictionary(enCore, pagesEn);
