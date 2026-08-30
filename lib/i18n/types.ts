export type CopyBlock = {
  title: string;
  body: string;
};

export type MetricCard = {
  label: string;
  value: string;
  detail: string;
};

export type FaqQA = {
  question: string;
  answer: string;
};

export type ProcessStageCopy = {
  title: string;
  detail: string;
};

export type ExampleFrameworkCopy = {
  country: string;
  youthStructure: string;
  profile: string;
  themes: {
    self: string;
    community: string;
    institutions: string;
    systems: string;
  };
};

export type ThemeFieldCopy = {
  label: string;
  placeholder: string;
  helper: string;
};

export type ThemeCopy = {
  shortLabel: string;
  title: string;
  tagline: string;
  scale: string;
  actionHint: string;
  fields: [ThemeFieldCopy, ThemeFieldCopy, ThemeFieldCopy];
};

export type StepCopy = {
  label: string;
  eyebrow: string;
  description: string;
};

export type ProgrammeBlock = {
  name: string;
  role: string;
  description: string;
};

export type ThemeDay = {
  day: string;
  theme: string;
  scale: string;
  focus: string;
};

export type DailySession = {
  time: string;
  session: string;
  note: string;
};

export type DirectoryMember = {
  id: string;
  name: string;
  country: string;
  city?: string;
  linkedin?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  region?: string;
  bio?: string;
  country?: string;
  email?: string;
};

export type AdvocacyPackage = {
  title: string;
  description: string;
  tag: string;
};

export type AdvocacyItem = string;

export type BoardMember = {
  name: string;
  country: string;
  role: string;
};

export type PageDictionary = {
  home: {
    metaTitle: string;
    metaDescription: string;
    heroEyebrow: string;
    heroTitle: string;
    heroTitleDim: string;
    heroSubtitle: string;
    heroCtaJoin: string;
    heroCtaFocalPoint: string;
    heroCtaFramework: string;
    metrics: [MetricCard, MetricCard, MetricCard];
    problemEyebrow: string;
    problemTitle: string;
    problemLead: string;
    problems: CopyBlock[];
    platformEyebrow: string;
    platformTitle: string;
    platformLead: string;
    platformPoints: CopyBlock[];
    frameworkEyebrow: string;
    frameworkTitle: string;
    frameworkLead: string;
    frameworkThemes: CopyBlock[];
    networkEyebrow: string;
    networkTitle: string;
    networkLead: string;
    networkStats: [MetricCard, MetricCard, MetricCard];
    impactEyebrow: string;
    impactTitle: string;
    impactLead: string;
    joinEyebrow: string;
    joinTitle: string;
    joinLead: string;
    joinCtaApply: string;
    joinCtaPartner: string;
  };
  faq: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaFramework: string;
    ctaHome: string;
    processEyebrow: string;
    processTitle: string;
    processLead: string;
    stages: ProcessStageCopy[];
    examplesEyebrow: string;
    examplesTitle: string;
    examplesLead: string;
    examples: ExampleFrameworkCopy[];
    faqEyebrow: string;
    faqTitle: string;
    items: FaqQA[];
  };
  insights: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    note: string;
    ctaReveal: string;
    ctaFaq: string;
    guidesTitle: string;
    guides: CopyBlock[];
    themesTitle: string;
    themesLead: string;
    themes: ThemeCopy[];
    steps: StepCopy[];
    formEyebrow: string;
    formTitle: string;
  };
  buildTheFuture: {
    metaTitle: string;
    metaDescription: string;
    backLink: string;
    liveTag: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    metrics: [MetricCard, MetricCard, MetricCard, MetricCard];
    problemTitle: string;
    problemLead: string;
    buildingTitle: string;
    buildingLead: string;
    mapTitle: string;
    mapLead: string;
    rolesTitle: string;
    rolesLead: string;
    enterTitle: string;
    enterLead: string;
    enterCta: string;
  };
  onMyWay: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    dates: string;
    ctaEmail: string;
    ctaZCop: string;
    pipelineTitle: string;
    pipeline: ProgrammeBlock[];
    partnerTitle: string;
    partnerDescription: string;
    partnerCta: string;
  };
  mesa: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    tagline: string;
    ctaVisit: string;
    ctaZCop: string;
    aboutTitle: string;
    aboutBody: string;
    pillarsTitle: string;
    pillars: ProgrammeBlock[];
    relationshipTitle: string;
    relationshipBody: string;
    partnerTitle: string;
    partnerDescription: string;
    partnerCta: string;
  };
  // New pages — optional so existing locale files don't break; EN defaults applied in mergeDictionary
  directory?: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    emptyState: string;
    countryLabel: string;
    cityLabel: string;
    linkedinLabel: string;
    loadingLabel: string;
    errorLabel: string;
  };
  advocacy?: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    packagesTitle: string;
    packages: AdvocacyPackage[];
    advocacies: AdvocacyItem[];
    downloadCta: string;
    comingSoonTag: string;
    requestCta: string;
    requestDescription: string;
    toolkitCta: string;
    toolkitNote: string;
  };
  team?: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    staffTitle: string;
    boardTitle: string;
    executiveTitle: string;
    coordinatorsTitle: string;
    philosophyTitle: string;
    philosophyBody: string;
    members: TeamMember[];
    coordinators: TeamMember[];
    staff: TeamMember[];
    board: BoardMember[];
  };
};

