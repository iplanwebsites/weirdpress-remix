import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import repo from "../../repo.js";
import type { Post } from "~/types/blog";
import { appConfig } from "~/appConfig.js";
import BlogContent from "~/components/BlogContent";
import BlogHeader from "~/components/BlogHeader";
import BlogList from "~/components/BlogList";
import TableOfContents from "~/components/TableOfContents";
import AboutCard from "~/components/AboutCard";

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <BlogHeader post={post} />
          <BlogContent post={post} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Table of Contents */}
          {post.toc && post.toc.length > 0 && (
            <div className="lg:sticky lg:top-8">
              <TableOfContents toc={post.toc} />
            </div>
          )}
          
          {/* About Card */}
          <AboutCard />
        </aside>
      </div>

      {/* Similar Posts */}
      {similarPosts && similarPosts.length > 0 && (
        <div className="mt-16">
          <BlogList 
            posts={similarPosts} 
            title="Similar Projects" 
            cardType="project"
          />
        </div>
      )}
    </div>
  );
}