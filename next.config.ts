import type { NextConfig } from "next";

const uploads = "/wp-content/uploads";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: { qualities: [75] },
  async redirects() {
    // Old WordPress URLs. The pages kept their paths (/about/ → /about is Next's own trailing-slash 308).
    return [
      { source: `${uploads}/2025/10/2024-ION-Insurance-Compnay-Inc.-Annual-Report.pdf`, destination: "/reports/ion-insurance-annual-report-2024.pdf", permanent: true },
      { source: `${uploads}/2025/10/2023-ION-Insurance-Company-Inc-Annual-Report.pdf`, destination: "/reports/ion-insurance-annual-report-2023.pdf", permanent: true },
      { source: `${uploads}/2024/03/2023-Ion-Insurance-Company-Inc.pdf`, destination: "/reports/ion-insurance-management-report-2023.pdf", permanent: true },
      { source: `${uploads}/2024/03/Ion-Insurance-Inc-Annual-Report-2022.pdf`, destination: "/reports/ion-insurance-annual-report-2022.pdf", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap-:rest(.*)", destination: "/sitemap.xml", permanent: true },
      { source: "/contact", destination: "/connect", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/hello-world", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
