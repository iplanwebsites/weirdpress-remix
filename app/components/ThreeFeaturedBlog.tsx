import React from 'react';
import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import { appConfig } from '../appConfig.js';
import { isProject } from '~/lib/postUtils.js';

interface ThreeFeaturedBlogProps {
  heading: string;
  posts: Post[];
}

export default function ThreeFeaturedBlog({ heading, posts }: ThreeFeaturedBlogProps) {
  // Ensure we have at least 3 posts
  if (!posts || posts.length < 3) {
    return null;
  }

  const featuredPosts = posts.slice(0, 3);

  return (
    <section className="p-6 space-y-6">
      <h2 className="text-5xl text-center font-light  text-gray-900 dark:text-white">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* First Item: Larger layout (60% width) */}
        <div className="relative md:col-span-3">
          <Link to={`/${isProject(featuredPosts[0]) ? `${featuredPosts[0].frontmatter.year || featuredPosts[0].frontmatter.edition || new Date().getFullYear()}/${featuredPosts[0].slug}` : featuredPosts[0].slug}`} prefetch="viewport">
            <div className="bg-gray-400 overflow-hidden">
              <img 
                src={featuredPosts[0].frontmatter['cover-lg'] || featuredPosts[0].firstImage || appConfig.defaultImages.projectCard} 
                alt={featuredPosts[0].title || featuredPosts[0].frontmatter.title || featuredPosts[0].frontmatter.name} 
                className="w-full object-cover hover:scale-105 transition-transform duration-300" 
                style={{ aspectRatio: '3/2' }}
              />
            </div>
            <div className="mt-4 space-y-1 text-center">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase">
                {featuredPosts[0].frontmatter.category || 'Project'}
              </p>
              <h3 className="text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {featuredPosts[0].title || featuredPosts[0].frontmatter.title || featuredPosts[0].frontmatter.name}
              </h3>
              {featuredPosts[0].frontmatter.photographer && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {featuredPosts[0].frontmatter.photographer}
                </p>
              )}
              {(featuredPosts[0].frontmatter.year || featuredPosts[0].frontmatter.edition) && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {featuredPosts[0].frontmatter.year || featuredPosts[0].frontmatter.edition}
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Right Column: 2 smaller articles (40% width) */}
        <div className="space-y-6 md:col-span-2">
          {featuredPosts.slice(1).map((post) => (
            <div key={post.slug} className="grid grid-cols-[160px_1fr] gap-3 2xl:grid-cols-[230px_1fr] 2xl:gap-5 w-full relative">
              <Link to={`/${isProject(post) ? `${post.frontmatter.year || post.frontmatter.edition || new Date().getFullYear()}/${post.slug}` : post.slug}`} prefetch="viewport" className="flex-shrink-0">
                <div className="bg-gray-400 overflow-hidden">
                  <img 
                    src={post.frontmatter['cover-md'] || post.firstImage || appConfig.defaultImages.projectCard} 
                    alt={post.title || post.frontmatter.title || post.frontmatter.name} 
                    className="w-full h-40 md:h-48 lg:h-56 xl:h-64 object-cover hover:scale-105 transition-transform duration-300" 
                    style={{ aspectRatio: '2/4' }}
                  />
                </div>
              </Link>
              <div className="flex flex-col justify-center space-y-1">
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase">
                  {post.frontmatter.category || 'Project'}
                </p>
                <Link to={`/${isProject(post) ? `${post.frontmatter.year || post.frontmatter.edition || new Date().getFullYear()}/${post.slug}` : post.slug}`} prefetch="viewport">
                  <h3 className="text-lg 2xl:text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title || post.frontmatter.title || post.frontmatter.name}
                  </h3>
                </Link>
                {post.frontmatter.photographer && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {post.frontmatter.photographer}
                  </p>
                )}
                {(post.frontmatter.year || post.frontmatter.edition) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post.frontmatter.year || post.frontmatter.edition}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}