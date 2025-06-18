import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import { appConfig } from '../appConfig.js';
import { isProject } from '~/lib/postUtils.js';

interface SearchCardProps {
  post: Post;
  loading?: "lazy" | "eager";
}

export default function SearchCard({ post, loading = "eager" }: SearchCardProps) {
  const imageUrl = post.frontmatter['cover-md'] || post.frontmatter.cover || post.firstImage || appConfig.defaultImages.projectCard;
  const isProjectPost = isProject(post);
  const year = post.frontmatter.year || post.frontmatter.edition || new Date().getFullYear();
  const linkPath = isProjectPost ? `/${year}/${post.slug}` : `/${post.slug}`;
  const photographer = post.frontmatter.photographer || '';

  return (
    <div className="group cursor-pointer">
      <Link to={linkPath} prefetch="viewport" className="block">
        {/* Image */}
        <div className="aspect-[4/3] mb-3 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={post.frontmatter.title || post.frontmatter.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={loading}
          />
        </div>
      </Link>
      
      {/* Photographer for projects */}
      {isProjectPost && photographer && (
        <div className="mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            by {photographer}
          </span>
        </div>
      )}
      
      {/* Category for non-projects */}
      {!isProjectPost && post.frontmatter.category && (
        <div className="mb-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
            {post.frontmatter.category}
          </span>
        </div>
      )}
      
      {/* Title */}
      <Link to={linkPath} prefetch="viewport">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:underline">
          {post.frontmatter.title || post.frontmatter.name}
        </h3>
      </Link>
    </div>
  );
}