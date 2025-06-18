import { Link } from "@remix-run/react";
import { Star } from "lucide-react";
import type { Post } from "~/types/blog";
import { appConfig } from '../appConfig.js';

interface RecipeCardProps {
  post: Post;
  loading?: "lazy" | "eager";
}

export default function RecipeCard({ post, loading = "eager" }: RecipeCardProps) {
  const imageUrl = post.frontmatter['cover-md'] || post.frontmatter.cover || post.firstImage || appConfig.defaultImages.projectCard;
  const rating = post.rating || appConfig.defaults.rating;
  const reviewCount = post.reviewCount || appConfig.defaults.reviewCount;
  const avgRating = post.avgRating || appConfig.defaults.avgRating;

  return (
    <div className="group cursor-pointer">
      <Link to={`/${post.slug}`} prefetch="viewport">
        {/* Image */}
        <div className="aspect-[4/3] mb-3 overflow-hidden rounded-lg bg-gray-400">
          <img
            src={imageUrl}
            alt={post.frontmatter.title || post.frontmatter.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={loading}
          />
        </div>
        
        {/* Rating and Reviews */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {reviewCount} reviews - {avgRating} rating
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.frontmatter.title || post.frontmatter.name}
        </h3>
      </Link>
    </div>
  );
}