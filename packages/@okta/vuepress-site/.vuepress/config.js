const guidesInfo = require('./scripts/build-guides-info');
const overviewPages = require('./scripts/build-overview-pages');
const findLatestWidgetVersion = require('./scripts/findLatestWidgetVersion');
const convertReplacementStrings = require('./scripts/convert-replacement-strings');
const axios = require('axios');
const { parseString } = require('xml2js');
const signInWidgetMajorVersion = 7;

const WIDGET_VERSION = findLatestWidgetVersion(signInWidgetMajorVersion);

// Cypress tests fail with the OneTrust and Adobe scripts. Creating this wrapper
// to conditionally skip them on localhost.
function getOneTrustAndAdobeScripts() {
    let domainScriptId = process.env.DEPLOY_ENV === 'prod' ?
        'ac20316c-ea73-4ca8-8b3b-be2d16672166' :
        'ac20316c-ea73-4ca8-8b3b-be2d16672166-test';
    let src = process.env.DEPLOY_ENV === 'prod' ?
        "https://assets.adobedtm.com/6bb3f7663515/7ce314d1f3c9/launch-2f9b28f7d70e.min.js" :
        "https://assets.adobedtm.com/6bb3f7663515/7ce314d1f3c9/launch-f81506449be8-staging.min.js";

    let scriptSource = '(' + function loadScripts() {
        function addScript(source, inlineCode, attributes) {
            var head = document.getElementsByTagName('head')[0];
            var js = document.createElement("script");
            if (inlineCode) {
                js.innerHTML = source;
            } else if (source) {
                js.src = source;
            }
            attributes && Object.keys(attributes).forEach((key) => {
                js.setAttribute(key, attributes[key]);
            });
            head.appendChild(js);
        }

        if (window.location.hostname === 'localhost') {
            return;
        }

        addScript("https://cdn.cookielaw.org/scripttemplates/otSDKStub.js", null, {"data-domain-script" : "${domainScriptId}"});
        addScript(null, "function OptanonWrapper() { } console.log('OneTrust script loaded'); ");
        addScript("${src}");
    } + ')()';
    scriptSource = scriptSource.replace('${domainScriptId}', domainScriptId);
    scriptSource = scriptSource.replace('${src}', src);

    return ['script', {}, scriptSource];
}

function configUris() {
  switch (process.env.DEPLOY_ENV) {
    case 'prod':
      return {
        baseUri: 'https://www.okta.com',
        baseUriSocial: 'https://okta-devok12.okta.com',
        campaignId: '701F0000000mDmxIAE',
        orgPlan: 'Integrator',
        idps: {
          github: '0oayfl0lW6xetjKjD5d5',
          google: '0oay75bnynuF2YStd5d5',
        }
      }
    case 'test':
    default:
      return {
        baseUri: 'https://okta-next-test.oktaweb.dev',
        baseUriSocial: 'https://okta-dev-parent.trexcloud.com',
        campaignId: '701F0000000mDmxIAE',
        orgPlan: 'Integrator',
        idps: {
          github: '0oa3jobx2bBlylNft0g7',
          google: '0oa3jaktbqkiwCthn0g7',
        }
      }
  }
}

