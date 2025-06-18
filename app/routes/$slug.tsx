import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import type { Post } from "~/types/blog";
import { appConfig } from "~/appConfig";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import AboutCard from "~/components/AboutCard";
import TableOfContents from "~/components/TableOfContents";
import BlogList from "~/components/BlogList";
import BlogContent from "~/components/BlogContent";
import BlogHeader from "~/components/BlogHeader";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  
  try {
    const post = await repo.getPostBySlug(slug);
    
    if (!post) {
      throw new Response("Post not found", { status: 404 });
    }
    
    // Load similar posts using the current post's hash
    const similarPosts = await repo.getSimilarPostsByHash(post.hash, 5);
    
    return json({ post, similarPosts });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Error loading post:", error);
    throw new Response("Error loading post", { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: "Post not found" },
      { name: "description", content: "The requested post could not be found" },
    ];
  }
  
  const post = data.post;
  const relativeImage = post.frontmatter['cover-lg'] || 
                        post.frontmatter.cover || 
                        post.firstImage || 
                        appConfig.seo.ogImage;
  
  // Convert relative URLs to absolute URLs for og:image
  const ogImage = relativeImage?.startsWith('http') 
    ? relativeImage 
    : `${appConfig.siteUrl}${relativeImage}`;
  
  return [
    { title: post.frontmatter.title },
    { name: "description", content: post.plain },
    { property: "og:image", content: ogImage },
    { property: "og:title", content: post.frontmatter.title },
    { property: "og:description", content: post.plain },
    { property: "og:type", content: "article" },
  ];
};

export default function BlogPost() {
  const { post, similarPosts } = useLoaderData<{ post: Post; similarPosts: Post[] }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article>
              <BlogHeader post={post} />
               
              {post.frontmatter['cover'] && (
                
                <div className="mb-8">
                  
                  <img 
                    src={post.frontmatter['cover-lg']} 
                    alt={post.frontmatter.title}
                    className="w-full rounded-xl object-cover"
                    style={{ aspectRatio: '3/2' }}
                  />
                </div>
              )}
              
              <BlogContent html={post.html} />
              
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link 
                prefetch="viewport" 
                  to="/recipes" 
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  ← Back to all posts
                </Link>
              </div>
            </article>
          </div>
          
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              <AboutCard />
              <TableOfContents items={post.toc} />
            </div>
          </div>
        </div>
        
        {/* Similar Posts Section */}
        {similarPosts && similarPosts.length > 0 && (
          <BlogList 
            posts={similarPosts} 
            max={5}
            title="You might also like"
            showViewAll={true}
            viewAllLink="/recipes"
            cardType="article"
          />
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <ErrorBoundaryComponent 
        status={404}
        statusText="Post Not Found"
        message="Sorry, the blog post you're looking for doesn't exist."
      />;
    }
  }
  
  return <ErrorBoundaryComponent 
    message="There was an error loading this blog post. Please try again later."
  />;
}