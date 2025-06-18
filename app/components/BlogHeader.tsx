import { useLocation, Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import { appConfig } from '../appConfig.js';
import { isProject } from '~/lib/postUtils.js';
import ShareBar from './ShareBar';

interface BlogHeaderProps {
  post: Post;
  currentUrl?: string;
}


export default function BlogHeader({ post, currentUrl }: BlogHeaderProps): JSX.Element {
  const location = useLocation();
  const { frontmatter } = post;
  
  // Get current URL from currentUrl prop, window.location, or construct from location
  const url: string = currentUrl || 
    (typeof window !== 'undefined' ? window.location.href : 
     `${location.pathname}${location.search}${location.hash}`);
  
  const title: string = post.title || frontmatter.title || frontmatter.name || 'Untitled';
  const category: string = frontmatter.category || 'Misc';
  const photographer: string = frontmatter.photographer || '';
  const photographerPortrait: string = frontmatter.photographer_portrait || frontmatter.artistPic || appConfig.defaultImages.projectCard;
  const year: string = frontmatter.year || '';
  const date: string = frontmatter.date ? new Date(frontmatter.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'Unknown date';
  
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount: number = post.plain?.split(/\s+/).length || 0;
  const readingTime: number = Math.max(1, Math.ceil(wordCount / 200));
  
  // Check if this is a project post
  const isProjectPost: boolean = isProject(post);
  


  return (
    <div className="single-content__content">
      <div className="single-content__header">
        {/* Main Category - Year as highlighted tag with link for projects */}
        <h2 className="single-content__category text-lime-500 dark:text-lime-400">
          {isProjectPost && year ? (
            <Link 
              to={`/${year}`}
              className="hover:underline"
            >
              {year}
            </Link>
          ) : (
            <span>{year || category}</span>
          )}
        </h2>
        
        {/* Title */}
        <h1 className="single-content__title text-6xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        
        {/* Meta Information */}
        <div className="flex items-center gap-4 my-6">
          {/* Show photographer for projects, default author for articles */}
          <div className="flex items-center gap-3">
            <img 
              className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600" 
              alt={isProjectPost && photographer ? photographer : appConfig.mascot.name} 
              src={isProjectPost && photographerPortrait ? photographerPortrait : appConfig.author.avatar}
            />
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {isProjectPost && photographer ? photographer : appConfig.mascot.name}
            </p>
          </div>
          
          {/* Separator */}
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          
          {/* Date - only show for non-project posts */}
          {!isProjectPost && (
            <>
              <p className="text-gray-600 dark:text-gray-400">{date}</p>
              
              {/* Separator  */}
              <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            </>
          )}
          
          {/* Reading Time for articles only */}
          {!isProjectPost && (
            <p className="text-gray-600 dark:text-gray-400">{readingTime}min read</p>
          )}
          
          {/* Show region for projects */}
          {isProjectPost && frontmatter.region && (
            <>
              <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              <p className="text-gray-600 dark:text-gray-400">{frontmatter.region}</p>
            </>
          )}
        </div>

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Category
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {category}
            </span>
          </div> */}

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Social Share */}
        <ShareBar url={url} title={title} />
      </div>
    </div>
  );
}