module.exports = ctx => ({
  dest: 'dist',
  theme: "@okta/vuepress-theme-prose",
  /**
   * Custom head elements here
   */
  head: [
    ['link', { rel: 'stylesheet', href: 'https://static.cloud.coveo.com/searchui/v2.8959/14/css/CoveoFullSearch.min.css', integrity: 'sha512-DzuDVtX/Dud12HycdAsm2k9D1UQ8DU7WOj7cBRnSsOKQbKfkI94g0VM9hplM0BkQ0VXdDiQYU9GvUzMmw2Khaw==', crossorigin: 'anonymous' }],
    ['script', { class: 'coveo-script', src: 'https://static.cloud.coveo.com/searchui/v2.8959/14/js/CoveoJsSearch.Lazy.min.js', integrity: 'sha512-RV1EooPduQhwl0jz+hmjBw/nAtfeXNm6Dm/hlCe5OR1jAlG4RErUeYfX1jaaM88H8DiyCJDzEWZkOR0Q13DtrA==', crossorigin: 'anonymous', defer: true}],
    ['script', { src: 'https://geoip-js.com/js/apis/geoip2/v2.1/geoip2.js'}],
    ['link', { rel: 'apple-touch-icon', sizes:'180x180', href: '/favicon/favicon.png' }],
    ['link', { rel: 'icon', type:"image/png", href: '/favicon/favicon.png' }],
    ['link', { rel: 'icon', type:"image/svg", sizes:"32x32",  href: '/favicon/favicon.svg' }],
    ['link', { rel: 'icon', type:"image/svg", sizes:"16x16",  href: '/favicon/favicon.svg' }],
    ['link', { rel: 'manifest',  href: '/favicon/manifest.json' }],
    ['link', { rel: 'mask-icon',  href: '/favicon/favicon.png' }],
    ['link', { rel: 'preload', href: 'https://use.typekit.net/osg6paw.css', as: 'style', crossorigin: true}],
    ['link', { rel: 'stylesheet', href: 'https://use.typekit.net/osg6paw.css', crossorigin: true}],
    ['meta', { name: 'msapplication-config',  content: '/favicon/browserconfig.xml' }],
    ['meta', { 'http-equiv': 'XA-UA-Compatible', content: 'IE=edge'}],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0'}],

    /**
     * Header scripts for typekit, GA, GTM (WIP)
     */
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];

      var isProduction = window.location.hostname === 'developer.okta.com';
      if (isProduction) {

        // START Google Tag Manager - main container
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KXMLV58');
        // END Google Tag Manager

      }
    `],
    getOneTrustAndAdobeScripts(),
  ],
  title: "Okta Developer",
  description: "Secure, scalable, and highly available authentication and user management for any app.",
  scss: {
    quietDeps: true
  },

  /**
   * Global theme config
   */
  themeConfig: {

    /**
     * URI config
     */
    uris: configUris(),

    /**
     * CAPTCHA config
     */
    captcha: {
      production: '6LeaS6UZAAAAADd6cKDSXw4m2grRsCpHGXjAFJcL',
      test: '6LcgkzYaAAAAAAgXBo2cLdct9D-kUtyCOgcyd5WW',
    },

    quickstarts: {
      clients: [
        { name: 'okta-sign-in-page', label: 'Okta Sign-In Page', serverExampleType: 'auth-code', default: true },
        { name: 'widget', label: 'Okta Sign-In Widget', serverExampleType: 'implicit', codeIconName: 'javascript' },
        { name: 'angular', label: 'Angular', serverExampleType: 'implicit' },
        { name: 'react', label: 'React', serverExampleType: 'implicit' },
        { name: 'vue', label: 'Vue', serverExampleType: 'implicit' },
        { name: 'android', label: 'Android', serverExampleType: 'implicit' },
        { name: 'ios', label: 'iOS', serverExampleType: 'implicit' },
        { name: 'react-native', label: 'React Native', serverExampleType: 'implicit', codeIconName: 'react' },
      ],
      servers: [
        { name: 'nodejs', label: 'Node JS', default: true, frameworks: [
            { name: 'express', label: 'Express.js', default: true },
            { name: 'generic', label: 'Generic Node' }
          ]
        },
        { name: 'java', label: 'Java', frameworks: [
            { name: 'spring', label: 'Spring', default: true },
            { name: 'generic', label: 'Generic Java' }
          ]
        },
        { name: 'php', label: 'PHP', frameworks: [
            { name: 'generic', label: 'Generic PHP', default: true }
          ]
        },
        { name: 'dotnet', label: '.NET', frameworks: [
            { name: 'aspnetcore', label: 'ASP.NET Core', default: true },
            { name: 'aspnet4', label: 'ASP.NET 4.x' }
          ]
        }
      ]
    },

    /**
     * Config used for primary header (TopNavigation)
     */
    home_url: 'https://developer.okta.com',
    search_url: 'https://developer.okta.com/search/',
    logo_svg: '<svg viewBox="0 0 431.9 151.4"><path d="M102.2 41.4c-21 0-38.1 17.1-38.1 38.1s17.1 38.1 38.1 38.1 38.1-17.1 38.1-38.1-17.1-38.1-38.1-38.1zm0 57.1c-10.5 0-19-8.5-19-19s8.5-19 19-19 19 8.5 19 19c.1 10.5-8.4 19-18.9 19.1 0 0-.1 0-.1-.1zM169.1 92.3c0-1.9 1.5-3.4 3.4-3.4.9 0 1.8.4 2.4 1 9.5 9.7 25.3 26.3 25.4 26.4.4.5.8.8 1.4.9l1.6.2h17.2c1.8 0 3.3-1.4 3.4-3.2 0-.8-.3-1.5-.8-2.2l-28.6-29.2-1.5-1.5c-3.2-3.9-2.9-5.4.8-9.3l22.6-25.1c1.1-1.4.8-3.5-.6-4.6-.6-.4-1.3-.7-2-.7h-17c-.6.2-1.1.5-1.5.9L175 64.4c-1.3 1.4-3.4 1.5-4.8.2-.7-.6-1.1-1.5-1.1-2.5V18.9c0-1.7-1.3-3-3-3h-13c-2.2 0-3.3 1.5-3.3 2.8v95.8c0 2.2 1.8 2.8 3.3 2.8h12.7c1.7.1 3.2-1.2 3.3-2.9V92.3zM273 114l-1.4-12.8c-.2-1.7-1.7-2.9-3.4-2.7h-.1l-2.9.2c-10.1 0-18.5-7.9-19-18V64.2c-.1-2 1.5-3.6 3.5-3.7h17c1.7-.1 3.1-1.5 3-3.2V45.2c0-2.3-1.5-3.6-2.8-3.6h-17.1c-1.9.1-3.5-1.5-3.6-3.4V18.9c-.1-1.7-1.5-3.1-3.2-3H230.2c-1.6-.1-3 1.1-3.1 2.7v62.2c.5 21 17.9 37.6 38.9 37 1.4 0 2.9-.2 4.3-.3 1.7-.3 2.9-1.8 2.7-3.5zM364.7 98c-10.8 0-12.4-3.8-12.4-18.3V44.8c0-1.8-1.4-3.2-3.2-3.2h-12.9c-1.8 0-3.2 1.4-3.3 3.2v1.6C314.6 36 291.3 42.5 281 60.8c-10.4 18.3-3.9 41.6 14.4 51.9 14 7.9 31.4 6.2 43.5-4.2 3.6 5.5 9.3 9.1 18.3 9.1 1.5 0 9.7.3 9.7-3.5v-13.6c.1-1.3-.9-2.4-2.2-2.5zm-50.5.6c-10.5 0-19-8.5-19-19s8.5-19 19-19 19 8.5 19 19-8.5 19-19 19zM19.4 74c2.2-1.9 4.1-4.1 5.7-6.6 3.5-5.3 5.4-11.5 5.2-17.9V27c0-4.9.9-8.4 2.7-10.5 1.8-2.1 4.8-3 9.2-3h12.6c1.2 0 2.1-.9 2.2-2.1V2.2C57 1 56 0 54.8 0H41.5c-7.8 0-12.9 2.1-18 7.6s-7.1 12.3-7.1 21.7v14.2c0 2.2-.1 4-.2 5.7v2.2c-.5 3.2-1.8 6.2-3.6 8.9C9.4 64.7 5.1 70.9.9 74l-.3.3-.2.3H.2v.3c-.1.3-.1.7 0 1v.3h.1l.2.3.3.3c4.2 3.1 8.5 9.3 11.3 13.7 1.8 2.7 3.1 5.7 3.6 8.9v2.2c.1 1.6.2 3.5.2 5.7v14.3c0 9.4 2.4 16.7 7.1 21.7s10.2 7.6 18 7.6h13.8c1.2 0 2.2-1 2.2-2.2V140c0-1.2-1-2.2-2.2-2.2H42.2c-4.4 0-7.5-1-9.2-3s-2.7-5.6-2.7-10.5v-22.4c.2-6.4-1.7-12.6-5.2-17.9-1.6-2.5-3.5-4.7-5.7-6.6-.9-.7-1.1-2-.4-2.9.2-.2.3-.3.4-.5zM412.5 74c-2.2-1.9-4.1-4.1-5.7-6.6-3.5-5.3-5.4-11.5-5.2-17.9V27c0-4.9-.9-8.4-2.7-10.5s-4.8-3-9.2-3h-12.6c-1.2 0-2.2-1-2.2-2.2V2.2c0-1.2 1-2.2 2.2-2.2h13.4c7.8 0 12.9 2.1 18 7.6s7.1 12.3 7.1 21.7v14.2c0 2.2.1 4 .2 5.7v2.2c.5 3.2 1.8 6.2 3.6 8.9 2.8 4.5 7.1 10.7 11.3 13.7l.3.3.2.3h.1v.3c.1.3.1.7 0 1v.3h-.1l-.2.3-.3.3c-4.2 3.1-8.5 9.3-11.3 13.7-1.8 2.7-3.1 5.7-3.6 8.9v2.2c-.1 1.6-.2 3.5-.2 5.7v14.3c0 9.4-2.4 16.7-7.1 21.7s-10.2 7.6-18 7.6h-13.4c-1.2 0-2.2-1-2.2-2.2V140c0-1.2 1-2.2 2.2-2.2h12.7c4.4 0 7.5-1 9.2-3s2.7-5.6 2.7-10.5v-22.4c-.2-6.3 1.6-12.6 5.1-17.9 1.6-2.5 3.5-4.7 5.7-6.6.9-.7 1.1-2 .4-2.9-.2-.2-.3-.3-.4-.5z"/></svg>',

    /**
     * Promo banner config
     */
    promo_banner: {
      show: false,
      promo_url: 'https://developer.okta.com/quickstart/',
      promo_text: 'Learn how to build your app on Okta, fast.',
      cta_text: 'QUICK STARTS'
    },

    editLink: {
      repo: 'okta/okta-developer-docs',
      repoLabel: 'Edit',
      editLinks: true,
      editLinkText: "Edit This Page On GitHub",
      docsDir: "packages/@okta/vuepress-site"
    },

    primary_left_nav: [
      { text: 'Community',
        children: [
          { text: 'Forum', link: 'https://devforum.okta.com' },
          { type: 'divider' },
          { type: 'icons',
            icons: [
              { text: 'GitHub', link: 'https://github.com/oktadev', icon: '<svg width="19" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.214 4.595a9.185 9.185 0 00-3.358-3.358C12.443.412 10.9 0 9.226 0 7.552 0 6.008.412 4.595 1.237a9.184 9.184 0 00-3.358 3.358C.412 6.008 0 7.552 0 9.225c0 2.01.587 3.818 1.76 5.424 1.173 1.606 2.689 2.717 4.546 3.333.217.04.377.012.48-.084a.47.47 0 00.157-.36l-.006-.649c-.004-.408-.006-.764-.006-1.069l-.276.048a3.52 3.52 0 01-.667.042 5.092 5.092 0 01-.835-.084 1.866 1.866 0 01-.805-.36 1.524 1.524 0 01-.528-.739l-.12-.276a3.003 3.003 0 00-.379-.613c-.172-.224-.346-.376-.522-.456l-.084-.06a.882.882 0 01-.156-.144.66.66 0 01-.108-.169c-.025-.056-.005-.102.06-.138.064-.036.18-.054.348-.054l.24.036c.16.032.358.128.595.289.236.16.43.368.582.624.185.328.407.579.667.75.26.173.522.26.787.26.264 0 .492-.021.684-.06.192-.04.373-.101.541-.181.072-.537.268-.95.588-1.238a8.224 8.224 0 01-1.23-.216 4.896 4.896 0 01-1.13-.468 3.233 3.233 0 01-.967-.805c-.256-.32-.466-.741-.63-1.261-.165-.521-.247-1.122-.247-1.802 0-.97.317-1.794.95-2.475-.297-.729-.269-1.545.083-2.45.233-.073.577-.018 1.033.162.457.18.791.334 1.004.462.212.128.382.237.51.325a8.53 8.53 0 012.307-.313 8.53 8.53 0 012.306.313l.457-.289c.312-.192.68-.368 1.104-.528.425-.16.75-.204.974-.132.36.905.392 1.721.096 2.45.632.68.949 1.506.949 2.475 0 .68-.082 1.283-.246 1.808-.164.524-.377.944-.637 1.26a3.36 3.36 0 01-.973.8 4.916 4.916 0 01-1.13.468 8.208 8.208 0 01-1.23.217c.416.36.624.929.624 1.705v2.535c0 .144.05.264.15.36.1.096.258.124.475.084 1.858-.617 3.373-1.728 4.547-3.333 1.173-1.606 1.76-3.414 1.76-5.424-.001-1.673-.414-3.217-1.238-4.63z"/></svg>' },
              { text: 'Twitter', link: 'https://twitter.com/OktaDev', icon: '<svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 0a9.001 9.001 0 000 18A9.001 9.001 0 009 0zm4.11 7.017c.003.089.005.178.005.267 0 2.73-2.078 5.878-5.877 5.878a5.847 5.847 0 01-3.167-.928 4.144 4.144 0 003.058-.856A2.068 2.068 0 015.2 9.943a2.056 2.056 0 00.934-.035 2.066 2.066 0 01-1.657-2.051c.278.154.597.247.935.258a2.064 2.064 0 01-.64-2.758A5.865 5.865 0 009.03 7.515a2.066 2.066 0 013.52-1.884c.47-.092.913-.264 1.312-.5a2.074 2.074 0 01-.909 1.142 4.12 4.12 0 001.187-.326 4.2 4.2 0 01-1.03 1.07z"/></svg>' },
              { text: 'YouTube', link: 'https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q/featured', icon: '<svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.879 10.372l2.928-1.686L7.878 7v3.372z"/><path d="M9 0a9.001 9.001 0 000 18A9.001 9.001 0 009 0zm5.624 9.009s0 1.825-.232 2.705a1.41 1.41 0 01-.991.992c-.88.231-4.401.231-4.401.231s-3.511 0-4.4-.24a1.41 1.41 0 01-.992-.992C3.376 10.835 3.376 9 3.376 9s0-1.825.232-2.705c.13-.482.519-.871.991-1.001C5.48 5.062 9 5.062 9 5.062s3.52 0 4.4.241c.482.13.862.51.992.992.241.88.232 2.714.232 2.714z"/></svg>' },
            ]
          }
        ]
      },
      { text: 'Blog', link: 'https://developer.okta.com/blog/' },
      { text: 'Pricing', link: 'https://www.okta.com/pricing/#customer-identity-products' },
    ],
    primary_right_nav: [
      { text: 'Okta Docs', target: '_blank', link: 'https://help.okta.com/' },
      { text: 'Okta.com', target: '_blank', link: 'https://www.okta.com/' },
      { text: 'Log in', target: '_blank', link: '/login/' },
    ],
    primary_doc_nav: [
      { text: 'Guides', link: '/docs/guides/' },
      { text: 'Concepts', link: '/docs/concepts/' },
      { text: 'Reference', link: '/docs/reference/' },
      { text: 'Languages & SDKs', link: '/code/' },
      { text: 'Release Notes', link: '/docs/release-notes/' },
    ],
    footer_nav: {
      need_support: {
        heading: 'Need Support?'
      },
      social: {
        heading: 'Social',
        items: [
          {  link: 'https://github.com/oktadev', target: '_self', icon: '<svg width="19" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.214 4.595a9.185 9.185 0 00-3.358-3.358C12.443.412 10.9 0 9.226 0 7.552 0 6.008.412 4.595 1.237a9.184 9.184 0 00-3.358 3.358C.412 6.008 0 7.552 0 9.225c0 2.01.587 3.818 1.76 5.424 1.173 1.606 2.689 2.717 4.546 3.333.217.04.377.012.48-.084a.47.47 0 00.157-.36l-.006-.649c-.004-.408-.006-.764-.006-1.069l-.276.048a3.52 3.52 0 01-.667.042 5.092 5.092 0 01-.835-.084 1.866 1.866 0 01-.805-.36 1.524 1.524 0 01-.528-.739l-.12-.276a3.003 3.003 0 00-.379-.613c-.172-.224-.346-.376-.522-.456l-.084-.06a.882.882 0 01-.156-.144.66.66 0 01-.108-.169c-.025-.056-.005-.102.06-.138.064-.036.18-.054.348-.054l.24.036c.16.032.358.128.595.289.236.16.43.368.582.624.185.328.407.579.667.75.26.173.522.26.787.26.264 0 .492-.021.684-.06.192-.04.373-.101.541-.181.072-.537.268-.95.588-1.238a8.224 8.224 0 01-1.23-.216 4.896 4.896 0 01-1.13-.468 3.233 3.233 0 01-.967-.805c-.256-.32-.466-.741-.63-1.261-.165-.521-.247-1.122-.247-1.802 0-.97.317-1.794.95-2.475-.297-.729-.269-1.545.083-2.45.233-.073.577-.018 1.033.162.457.18.791.334 1.004.462.212.128.382.237.51.325a8.53 8.53 0 012.307-.313 8.53 8.53 0 012.306.313l.457-.289c.312-.192.68-.368 1.104-.528.425-.16.75-.204.974-.132.36.905.392 1.721.096 2.45.632.68.949 1.506.949 2.475 0 .68-.082 1.283-.246 1.808-.164.524-.377.944-.637 1.26a3.36 3.36 0 01-.973.8 4.916 4.916 0 01-1.13.468 8.208 8.208 0 01-1.23.217c.416.36.624.929.624 1.705v2.535c0 .144.05.264.15.36.1.096.258.124.475.084 1.858-.617 3.373-1.728 4.547-3.333 1.173-1.606 1.76-3.414 1.76-5.424-.001-1.673-.414-3.217-1.238-4.63z"/></svg>' },
          { link: 'https://twitter.com/OktaDev', target: '_self', icon: '<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.6702 2.27734C17.9905 2.57812 17.2639 2.78125 16.4983 2.875C17.2796 2.40625 17.8811 1.66406 18.1624 0.78125C17.4319 1.21484 16.6233 1.53125 15.76 1.69922C15.0686 0.960937 14.0843 0.5 12.9983 0.5C10.9085 0.5 9.21707 2.19531 9.21707 4.28516C9.21707 4.58203 9.24832 4.87109 9.31473 5.14844C6.1702 4.99219 3.38113 3.48438 1.51785 1.19141C1.19363 1.75 1.00613 2.40234 1.00613 3.09375C1.00613 4.40625 1.67801 5.56641 2.69363 6.24609C2.06863 6.23047 1.4827 6.05859 0.974884 5.77344V5.82031C0.974884 7.65625 2.27957 9.18359 4.01004 9.53125C3.69363 9.61719 3.3577 9.66406 3.01395 9.66406C2.77176 9.66406 2.53348 9.64062 2.30301 9.59375C2.78348 11.0977 4.18192 12.1914 5.83817 12.2227C4.5452 13.2383 2.91238 13.8438 1.13895 13.8438C0.834259 13.8438 0.533478 13.8242 0.236603 13.7891C1.90457 14.875 3.89285 15.5 6.02567 15.5C12.9905 15.5 16.7952 9.73047 16.7952 4.72656C16.7952 4.5625 16.7913 4.39844 16.7835 4.23828C17.5218 3.70312 18.1624 3.03906 18.6702 2.27734Z" fill="#FFFEFA"/></svg>' },
          { link: 'https://www.youtube.com/c/oktadev', target: '_self', icon: '<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2189_11938)"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3916 4.06438C19.7034 4.37475 19.9281 4.7617 20.0431 5.18637C20.4514 6.74547 20.4596 10.0003 20.4596 10.0003C20.4596 10.0003 20.4596 13.2552 20.0431 14.8143C19.9271 15.2377 19.702 15.6233 19.3902 15.9325C19.0785 16.2416 18.691 16.4635 18.2666 16.5759C16.7075 16.9941 10.4514 16.9941 10.4514 16.9941C10.4514 16.9941 4.19683 16.9941 2.63772 16.5825C2.21389 16.4685 1.82745 16.2452 1.51712 15.9349C1.20679 15.6246 0.983464 15.2381 0.869531 14.8143C0.451355 13.2552 0.451355 10.0003 0.451355 10.0003C0.451355 10.0003 0.451355 6.74547 0.869531 5.18637C0.983464 4.76254 1.20679 4.3761 1.51712 4.06576C1.82745 3.75543 2.21389 3.53211 2.63772 3.41818C4.19518 3 10.4514 3 10.4514 3C10.4514 3 16.7059 3 18.2666 3.41818C18.6918 3.53115 19.0798 3.75401 19.3916 4.06438ZM13.6484 10.0003L8.45087 7.00061V13L13.6484 10.0003Z" fill="#FFFEFA"/></g><defs><clipPath id="clip0_2189_11938"><rect width="20" height="20" fill="white" transform="translate(0.451355)"/></clipPath></defs></svg>' },
          { link: 'https://developer.okta.com/feed.xml', target: '_self', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none"><circle cx="9.451" cy="9" r="9" fill="#FFFEFA"/><path fill="#191919" d="M15.415 9.809c-.811-3.268-3.971-5.984-7.452-6.406-.736-.088-1.41.412-1.5 1.114-.094.702.426 1.348 1.163 1.438 2.371.285 4.622 2.22 5.176 4.45.063.255.205.482.408.658.328.282.78.392 1.209.295.72-.164 1.166-.859.996-1.55Z"/><path fill="#191919" d="M11.42 10.924c-.395-1.76-2.009-3.295-3.701-3.522-.616-.083-1.18.381-1.259 1.034-.077.651.364 1.247.976 1.333.771.103 1.615.904 1.795 1.707.053.237.171.449.342.61.275.262.654.365 1.013.274.604-.152.978-.796.835-1.436ZM8.03 12.817a1.33 1.33 0 1 0-1.98-1.777 1.33 1.33 0 0 0 1.98 1.777Z"/></svg>' },
        ]
      },
      contact: {
        heading: 'Contact & Legal',
        items: [
          { text: 'Contact our team', link: 'https://www.okta.com/contact/', target: '_self' },
          { text: 'Contact sales', link: 'https://www.okta.com/contact-sales/', target: '_self' },
          { text: 'Developer Service terms', link: '/terms/' },
          { text: 'Site terms', link: 'https://www.okta.com/terms-of-service/' },
			 { text: 'Privacy policy', link: 'https://www.okta.com/privacy-policy/', target: '_self' },
			 { text: 'Copyright & trademarks', link: '/copyright/' },
        ]
      },
      more: {
        heading: 'More information',
        items: [
          { text: 'Integrate with Okta', link: '/okta-integration-network/' },
          { text: 'Pricing', link: 'https://www.okta.com/pricing/#workforce-identity-pricing' },
          { text: '3rd-party notes', link: '/3rd_party_notices/' },
           { text: 'Auth0', link: 'https://developer.auth0.com/' },
          { text: 'Archive', link:'/archive/' },
        ]
      },
      websites: {
        items: [
          { text: 'OKTA.COM', link: 'https://www.okta.com/', description: 'Products, case studies, resources' },
          { text: 'HELP CENTER', link: 'https://support.okta.com/help/s/', description: 'Knowledgebase, roadmaps, and more' },
          { text: 'TRUST', link: 'https://trust.okta.com/', description: 'System status, security, compliance' },
        ]
      }
    },

    company_logos: [
      { name: 'Major League Baseball', icon: '/img/logos/baseball.svg' },
      { name: 'Splunk', icon: '/img/logos/splunk.svg' },
      { name: 'Adobe', icon: '/img/logos/adobe.svg' },
      { name: 'JetBlue', icon: '/img/logos/jetblue.svg' },
      { name: 'Experian', icon: '/img/logos/experian.svg' },
    ],

    forum_url: 'https://devforum.okta.com/',
    copyright_text: `Copyright © ${new Date().getUTCFullYear() || '2022'} Okta. All rights reserved.`
  },

  chainWebpack(config) {
    config.module
      .rule('string-replacement')
      .test(/(\.md|\.vue)$/)
      .use('string-replace-loaded')
      .loader('string-replace-loader')
      .options({
        multiple: convertReplacementStrings({
          /* KEYS HERE GET WRAPPED IN '-=OKTA_REPLACE_WITH_XXX=-'
           *
           * Changes WILL require restarting `yarn dev` :(
           */
          WIDGET_VERSION: WIDGET_VERSION,
          TEST_JUNK: 'this is a test replacement', // Leave for testing
        })
      });
  },

  evergreen: false,

  markdown: {
    extendMarkdown: md => {
      md.use(require('markdown-it-attrs'), {
        leftDelimiter: '[[',
        rightDelimiter: ']]'
      })
    },
    anchor: {
      permalinkBefore: false,
      permalinkSymbol: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 01-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0120.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0020.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 00-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"/></svg>',
      permalinkClass: 'header-anchor header-link',
      level: 2
    }
  },

  plugins: {
    'code-copy': {},
    'vuepress-plugin-chunkload-redirect': {},
    'sitemap': {
      hostname: 'https://developer.okta.com',
      outFile: 'docs-sitemap.xml',
      exclude: [
        '/test_page/'
      ]
    },
    'robots': {
      host: 'https://developer.okta.com',
      sitemap: '/sitemap_index.xml',
      policies: [
        {
          userAgent: '*',
          crawlDelay: 10,
          disallow: [
              //'/docs/guides/third-party-risk-integration/', //EA release of Risk APIs and Guide 2021.08.0
              //'/docs/reference/api/risk-providers/',
              //'/docs/reference/api/risk-events/',
              '/docs/guides/migrate-to-oie/',
              '/docs/guides/manage-orgs-okta-aerial/',
              '/docs/release-notes/2016',
              '/docs/release-notes/2017',
              '/docs/release-notes/2018',
              '/docs/release-notes/2019',
              '/docs/release-notes/2020',
              '/docs/release-notes/2021',
              '/docs/release-notes/2021-okta-identity-engine',
              '/docs/release-notes/2022',
              '/docs/release-notes/2022-okta-identity-engine',
              //'/docs/guides/oie-upgrade-add-sdk-to-your-app/-/main/',
              //'/docs/guides/oie-upgrade-api-sdk-to-oie-sdk/-/main/',
              //'/docs/guides/oie-upgrade-add-sdk-to-your-app/',
              //'/docs/guides/oie-upgrade-api-sdk-to-oie-sdk/',
              //'/docs/guides/oie-upgrade-overview/',
              //'/docs/guides/oie-upgrade-planning-embedded-upgrades/',
              //'/docs/guides/oie-upgrade-sessions-api/',
              //'/docs/guides/oie-upgrade-sign-in-widget/',
              //'/docs/guides/oie-upgrade-sign-in-widget-deprecated-methods/',
              //'/docs/guides/oie-upgrade-sign-in-widget-i18n/',
              //'/docs/guides/oie-upgrade-sign-in-widget-styling/',
              //'/docs/guides/oie-upgrade-mfa-enroll-policy/',
              '/docs/reference/api/archive-myaccount/',
              '/docs/reference/api/myaccount-migration/',
              '/docs/reference/csi-delauth-hook/',
              //'/docs/reference/api/inline-hooks-lea/',
              //'/docs/reference/api/hook-keys/'
              '/docs/guides/configure-amr-claims-mapping/',
              '/docs/api/openapi/asa/asa/overview/',
              '/docs/api/openapi/opa/opa/overview/'
          ]
        }
      ]
    }
  },

  extraWatchFiles: [
    '.vuepress/nav/*',
  ],

  additionalPages: [
    ...guidesInfo.additionalPagesForGuides(),
    ...overviewPages()
  ],

  async extendPageData ($page) {
    const {
      _filePath,           // file's absolute path
      _computed,           // access the client global computed mixins at build time, e.g _computed.$localePath.
      _content,            // file's raw content string
      _strippedContent,    // file's content string without frontmatter
      key,                 // page's unique hash key
      frontmatter,         // page's frontmatter object
      regularPath,         // current page's default link (follow the file hierarchy)
      path,                // current page's real link (use regularPath when permalink does not exist)
    } = $page

    // add redir url for main guide pages
    let found = guidesInfo.guideInfo[path];

    if (path.startsWith('/docs/reference/api/')) {
        frontmatter.sitemap = {
          exclude: true
        };
    }

    if (path.endsWith('/main/')) {
      // For paths such as /docs/guides/{guide-name}/main/ where the guide has stack selector/frameworks
      let mainPagePath = path.slice(0, -'main/'.length);;
      let mainPageGuide = guidesInfo.guideInfo[mainPagePath];
      /*
        The current page might have some frameworks which are displayed in the stack selector. But `guideInfo` doesn't give the frameworks
        for the pages ending with `/main` but provides frameworks for the parent page of this page. For eg. We'll get the list of frameworks for
        `/docs/guides/{guide-folder-name}/{specific-selection}/main/` in its parent page, which is `/docs/guides/{guide-folder-name}/`.

        Example guideInfo for the parent page of `/docs/guides/authenticators-okta-verify/main/` which is `/docs/guides/authenticators-okta-verify/`
        {
          title: 'Okta Verify (Push/OTP) integration guide',
          layout: 'Guides',
          sections: [ 'main' ],
          guide: 'authenticators-okta-verify',
          frameworks: [ 'aspnet', 'java', 'nodeexpress' ],
          mainFramework: 'aspnet'
        }

        If the parent page of current page guide has frameworks(stack selector) then we don't need to add the current page to sitemap
        but only add the pages with frameworks in the sitemap. Hence, excluding the current page from sitemap here. Refer - OKTA-745577
      */
      if (mainPageGuide && mainPageGuide.guide && mainPageGuide.sections && mainPageGuide.mainFramework) {
        frontmatter.sitemap = {
          exclude: true
        };
      }

      // For paths such as /docs/guides/{guide-name}/-/main where the guide doesn't have stack selector/frameworks

      mainPagePath = path.slice(0, -'-/main/'.length);
      mainPageGuide = guidesInfo.guideInfo[mainPagePath];
      /*
        For paths such as /docs/guides/{guide-name}/-/main where there are no frameworks, we need to exclude the current page from sitemap

        Eg. For path - `/docs/guides/build-api-integration/-/main/`, the mainPageGuide will be

        {
          title: 'Build an API service integration',
          excerpt: 'Learn how to build and register an API service integration with the Okta Integration Network.',
          meta: [
            {
              name: 'description',
              content: 'Use this guide to learn how to build, test, and submit an API service integration to the Okta Integration Network.'
            }
          ],
          layout: 'Guides',
          sections: [ 'main' ],
          guide: 'build-api-integration',
          frameworks: []
        }
      */
      if (mainPageGuide && mainPageGuide.guide && mainPageGuide.sections && (!mainPageGuide.frameworks || !mainPageGuide.mainFramework)) {
        frontmatter.sitemap = {
          exclude: true
        };
      }
    }

    if(found && found.guide && found.sections) {
      if(found.mainFramework) {
        $page.redir = `/docs/guides/${found.guide}/${found.mainFramework}/${found.sections[0]}/`
      } else {
        $page.redir = `/docs/guides/${found.guide}/${found.sections[0]}/`
      }
      // Since current page is being redirected to the above links, we don't need to include current page in the sitemap.
      frontmatter.sitemap = {
        exclude: true
      };
    }

    if(!frontmatter.canonicalUrl) {
      frontmatter.canonicalUrl = `https://developer.okta.com${path}`;
    }

    if (path === '/') {
      $page.newsFeedDataJson = null;
      let response;
      try {
        response = await axios.get('https://developer.okta.com/feed.xml');
      } catch {
        $page.newsFeedDataJson = null;
      }

      if (response && response.data) {
        parseString(response.data, { compact: true, spaces: 4 }, (err, jsonObj) => {
          if (err) {
            return;
          }

          $page.newsFeedDataJson = jsonObj;
        });
      }
    }

    // mark all generated non-root stack-enabled pages(i.e. those containing stack name in the URL)
    // to display StackSelector for
    if(found && !found.guide && !found.sections && found.mainFramework) {
      $page.hasStackContent = true
    }
  },
  async ready() {
    if (process.env.DEPLOY_ENV && process.env.DEPLOY_ENV === 'test') {
      ctx.pages.forEach((page) => {
        // We adding meta tag `robots` for all non-prod versions of the site
        // to be able to exclude test envs from browser search.
        if (!page.frontmatter['meta']) {
          page.frontmatter['meta'] = []
        }
        page.frontmatter['meta'].push({ name: 'robots', content:'noindex,nofollow'});
      });
    }
  },
})
