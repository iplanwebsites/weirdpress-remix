import type { LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import { appConfig } from "~/appConfig";

export const loader: LoaderFunction = async () => {
  try {
    const posts = await repo.getAllPosts();
    const publicPosts = posts.filter(post => post.frontmatter?.public !== false);
    
    const sitemap = generateSitemap(publicPosts);
    
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
};

function generateSitemap(posts: any[]) {
  const staticPages = [
    { url: "", changefreq: "daily", priority: "1.0" },
    { url: "/blog", changefreq: "daily", priority: "0.9" },
    { url: "/projects", changefreq: "daily", priority: "0.9" },
    { url: "/projects/all", changefreq: "weekly", priority: "0.8" },
    { url: "/projects/articles", changefreq: "weekly", priority: "0.8" },
    { url: "/search", changefreq: "monthly", priority: "0.6" },
  ];

  const currentDate = new Date().toISOString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${appConfig.siteUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add dynamic posts
  posts.forEach(post => {
    const lastmod = post.frontmatter?.date ? new Date(post.frontmatter.date).toISOString() : currentDate;
    const priority = post.frontmatter?.featured ? "0.9" : "0.7";
    
    xml += `
  <url>
    <loc>${appConfig.siteUrl}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  // Add year-based project pages
  const years = [...new Set(posts
    .filter(post => post.frontmatter?.year)
    .map(post => post.frontmatter.year)
  )];

  years.forEach(year => {
    xml += `
  <url>
    <loc>${appConfig.siteUrl}/${year}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}