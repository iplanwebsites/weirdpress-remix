import { json } from "@remix-run/cloudflare";
import { useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import type { Post } from "~/types/blog";
import { appConfig } from "~/appConfig";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import ArticleTemplate from "~/components/ArticleTemplate";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  
  // Check if slug is a year (4 digit number)
  const isYear = /^\d{4}$/.test(slug || '');
  
  if (isYear) {
    try {
      // Get all posts and filter by year
      const allPosts = await repo.getAllPosts();
      const yearPosts = allPosts.filter(post => 
        post.frontmatter?.year === slug || 
        post.frontmatter?.year === parseInt(slug || '', 10)
      );
      
      return json({ isYearListing: true, year: slug, posts: yearPosts });
    } catch (error) {
      console.error("Error loading year posts:", error);
      throw new Response("Error loading posts", { status: 500 });
    }
  } else {
    try {
      const post = await repo.getPostBySlug(slug);
      
      if (!post) {
        throw new Response("Post not found", { status: 404 });
      }
      
      // Load similar posts using the current post's hash
      const similarPosts = await repo.getSimilarPostsByHash(post.hash, 5);
      
      return json({ isYearListing: false, post, similarPosts });
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      }
      console.error("Error loading post:", error);
      throw new Response("Error loading post", { status: 500 });
    }
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Not found" },
      { name: "description", content: "The requested content could not be found" },
    ];
  }
  
  if (data.isYearListing) {
    return [
      { title: `${data.year} Projects | ${appConfig.siteName}` },
      { name: "description", content: `Browse all photography projects from ${data.year}` },
      { property: "og:title", content: `${data.year} Projects` },
      { property: "og:description", content: `Browse all photography projects from ${data.year}` },
      { property: "og:type", content: "website" },
    ];
  }
  
  if (!data.post) {
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
    <ArticleTemplate
      post={post}
      similarPosts={similarPosts}
      backLink="/recipes"
      backLinkText="← Back to all posts"
      similarPostsTitle="You might also like"
      excludeArticlesInSimilar={true}
    />
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