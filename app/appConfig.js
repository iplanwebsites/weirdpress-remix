/**
 * Application configuration object containing all key variables and settings
 * for the   project.
 */

// Environment check with fallback
const env = typeof process !== "undefined" ? process.env : {};
const NODE_ENV = env.NODE_ENV || "development";

const siteName = "WeirdPress Photo";
const domain = "weirdpress.photo";
/**/
const logotypePink =
  "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/5a8f361b94859ac640e8b8aa4983a58db33fac5d206b90e5f79fbc1cca9730a2-md.webp";

const logotypeMetal =
  "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/d51379e5da9dfa202b2e9545767fcb54c16b4490c705556b0827f57070c620f6-md.webp"; // ERRONOUS

const logoTail =
  "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/09ba77137912fe0ad74802d0fba6a7be8bd4388702eabed9287ebd09786a5b4c-md.webp";

const blueprintDark =
  "https://static.repo.md/projects/6851d519ac5bcd832fb4c887/_shared/medias/af3148f53bd93c046055b57e0d06fc2724c40b4fb1e9622b5cba692c6f3e21c8-md.webp";
const blueprintLight = blueprintDark;

export const appConfig = {
  // Site Information
  siteName: siteName,
  siteDescription: "Curated press photography and artistic documentation",
  siteUrl: "https://" + domain,

  // Repo-MD Configuration
  repoMd: {
    projectId: "6851d519ac5bcd832fb4c887",
    debug: NODE_ENV !== "production",
    revCacheExpirySeconds: 5, // 5 minutes
    debugRevCaching: NODE_ENV !== "production",
  },

  // CDN Configuration - for preconnecting to static assets
  cdn: {
    baseUrl: "https://static.repo.md",
    preconnect: true,
  },

  // Default Images
  defaultImages: {
    postCover: blueprintDark,
    projectCover: blueprintDark,
    projectCard: blueprintDark,
    userAvatar: "/img/default-avatar.png",
    siteLogo: "/logo-light.png",
    siteLogoDark: "/logo-dark.png",
    favicon:
      "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-xs.webp",
    ogImage: blueprintLight,
  },

  // Logo Images (different sizes)
  logos: {
    xs: "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-xs.webp",
    sm: "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-sm.webp",
    md: "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-md.webp",
    lg: "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-lg.webp",
    xl: "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-xl.webp",
  },

  // Logotype
  logotype: logoTail, //logotypeMetal,
  logotypeMetal,
  logotypePink,
  logoTail,

  // Author/Mascot Information
  author: {
    name: siteName, //"Klepto",
    avatar:
      "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/43dccbdb4a540c38d7cd4a5fcd510cd5a39310775aeb1d297d76c8d112c7bf91-xs.webp",
    byline: "By " + siteName,
  },

  // Mascot Configuration
  mascot: {
    name: siteName,
    image:
      "https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/0cc5ad3419ffc0ef4abbebd8594e646e7181c6902f6b3e9164b08f1c42eac01d-sm.webp",
    altText: siteName + " logo",
    description: "Documenting the intersection of journalism and visual art.",
    longDescription:
      "WeirdPress Photo showcases compelling press photography that captures pivotal moments in journalism and culture. We celebrate the photographers who shape how we see and understand our world through their lenses.",
  },

  // Search Configuration
  search: {
    placeholder: "Search photos...",
    autocompleteEndpoint: "/api/search/autocomplete",
    debounceDelay: 300,
  },

  // Default Values
  defaults: {
    rating: 5,
    reviewCount: 1,
    avgRating: 5,
  },

  // SEO Defaults
  seo: {
    defaultTitle: siteName,
    titleTemplate: "%s | " + siteName,
    defaultDescription:
      "Explore compelling press photography and photojournalism at " + siteName,
    defaultKeywords: [
      "press photography",
      "photojournalism",
      "documentary",
      "visual storytelling",
      "journalism",
    ],
    twitterHandle: "@" + siteName,
    ogImage: "/img/og-default.jpg",
  },

  // Pagination
  pagination: {
    postsPerPage: 12,
    photosPerPage: 15,
    searchResultsPerPage: 20,
  },

  // Cache Settings
  cache: {
    staticAssetsCacheDuration: 60 * 60 * 24 * 30, // 30 days
    apiCacheDuration: 60 * 15, // 15 minutes
    searchCacheDuration: 60 * 5, // 5 minutes
  },

  // Feature Flags
  features: {
    searchEnabled: true,
    commentsEnabled: false,
    newsletterEnabled: true,
    darkModeEnabled: true,
    socialShareEnabled: true,
    showEndgame: false,
  },

  // Company Information
  company: {
    name: "Endgame Media",
    tagline: "The agentic publishing company",
    website: "https://endgame.media/",
  },

  // Brand URLs
  brands: {
    weirdPressPhoto: "https://weirdpressphoto.com",
    repoMd: "https://repo.md",
  },

  // External Services
  services: {
    chatUrl: "https://chat.repo.md/projects/6848af1cacdf98346841d302",
    analytics: {
      // googleAnalyticsId: env.GOOGLE_ANALYTICS_ID,
    },
    newsletter: {
      // provider: "mailchimp", // or "convertkit", "buttondown", etc.
      // apiKey: env.NEWSLETTER_API_KEY,
    },
  },

  // Content Categories
  categories: {
    photography: [
      "breaking-news",
      "politics",
      "culture",
      "sports",
      "environment",
    ],
    regions: ["north-america", "europe", "asia", "africa", "latin-america"],
    themes: ["conflict", "celebration", "daily-life", "nature", "urban"],
  },

  // Social Media Links
  social: {
    twitter: "https://twitter.com/weirdpressphoto",
    instagram: "https://instagram.com/weirdpressphoto",
    facebook: "https://facebook.com/weirdpressphoto",
    pinterest: "https://pinterest.com/weirdpressphoto",
    youtube: "https://youtube.com/@weirdpressphoto",
  },

  // Contact Information
  contact: {
    email: "hello@" + domain,
    supportEmail: "support@" + domain,
  },

  // Environment-specific settings
  isDevelopment: NODE_ENV === "development",
  isProduction: NODE_ENV === "production",
  isTest: NODE_ENV === "test",
};

export default appConfig;
