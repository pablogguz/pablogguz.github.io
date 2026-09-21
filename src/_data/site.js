export default {
  title: "pablo garcía-guzmán",
  description: "essays on economics, data, and public policy",
  url: "https://pablogguz.github.io",
  lang: "en",

  author: "Pablo García-Guzmán",
  email: "pgarcia.eco@gmail.com",
  authorCitation: "García-Guzmán, Pablo",
  twitter: "pablogguz_",
  handle: "pablo garcía-guzmán",

  nav: [
    { name: "blog", url: "/blog/" },
    { name: "data projects", url: "/projects/" },
    { name: "policy writing", url: "/policy/" },
  ],

  links: [
    { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/pablogguz/" },
    { name: "GitHub", icon: "github", url: "https://github.com/pablogguz" },
    { name: "Twitter", icon: "twitter", url: "https://twitter.com/pablogguz_" },
    { name: "Email", icon: "email", url: "mailto:pgarcia.eco@gmail.com" },
  ],

  // github discussions via giscus — https://giscus.app
  giscus: {
    repo: "pablogguz/pablogguz.github.io",
    repoId: "R_kgDOLFdBTA",
    category: "Announcements",
    categoryId: "DIC_kwDOLFdBTM4DEEFr",
  },

  coffee: {
    title: "before you write",
    intro: "i'm always happy to hear from you. a few things worth knowing first:",
    subject: "hello from your website",
    guidelines: [
      "Don't be shy! I'm always happy to chat about data, economics, or anything else. If you are a student or just starting out in the field, I'm also happy to provide advice or guidance on the usual stuff (e.g. whether to do a PhD, whether a pre-doc is worth it, alternative career paths, etc.).",
      "If you add me on LinkedIn, please drop a brief note explaining why you want to connect. I generally don't accept invites without context (unless we're clearly in the same data/econ/policy bubble).",
      "I am not a hiring manager and can't provide specific interview advice for EBRD roles. If you ask me about this, I will refer you to publicly available resources and wish you the best of luck!",
    ],
  },

  footer: {
    copyright: "made by pablo w/ ❤️",
    disclaimer: "All the content shared on this website is completely my own and does not reflect the views of the EBRD.",
  },

  // defaults for posts (override per post in front matter)
  post: {
    toc: true,
    comment: true,
    cite: true,
    outdateAlert: false,
    outdateAlertDays: 120,
  },
};