export type Dictionary = PageDictionary & {
  meta: {
    brand: string;
    tagline: string;
  };
  nav: {
    about: string;
    network: string;
    activities: string;
    zCop: string;
    join: string;
    faq: string;
    startFramework: string;
    home: string;
    buildTheFuture: string;
    onMyWay: string;
    directory: string;
    advocacy: string;
    team: string;
  };
  language: {
    label: string;
    choose: string;
  };
  footer: {
    eyebrow: string;
    title: string;
    description: string;
    startFramework: string;
    reviewFaq: string;
    organizedBy: string;
    digitalPlatform: string;
  };
  common: {
    submit: string;
    submitting: string;
    success: string;
    error: string;
    required: string;
    yes: string;
    no: string;
    maybe: string;
    learnMore: string;
    requestOnboarding: string;
    partnerWithZCop: string;
    backToHome: string;
    skipToContent?: string;
    openMenu?: string;
    closeMenu?: string;
  };
  join: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    subtitle: string;
    tabs: {
      general: string;
      focalPoint: string;
    };
    general: {
      title: string;
      description: string;
      name: string;
      email: string;
      organization: string;
      role: string;
      country: string;
      intent: string;
      intentPlaceholder: string;
    };
    focalPoint: {
      title: string;
      description: string;
      firstName: string;
      lastName: string;
      linkedin: string;
      age: string;
      country: string;
      city: string;
      hostZCop: string;
      hostZCopHelp: string;
    };
    success: string;
    error: string;
  };
  activities: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    programmesEyebrow: string;
    programmesTitle: string;
    otherEyebrow: string;
    otherTitle: string;
    programmes: [ProgrammeBlock, ProgrammeBlock];
    otherActivities: ProgrammeBlock[];
    partnerEyebrow: string;
    partnerTitle: string;
    partnerDescription: string;
    partnerCta: string;
  };
  zCop: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    heroDescription: string;
    dates: string;
    heroTag: string;
    problemEyebrow: string;
    problemTitle: string;
    seeProblems: string;
    ourResponse: string;
    problems: string[];
    solutions: string[];
    pipelineEyebrow: string;
    pipelineTitle: string;
    pipelineDescription: string;
    pipelineNote: string;
    themesEyebrow: string;
    themesTitle: string;
    themesDescription: string;
    cycleEyebrow: string;
    cycleTitle: string;
    cycleDescription: string;
    cyclePrinciples: string;
    partnerEyebrow: string;
    partnerTitle: string;
    partnerDescription: string;
    partnerEmailCta: string;
    themes: ThemeDay[];
    dailyCycle: DailySession[];
    pipeline: ProgrammeBlock[];
    rsvpEmail: string;
    nationalActionPlanEyebrow: string;
    nationalActionPlanTitle: string;
    nationalActionPlanDescription: string;
    nationalActionPlanCta: string;
    scheduleEyebrow: string;
    scheduleTitle: string;
    scheduleDescription: string;
    scheduleDays: {
      day: string;
      dateLabel: string;
      note: string;
      sessions: DailySession[];
    }[];
  };
};
