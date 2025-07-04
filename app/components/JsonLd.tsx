import type { Post } from "~/types/blog";
import { appConfig } from "~/appConfig";

interface JsonLdProps {
  post: Post;
}

export default function JsonLd({ post }: JsonLdProps) {
  const publishedDate = post.frontmatter?.date ? new Date(post.frontmatter.date).toISOString() : new Date().toISOString();
  const modifiedDate = publishedDate; // Could be enhanced to track actual modification dates
  
  const imageUrl = post.frontmatter['cover-lg'] || 
                   post.frontmatter.cover || 
                   post.firstImage || 
                   appConfig.seo.ogImage;
  
  const absoluteImageUrl = imageUrl?.startsWith('http') 
    ? imageUrl 
    : `${appConfig.siteUrl}${imageUrl}`;

  const authorName = post.frontmatter.photographer || appConfig.author.name;
  const authorUrl = post.frontmatter.photographer 
    ? `${appConfig.siteUrl}/${post.slug}#photographer-full` 
    : appConfig.siteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.frontmatter.title || post.title,
    "description": post.frontmatter.description || post.firstParagraphText || post.plain?.substring(0, 160),
    "image": absoluteImageUrl,
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": appConfig.siteName,
      "url": appConfig.siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${appConfig.siteUrl}${appConfig.defaultImages.siteLogo}`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${appConfig.siteUrl}/${post.slug}`
    },
    "url": `${appConfig.siteUrl}/${post.slug}`,
    "keywords": post.frontmatter.tags?.join(', ') || post.frontmatter.category,
    "articleSection": post.frontmatter.category || "Photography"
  };

  // Add additional schema for photojournalism articles
  if (post.frontmatter.photographer) {
    structuredData["@type"] = "NewsArticle";
    structuredData["articleBody"] = post.plain;
  }

  // Add rating if available
  if (post.rating) {
    structuredData["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": post.rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": post.reviewCount || 1
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}