// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '배워서 남주기',
  tagline: '개발 관련 지식 정리 및 취미 관련 잡담들',
  url: 'https://gendalf9.net',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false, // Optional: disable the docs plugin
        blog: {
          routeBasePath: '/', // Serve the blog at the site's root
          /* other blog options */
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: '배워서 남주기',
      logo: {
        alt: 'blog logo',
        src: 'img/logo.png',
        href: 'https://gendalf9.net',
        target: '_self',
      },
      items: [
        { to: "/tags", label: "Tags", position: "left" },
        { to: "/archive", label: "Archive", position: "left" },
        {
          href: "https://github.com/gendalf9/gendalf9.net",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://planet.moe/@gendalf9",
          label: "Mastodon",
          position: "right",
        },
        {
          href: "https://twitter.com/gendalf9",
          label: "Twitter",
          position: "right",
        },
      ]
    },
    colorMode:
    {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    }
  }
};

module.exports = config;