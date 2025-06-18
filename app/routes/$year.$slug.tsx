import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import repo from "../../repo.js";
import type { Post } from "~/types/blog";
import { appConfig } from "~/appConfig.js";
import ArticleTemplate from "~/components/ArticleTemplate";

export const loader: LoaderFunction = async ({ params }) => {
  const { year, slug } = params;
  
  if (!year || !slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const post = await repo.getPostBySlug(slug);
    
    if (!post) {
      throw new Response("Not Found", { status: 404 });
    }

    // Verify the year matches
    const postYear = post.frontmatter.year || post.frontmatter.edition;
    if (postYear && postYear.toString() !== year) {
      throw new Response("Not Found", { status: 404 });
    }

    // Load similar posts
    const similarPosts = await repo.getSimilarPostsByHash(post.hash, 5);

    return json({ post, similarPosts });
  } catch (error) {
    console.error("Error loading post:", error);
    throw new Response("Not Found", { status: 404 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: "Not Found | " + appConfig.siteName },
      { name: "description", content: "Page not found" },
    ];
  }

  const { post } = data;
  const title = post.frontmatter.title || post.frontmatter.name || "Untitled";
  const description = post.frontmatter.description || post.frontmatter.excerpt || appConfig.siteDescription;
  const imageUrl = post.frontmatter.cover || post.firstImage || appConfig.defaultImages.ogImage;

  return [
    { title: `${title} | ${appConfig.siteName}` },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
};

export default function YearSlugPost() {
  const { post, similarPosts } = useLoaderData<{ post: Post; similarPosts: Post[] }>();

  return (
    <ArticleTemplate
      post={post}
      similarPosts={similarPosts}
      backLink="/projects"
      backLinkText="← Back to all projects"
      similarPostsTitle="Similar Projects"
      excludeArticlesInSimilar={true}
    />
  );
}