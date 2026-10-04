import type { APIRoute } from 'astro';

export const prerender = true;

const siteUrl = 'https://pickplay.pages.dev';
const paths = ['/', '/play/', '/games/', '/games/random/', '/games/paper/', '/class/', '/party/'];

export const GET: APIRoute = () => {
  const urls = paths
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
