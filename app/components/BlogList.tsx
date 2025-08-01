import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import RecipeCard from "./RecipeCard";
import ProjectCard from "./ProjectCard";
import SearchCard from "./SearchCard";
import { isProject } from "~/lib/postUtils.js";
import { appConfig } from '../appConfig.js';

interface BlogListProps {
  posts: Post[];
  max?: number;
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllLabel?: string;
  className?: string;
  isRecipePage?: boolean;
  cardType?: 'default' | 'recipe' | 'project' | 'article';
  postsWithNoLazyLoading?: number;
  showSecret?: boolean;
  showNonPublic?: boolean;
  excludeArticles?: boolean;
}

export default function BlogList({ 
  posts, 
  max, 
  title, 
  showViewAll = false, 
  viewAllLink,
  viewAllLabel,
  className = "",
  isRecipePage = false,
  cardType = 'default',
  postsWithNoLazyLoading = 6,
  showSecret = false,
  showNonPublic = false,
  excludeArticles = false
}: BlogListProps) {
  if (!posts || posts.length === 0) {
    return <p>No posts found.</p>;
  }

  // Filter posts based on visibility settings and content type
  const filteredPosts = posts.filter(post => {
    // Hide secret posts unless showSecret is true
    if (post.frontmatter.secret === true && !showSecret) {
      return false;
    }
    
    // Hide non-public posts unless showNonPublic is true
    if (post.frontmatter.public === false && !showNonPublic) {
      return false;
    }
    
    // Exclude articles if excludeArticles is true (keep only projects)
    if (excludeArticles && !isProject(post)) {
      return false;
    }
    
    return true;
  });

  // Limit the number of posts if max is provided
  const displayPosts = max ? filteredPosts.slice(0, max) : filteredPosts;

  // Determine if posts contain projects using the same utility as other components
  const hasProjects = filteredPosts.some(post => isProject(post));

  // Use provided viewAllLink or auto-detect based on content
  const finalViewAllLink = viewAllLink || (hasProjects ? "/projects" : "/projects/articles");

  // Hide view all button on recipe page when showing projects
  const shouldShowViewAll = showViewAll && !(isRecipePage && hasProjects);

  const content = (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
      {displayPosts.map((post, index) => {
        const shouldLazyLoad = index >= postsWithNoLazyLoading;
        const loading = shouldLazyLoad ? "lazy" : "eager";
        
        return cardType === 'recipe' ? (
          <RecipeCard key={post.slug} post={post} loading={loading} />
        ) : cardType === 'project' ? (
          <ProjectCard key={post.slug} post={post} loading={loading} showAiBadge={false} />
        ) : cardType === 'article' ? (
          <SearchCard key={post.slug} post={post} loading={loading} />
        ) : (
          <div key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={post.frontmatter['cover-md'] || post.frontmatter.cover || post.firstImage || appConfig.defaultImages.projectCard}
                alt={post.title || post.frontmatter.title || post.frontmatter.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading={loading}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link 
                  prefetch="viewport" 
                  to={`/${isProject(post) ? `${post.frontmatter.year || post.frontmatter.edition || new Date().getFullYear()}/${post.slug}` : post.slug}`}
                  className="text-black hover:underline dark:text-white"
                >
                  {post.title || post.frontmatter.title || post.frontmatter.name}
                </Link>
              </h2>
              
              {/* Show photographer for projects */}
              {isProject(post) && post.frontmatter.photographer && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  by {post.frontmatter.photographer}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-3">
                {/* Show year for projects, category for others */}
                {isProject(post) && post.frontmatter.year ? (
                  <Link
                    to={`/${post.frontmatter.year}`}
                    className="px-2 py-1 bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200 hover:bg-lime-200 dark:hover:bg-lime-800 rounded text-xs font-medium transition-colors"
                  >
                    {post.frontmatter.year}
                  </Link>
                ) : post.frontmatter.category && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-black text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                    {post.frontmatter.category}
                  </span>
                )}
                {post.frontmatter.tags && post.frontmatter.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
                {post.frontmatter.tags && post.frontmatter.tags.length > 3 && (
                  <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                    +{post.frontmatter.tags.length - 3} more
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 overflow-hidden">{post.firstParagraphText || post.plain}</p>
              <Link 
                prefetch="viewport"  
                to={`/${post.slug}`}
                className="text-sm text-black hover:underline dark:text-white"
              >
                Read more →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (title || shouldShowViewAll) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          
          {content}
          
          {shouldShowViewAll && (
            <div className="mt-8 text-center">
              <Link 
                to={finalViewAllLink}
                className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {viewAllLabel || (hasProjects ? "View All Projects" : "View All Posts")}
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  return content;
}