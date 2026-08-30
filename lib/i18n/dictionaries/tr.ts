import type { CoreDictionary } from "@/lib/i18n/core-dictionary";

export const tr = {
  meta: {
    brand: "The Global Call",
    tagline: "Gençlik Politikası Uygulaması",
  },
  nav: {
    about: "Hakkında",
    network: "Ağ",
    activities: "Faaliyetlerimiz",
    zCop: "Z-COP",
    join: "Katıl",
    faq: "SSS",
    startFramework: "Çerçeveyi başlat",
    home: "Ana sayfa",
    buildTheFuture: "Geleceği inşa et",
    onMyWay: "On My Way",
    directory: "Dizin",
  },
  language: {
    label: "Dil",
    choose: "Dilinizi seçin",
  },
  footer: {
    eyebrow: "Harekete geçme çağrısı",
    title: "Ulusal çerçeveyi odaya taşıyın",
    description:
      "Hedef uygulama ise, girdinin yeterince yapılandırılmış olması gerekir ki taşınabilsin. Çerçeve açılış sayfasında bir fokal nokta, ulusal sinyali her cihazdan taslak halinde hazırlayıp gözden geçirip temiz biçimde gönderebilir.",
    startFramework: "Çerçeveyi başlat",
    reviewFaq: "SSS ve örnekleri inceleyin",
    organizedBy: "Düzenleyen: The Global Call",
    digitalPlatform: "Dijital platform: On My Way",
  },
  common: {
    submit: "Gönder",
    submitting: "Gönderiliyor…",
    success: "Teşekkürler — başvurunuzu aldık.",
    error: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    required: "Zorunlu",
    yes: "Evet",
    no: "Hayır",
    maybe: "Belki",
    learnMore: "Daha fazla bilgi",
    requestOnboarding: "Oryantasyon talep et",
    partnerWithZCop: "Z-COP ortağı olarak katıl",
    backToHome: "Ana sayfaya dön",
  },
  join: {
    metaTitle: "Katıl",
    metaDescription:
      "The Global Call ağına katılın veya gençlik politikası uygulaması için ulusal fokal nokta olarak kaydolun.",
    title: "Koordinasyon katmanına katılın",
    subtitle:
      "Küresel ağa başvurun veya ulusal fokal nokta olarak kaydolun. Her iki yol da sizi uygulama üzerinde çalışan 170'ten fazla ülkeye bağlar.",
    tabs: {
      general: "Ağa katıl",
      focalPoint: "Ulusal fokal nokta",
    },
    general: {
      title: "Küresel koordinasyon katmanına girin",
      description:
        "Kim olduğunuzu ve nasıl katkıda bulunmak istediğinizi paylaşın. Gençleri, kurumları ve müttefikleri tek bir uygulama hattında bir araya getiriyoruz.",
      name: "Ad soyad",
      email: "E-posta",
      organization: "Kuruluş",
      role: "Rol",
      country: "Ülke",
      intent: "Nasıl katkıda bulunmak istiyorsunuz?",
      intentPlaceholder: "İlginizi ve kapasitenizi kısaca açıklayın",
    },
    focalPoint: {
      title: "Ulusal fokal nokta olarak katılın",
      description:
        "Ulusal gençlik politikası uygulamasını koordine etme ilginizi kaydedin. Fokal noktalar öncelikleri haritalamaya, kuruluşları dahil etmeye ve ülkelerini Z-COP'a bağlamaya yardımcı olur.",
      firstName: "Ad",
      lastName: "Soyad",
      linkedin: "LinkedIn profil URL'si",
      age: "Yaş",
      country: "Ülke",
      city: "Şehir",
      hostZCop: "Z-COP etkinliklerini yerelde ev sahipliği yapmakla ilgileniyor musunuz?",
      hostZCopHelp: "Yerel merkezler, zirve öncesi, sırası ve sonrasında programı canlandırır.",
    },
    success: "Teşekkürler — başvurunuz alındı. Sizinle iletişime geçeceğiz.",
    error: "Başvurunuz gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
  },
  activities: {
    metaTitle: "Faaliyetlerimiz",
    metaDescription:
      "The Global Call programları — seferberlikten politikaya ve uygulamaya — artı Z-COP'a ortak yolları.",
    eyebrow: "Programlar",
    title: "Faaliyetlerimiz",
    subtitle:
      "İki amiral gemisi programı Global Call'u temellendirir. Destekleyici faaliyetler yerel eylemi küresel koordinasyonla bağlar.",
    programmesEyebrow: "Amiral gemisi programlar",
    programmesTitle: "İki ana program",
    otherEyebrow: "Diğer faaliyetler",
    otherTitle: "Diğer Global Call faaliyetleri",
    programmes: [
      {
        name: "The Global Call",
        role: "Ağ",
        description:
          "170'ten fazla ülkede faaliyet gösteren bir gençlik seferberlik ağı. Yerel öncelikleri belirler, sivil aktörleri bağlar ve her düzeyde değişim gündemlerini ilerletir.",
      },
      {
        name: "On My Way",
        role: "Eylem katmanı",
        description:
          "Uygulamayı görünür kılar. Eylem maddeleri paylaşın, taahhütleri izleyin, aktörleri fırsatlar ve finansmanla buluşturun. Paylaşılan yapılır.",
      },
    ],
    otherActivities: [
      {
        name: "MESA Institute",
        role: "Stratejik Ortak — Politika Köprüsü",
        description:
          "Bağımsız bir düşünce kuruluşu — gelecek nesil için masa. MESA, gençlerle geleceklerini şekillendiren kurumlar arasındaki kuşak uçurumunu köprüler; The Global Call'da öne çıkan öncelikleri, Gezegensel Dayanıklılık gibi alanlarda sağlam ve benimsenebilir politikalara dönüştürür.",
      },
      {
        name: "Ulusal çerçeve",
        role: "Yapılandırılmış girdi",
        description:
          "Ulusal fokal noktalar, yerel bağlamdan çok taraflı salonlara taşınan yapılandırılmış uygulama çerçeveleri sunar.",
      },
      {
        name: "Z-COP",
        role: "Yıllık zirve",
        description:
          "Ulusal merkezlerin SKA'larla uyumlu, izlenebilir program portföyleri oluşturduğu beş günlük bir çalışma zirvesi.",
      },
    ],
    partnerEyebrow: "Ortak yolu",
    partnerTitle: "Z-COP ortağı olarak katılın",
    partnerDescription:
      "Kuruluşlar, gençlik merkezleri ve kurumlar yerel merkez canlandırması, programlama ve Ağustos 2026'ya uzanan uygulama hattında ortaklık kurabilir.",
    partnerCta: "Z-COP ortağı olun",
  },
  zCop: {
    metaTitle: "Z-COP",
    metaDescription:
      "Z-COP 2026 — beş günlük gençlik politikası uygulama zirvesi, 30 Ağustos – 3 Eylül.",
    eyebrow: "Conference of Youth Policy Implementation",
    title: "Z-COP",
    heroDescription:
      "İhtiyaçları değerlendirmek, uygulama yolları tasarlamak, kuruluşları hazırlamak ve teslimat hattını uygulamak için yıllık beş günlük bir zirve — saygı, koordinasyon ve sorunlara en yakın olanların onları çözmeye en uygun kişiler olduğu inancına dayanır.",
    dates: "30 Ağustos – 3 Eylül 2026",
    heroTag: "Ulusal düzeyde koordine, küresel ölçekte güçlendirilir",
    problemEyebrow: "Sorun",
    problemTitle: "Kurumlar teslim edemiyor. Yetenek yanlış dağıtılmış. Krizler şiddetleniyor.",
    seeProblems: "Gördüklerimiz",
    ourResponse: "Yanıtımız",
    problems: [
      "Kurumlar teslim edemiyor",
      "Yetenek yanlış dağıtılmış ve yapay zekâ baskısı altında",
      "Jeopolitik ve iklim krizleri şiddetleniyor",
    ],
    solutions: [
      "Özerk bir eylem sistemi oluşturmak",
      "Politika yapımını fikirden uygulamaya desteklemek",
      "Yeni nesil için fırsatlar ilham etmek — izlenen, özelleştirilebilir, uyarlanabilir",
    ],
    pipelineEyebrow: "Teslimat hattı",
    pipelineTitle: "Üç platform. Tek misyon.",
    pipelineDescription: "Politika içgörüsünden topluluk uygulamasına — hepsi bağlı.",
    pipelineNote:
      "Yerel koordinatörler yerel merkezleri canlandırır, bakanları ve gençlik liderlerini bir araya getirir. İnsanlar The Global Call'da içgörü paylaşır. Ortağımız MESA Institute ile bu içgörüler politika yönüne dönüşür. Programlar On My Way ile uygulanır.",
    themesEyebrow: "Dört tema — tek yay",
    themesTitle: "Her gün bir değişim ölçeğinden geçer",
    themesDescription:
      "Self bireysel temeli oluşturur. Community kolektif altyapıyı kurar. Institutions ölçek için kaldıraç sağlar. Systems yapısal değişimin gerçek olduğu yerdir.",
    cycleEyebrow: "Günlük yapı",
    cycleTitle: "Günlük döngü — on oturum, tek ritim",
    cycleDescription:
      "Her gün aynı döngüyü izler. Tema değişir. Yapı değişmez. Beş gün boyunca tekrar gibi görünen şey birikimdir.",
    cyclePrinciples:
      "Üç ilke: iş birikimlidir — hiçbir şey sıfırdan başlamaz. Platform kayıttır — On My Way'de yoksa olmamıştır. Hat senkronize kalmalıdır — Global Call, MESA ve On My Way her günün programı başlamadan önce hizalanır.",
    partnerEyebrow: "Hat ile etkileşim",
    partnerTitle: "Doğal ortak olun",
    partnerDescription:
      "Oryantasyon toplantınızı talep edin. Ulusal fokal noktalar, gençlik kuruluşları ve kamu kurumlarının Z-COP öncesi, sırası ve sonrasında tanımlı rolleri vardır.",
    partnerEmailCta: "Oryantasyon talep et",
    rsvpEmail: "rsvp@z-cop.org",
    nationalActionPlanEyebrow: "Talep",
    nationalActionPlanTitle: "Bir Ulusal Eylem Planına Bağlı Kalın",
    nationalActionPlanDescription:
      "Ulusal Eylem Planı, Z-COP programının omurgasıdır — zirve öncesinde hazırlanır, iki gün boyunca odak noktaları tarafından gözden geçirilip onaylanır ve sonrasında ülkenin uygulama kaydı olarak güncellenir.",
    nationalActionPlanCta: "Z-COP 2026 için kayıt olun",
    scheduleEyebrow: "Program",
    scheduleTitle: "Z-COP 2026 programı",
    scheduleDescription:
      "31 Ağustos – 1 Eylül 2026. The Global Call, her gün tüm ulusal merkezlerde San Francisco saatiyle 07:00'de senkronize olur.",
    scheduleDays: [
      {
        day: "1. Gün",
        dateLabel: "31 Ağustos",
        note: "Global Call tüm ulusal merkezlerde San Francisco saatiyle 07:00'de senkronize edildi.",
        sessions: [
          {
            time: "8:30–10:00",
            session: "Kahvaltı ve Karşılama / Politikadan Programlamaya Oturumlar I: Liderlik İçgörüleri",
            note: "Karşılama; Global Call verilerinin gözden geçirilmesi; sunulan gençlik politika notu önerilerinin sunumu; başarılı örneklerden teori ve ilham.",
          },
          {
            time: "11:00–11:45",
            session: "Bölgesel Buluşma (Koordinasyon Görüşmesi)",
            note: "Merkezi diğer ulusal/küresel merkezlerle koordinasyon, ilham ve ortak gözden geçirme için birbirine bağlayan görüşme.",
          },
          {
            time: "11:45–12:30",
            session: "Politikadan Faaliyetlere",
            note: "Eylem planı politikalarını somut sahadaki faaliyetlere dönüştüren atölye.",
          },
          {
            time: "12:30–13:15",
            session: "Ara / Öğle Yemeği",
            note: "",
          },
          {
            time: "13:15–14:15",
            session: "Tematik On My Way Atölyeleri (Program Uygulaması)",
            note: "Ülke bazında uygulamalı uygulama atölyesi, her ülke için yerel olarak uygun faaliyet.",
          },
          {
            time: "14:15–15:00",
            session: "Yansıma ve Geri Bildirim Oturumu",
            note: "Gençler nelerin işe yarayıp yaramadığını değerlendirir; Aşama 1 sonuçlarının (OMW ve MESA) gözden geçirilmesi.",
          },
          {
            time: "15:00–15:45",
            session: "Paydaş Haritalama ve Boşluk Analizi",
            note: "Proje başına doldurulacak paydaşların ve boşlukların ilk haritalanması; COP sonrası 21 günlük erişim planının taslak özeti.",
          },
          {
            time: "15:45–17:15",
            session: "Eylem Planı Güncellemesi ve Geri Bildirim",
            note: "Tutarsızlıkları gidermek ve soruları yanıtlamak için odak noktalarıyla temas noktası; faaliyet kitabı gönderim formu üzerinden talep gönderme fırsatı. Eylem planı gece boyunca gözden geçirilir ve güncellenmiş bir sürüm ertesi sabah paylaşılır.",
          },
        ],
      },
      {
        day: "2. Gün",
        dateLabel: "1 Eylül",
        note: "Global Call tüm ulusal merkezlerde San Francisco saatiyle 07:00'de senkronize edildi.",
        sessions: [
          {
            time: "08:30–09:30",
            session: "Günün İlhamı ve Görünümü",
            note: "Eylem planının (gece geri bildirimleri dahil edilerek) ve taslak programların sunumu.",
          },
          {
            time: "09:30–10:15",
            session: "MESA İçgörüleriyle OMW Uygulama Atölyesi",
            note: "Politika değişikliğinin uygulanmasına yardımcı olabilecek yerel politika paydaşlarının belirlenmesi.",
          },
          {
            time: "10:15–11:00",
            session: "Uygulama Atölyesi II: Finansman",
            note: "Finansman kaynaklarının belirlenmesi, programların sunulması, paydaş desteğinin sağlanması.",
          },
          {
            time: "11:00–12:00",
            session: "Politikadan Programlamaya Oturumlar II: Haritalama ve Zaman Çizelgeleri",
            note: "Politikaların uygulamayla eşleştirilmesi (2-3 alt oturum); çıktı: uygulama ve finansman kilometre taşlarının takvimi.",
          },
          {
            time: "12:00–12:30",
            session: "Eylem Planlarının Dağıtımı ve Taslak 21 Günlük Aktivasyon Planı",
            note: "Tutarsızlıkları gidermek ve soruları yanıtlamak için odak noktalarıyla temas noktası.",
          },
          {
            time: "12:30–13:15",
            session: "Ara / Öğle Yemeği",
            note: "",
          },
          {
            time: "13:15–15:15",
            session: "Ulusal Eylem Planı Gözden Geçirme ve Sahiplenme",
            note: "İki günlük sonuçları içeren ulusal eylem planının nihai gözden geçirilmesi ve eklemeler.",
          },
          {
            time: "15:15–16:00",
            session: "OMW Eylem Planı (21 Günlük Aktivasyon) ve Paydaş Haritalama",
            note: "21 günlük planın ve paydaş haritalamasının tartışılması ve gözden geçirilmesi.",
          },
          {
            time: "16:00–16:30",
            session: "Kapanış Oturumu",
            note: "Kapanış konuşmaları ve değerlendirmeler.",
          },
        ],
      },
    ],
    themes: [
      {
        day: "Gün 0 · 30 Ağu",
        theme: "Setting the Stage",
        scale: "Manzara incelemesi",
        focus:
          "Önceden sunulan tüm içgörülerin gözden geçirilmesi. Platform ve hat oryantasyonu. Dört tema alanındaki ulusal programların haritalanması.",
      },
      {
        day: "Gün 1 · 31 Ağu",
        theme: "Self",
        scale: "Birey · aile · yakın ilişkiler",
        focus:
          "Bireysel düzeyde gençlerin sürdürülebilir kalkınma zorluklarına harekete geçmesini ne engelliyor?",
      },
      {
        day: "Gün 2 · 1 Eyl",
        theme: "Community",
        scale: "Mahalle · yerel grup · gençlik konseyi",
        focus:
          "Kolektif düzeyde toplulukların sürdürülebilir kalkınma öncelikleri etrafında örgütlenmesini ne engelliyor?",
      },
      {
        day: "Gün 3 · 2 Eyl",
        theme: "Institutions",
        scale: "Okullar · yerel yönetim · bakanlıklar · STK'lar",
        focus:
          "Kurumsal düzeyde gençlerin sürdürülebilir kalkınma kararlarını etkilemesini ne engelliyor?",
      },
      {
        day: "Gün 4 · 3 Eyl",
        theme: "Systems",
        scale: "Ulusal politika · ekonomik yapılar · küresel iş birliği",
        focus:
          "Hangi yapısal koşullar kalıcı değişimi engelliyor? Program portföyleri tutarlı bir ulusal yanıtı nasıl oluşturuyor?",
      },
    ],
    dailyCycle: [
      {
        time: "Önceki akşam",
        session: "Mapping Workshop",
        note: "Kuruluş liderleri yarının temasını haritalar. Ön harita On My Way'e paylaşılır.",
      },
      {
        time: "Sabah 1",
        session: "Pipeline Review",
        note: "Tüm platform paylaşımları gözden geçirilir. Paydaş görevleri onaylanır. Teknik oryantasyon.",
      },
      {
        time: "Sabah 2",
        session: "Global Call Insights",
        note: "İçgörülerle tema tanıtımı. MESA ve On My Way için öneriler işaretlenir.",
      },
      {
        time: "Sabah 3",
        session: "Physical Activity",
        note: "Yaparak öğrenme — önceki günün temasından uygulamalı etkinlikler.",
      },
      {
        time: "Sabah 4",
        session: "Activity Feedback",
        note: "Uygulamalı oturumun değerlendirmesi. Yeni program kavramları için beyin fırtınası.",
      },
      {
        time: "Öğle",
        session: "Output Drafting",
        note: "Platform kontrolü. Çıktı paketleri taslağı. Ortak belirleme.",
      },
      {
        time: "Öğleden sonra",
        session: "Mentoring Circles",
        note: "Günün teması uygulama zorlukları üzerine akran liderliğinde küçük gruplar.",
      },
      {
        time: "Öğleden sonra",
        session: "Programme Definition",
        note: "Her merkez en az bir eylem maddesini açık talep olarak paylaşır.",
      },
      {
        time: "Erken akşam",
        session: "Reflection & Media",
        note: "Neşeli işleme. Medya ekibi tanıklıkları ve içeriği kaydeder.",
      },
      {
        time: "Akşam",
        session: "Programme Finalisation",
        note: "On My Way'deki tüm kayıtlar tamamlanır. Yarının ön haritası paylaşılır.",
      },
    ],
    pipeline: [
      {
        name: "The Global Call",
        role: "Ağ",
        description:
          "170'ten fazla ülkede faaliyet gösteren bir gençlik seferberlik ağı. Yerel öncelikleri belirler, sivil aktörleri bağlar ve her düzeyde değişim gündemlerini ilerletir.",
      },
      {
        name: "MESA Institute",
        role: "Stratejik Ortak — Politika Köprüsü",
        description:
          "Bağımsız bir düşünce kuruluşu — gelecek nesil için masa. MESA, gençlerle geleceklerini şekillendiren kurumlar arasındaki kuşak uçurumunu köprüler; The Global Call'da öne çıkan öncelikleri sağlam ve benimsenebilir politikalara dönüştürür.",
      },
      {
        name: "On My Way",
        role: "Eylem katmanı",
        description:
          "Uygulamayı görünür kılar. Eylem maddeleri paylaşın, taahhütleri izleyin, aktörleri fırsatlar ve finansmanla buluşturun.",
      },
    ],
  },
} as CoreDictionary;