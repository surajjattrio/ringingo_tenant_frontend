/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL_TENANT || '',
    TENANT_PORTAL_DOMAIN: process.env.NEXT_PUBLIC_TENANT_PORTAL_DOMAIN || '',
    SIDEPANEL_1: process.env.NEXT_PUBLIC_SIDEPANEL_1,
    SIDEPANEL_2: process.env.NEXT_PUBLIC_SIDEPANEL_2,
    SIDEPANEL_3: process.env.NEXT_PUBLIC_SIDEPANEL_3,
    FOOTER: process.env.NEXT_PUBLIC_FOOTER,
    TITLE: process.env.NEXT_PUBLIC_TITLE,
    DESCRIPTION: process.env.NEXT_PUBLIC_DESCRIPTION,
    EXPANDED_LOGO: process.env.NEXT_PUBLIC_EXPANDED_LOGO,
    COLLAPSED_LOGO: process.env.NEXT_PUBLIC_COLLAPSED_LOGO,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    WSS_URL: process.env.NEXT_PUBLIC_WSS_URL,
    ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || '',
  },
   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
