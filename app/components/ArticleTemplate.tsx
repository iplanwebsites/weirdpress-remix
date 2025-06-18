import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import BlogContent from "./BlogContent";
import BlogHeader from "./BlogHeader";
import BlogList from "./BlogList";
import TableOfContents from "./TableOfContents";
import AboutCard from "./AboutCard";
import BookPromo from "./BookPromo";
import PhotographerCard from "./PhotographerCard";

interface ArticleTemplateProps {
  post: Post;
  similarPosts?: Post[];
  backLink?: string;
  backLinkText?: string;
  similarPostsTitle?: string;
  excludeArticlesInSimilar?: boolean;
}

export default function ArticleTemplate({
  post,
  similarPosts,
  backLink = "/recipes",
  backLinkText = "← Back to all posts",
  similarPostsTitle = "You might also like",
  excludeArticlesInSimilar = false
}: ArticleTemplateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Cover Image - Full Width */}
        {post.frontmatter['cover'] && (
          <div className="mb-8">
            <img 
              src={post.frontmatter['cover-lg']} 
              alt={post.title || post.frontmatter.title}
              className="w-full object-cover"
              style={{ aspectRatio: '3/2' }}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article>
              <BlogHeader post={post} />
              
              <BlogContent html={post.html} />
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  prefetch="viewport" 
                  to={backLink} 
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  {backLinkText}
                </Link>
              </div>
            </article>
          </div>
          
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              <PhotographerCard post={post} mode="sidebar" />
              <AboutCard />
              {post.toc && post.toc.length > 0 && (
                <TableOfContents items={post.toc} />
              )}
            </div>
          </div>
        </div>
        
        {/* Full Photographer Card */}
        {post.frontmatter.photographer && (
          <div id="photographer-full" className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">About the Photographer</h2>
            <PhotographerCard post={post} mode="full" />
          </div>
        )}
        
        {/* Similar Posts Section */}
        {similarPosts && similarPosts.length > 0 && (
          <BlogList 
            posts={similarPosts} 
            max={5}
            title={similarPostsTitle}
            showViewAll={true}
            viewAllLink="/recipes"
            cardType="article"
            excludeArticles={excludeArticlesInSimilar}
          />
        )}
        
        {/* Book Promo Banner */}
        <BookPromo />
      </div>
    </div>
  );
}