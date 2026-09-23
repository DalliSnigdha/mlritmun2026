/* The Google Fonts stylesheet is linked directly from src/app/layout.tsx and
 * loaded by the browser — this project intentionally does not use next/font,
 * so a build never depends on reaching fonts.googleapis.com. Useful on
 * locked-down campus networks and in CI. */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
