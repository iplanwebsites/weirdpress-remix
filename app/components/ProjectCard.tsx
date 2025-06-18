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
  const artistName = post.frontmatter.artistName || post.frontmatter.author || 'Unknown';
  const artistPic = post.frontmatter.artistPic || null;

  return (
    <div className="project-card group cursor-pointer">
      <Link to={`/${post.slug}`} prefetch="viewport">
        {/* Image with frame effect */}
        <div className="frame overflow-hidden bg-accent">
          <div className="aspect-[3/2] relative">
            <img
              src={imageUrl}
              alt={post.frontmatter.title || post.frontmatter.name}
              className="h-full w-full object-cover"
              loading={loading}
            />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold mt-3 mb-1 text-white">
          {post.frontmatter.title || post.frontmatter.name}
        </h3>
        
        {/* Artist info */}
        <div className="flex items-center text-sm opacity-50">
          {artistPic && (
            <img
              src={artistPic}
              alt={artistName}
              className="w-5 h-5 rounded-full object-cover mr-2 border border-black"
              loading="lazy"
            />
          )}
          <span>{artistName}</span>
          {year && <span className="ml-2">• {year}</span>}
        </div>
      </Link>
    </div>
  );
}