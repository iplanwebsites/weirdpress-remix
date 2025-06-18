import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import { appConfig } from '../appConfig.js';

interface ProjectCardProps {
  post: Post;
  loading?: "lazy" | "eager";
}

export default function ProjectCard({ post, loading = "lazy" }: ProjectCardProps) {
  const imageUrl = post.frontmatter['cover-md'] || post.frontmatter.cover || post.firstImage || appConfig.defaultImages.projectCard;
  const year = post.frontmatter.year || post.frontmatter.edition || new Date().getFullYear();
  const photographer = post.frontmatter.photographer || post.frontmatter.artistName || post.frontmatter.author || 'Unknown';
  const photographerPic = post.frontmatter.photographer_portrait || post.frontmatter.artistPic || null;

  return (
    <div className="project-card group cursor-pointer">
      {/* Image with frame effect */}
      <Link to={`/${year}/${post.slug}`} prefetch="viewport" className="block">
        <div className="frame overflow-hidden">
          <div className="aspect-[3/2] relative">
            <img
              src={imageUrl}
              alt={post.title || post.frontmatter.title || post.frontmatter.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading={loading}
            />
          </div>
        </div>
      </Link>
      
      {/* Title */}
      <Link to={`/${year}/${post.slug}`} prefetch="viewport">
        <h3 className="text-lg font-semibold mt-3 mb-1 text-gray-900 dark:text-white hover:underline">
          {post.title || post.frontmatter.title || post.frontmatter.name}
        </h3>
      </Link>
      
      {/* Photographer info */}
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        {photographerPic && (
          <img
            src={photographerPic}
            alt={photographer}
            className="w-5 h-5 rounded-full object-cover mr-2 border border-gray-300 dark:border-gray-600"
            loading="lazy"
          />
        )}
        <span>{photographer}</span>
        {year && <span className="ml-2">• {year}</span>}
      </div>
    </div>
  );
}