import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import { appConfig } from '../appConfig.js';

interface PhotographerCardProps {
  post: Post;
  mode?: 'sidebar' | 'full';
}

export default function PhotographerCard({ post, mode = 'sidebar' }: PhotographerCardProps) {
  const { frontmatter } = post;
  const photographer = frontmatter.photographer;
  const photographerPortrait = frontmatter.photographer_portrait || frontmatter.artistPic || appConfig.defaultImages.projectCard;
  const photographerBio = frontmatter.photographer_bio || frontmatter.bio || '';
  const origin = frontmatter.photographer_origin || frontmatter.origin || frontmatter.region || '';

  // Don't render if no photographer info
  if (!photographer) return null;

  const isSidebar = mode === 'sidebar';

  if (isSidebar) {
    return (
      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={photographerPortrait}
              alt={photographer}
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
            />
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3">
            {photographer}
          </h3>
          
          {photographerBio && (
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              <div 
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {photographerBio}
              </div>
              
              {photographerBio.length > 150 && (
                <a 
                  href="#photographer-full"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
                >
                  Read more
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full mode
  return (
    <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-6">
      <div className="flex items-start gap-6">
        <img 
          src={photographerPortrait}
          alt={photographer}
          className="w-32 h-32 object-cover border-4 border-gray-200 dark:border-gray-600"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xl mb-2">
            {photographer}
          </h3>
          
          {origin && (
            <p className="text-gray-600 dark:text-gray-400 text-base mb-4">
              {origin}
            </p>
          )}
          
          {photographerBio && (
            <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {photographerBio}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}