import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CommandKit',
  tagline: 'A Discord.js handler',
  favicon: 'img/favicon.ico',
  url: 'https://commandkit.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
          editUrl:
            'https://github.com/underctrl-io/commandkit/tree/main/apps/website/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    algolia: {
      appId: 'S9ZEIJ6SBS',
      apiKey: '6f7582f462a448cf1f47a56901595e6e',
      indexName: 'commandkit-js',
      contextualSearch: true,
      insights: false,
    },
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'CommandKit',
      logo: {
        alt: 'CommandKit logo',
        src: 'img/logo_128.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guide',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'api',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/underctrl-io/commandkit',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://ctrl.lol/discord',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `
      <a
        href="https://www.netlify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto"
      >
        <img
          src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg"
          alt="Deploys by Netlify"
        />
      </a>
      <br/>
      <br/>
      MIT © ${new Date().getFullYear()} CommandKit`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    function tailwindPlugin(context, options) {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins = [
            require('postcss-import'),
            require('tailwindcss'),
            require('autoprefixer'),
          ];
          return postcssOptions;
        },
      };
    },
  ],
};

export default config;
