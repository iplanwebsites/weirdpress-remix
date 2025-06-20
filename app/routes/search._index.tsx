import type { MetaFunction, LoaderFunction, HeadersFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams, Link } from "@remix-run/react";
import SearchBar from "~/components/SearchBar";
import SearchCard from "~/components/SearchCard";
import type { Post } from "~/types/blog";
import { isProject } from "~/lib/postUtils.js";
import repo from "../../repo";
import { appConfig } from "~/appConfig";
import { CachePolicies, createCacheHeaders } from "~/lib/cache";

interface SearchResult {
  post: Record<string, unknown>;
}

export const headers: HeadersFunction = () => {
  return createCacheHeaders(CachePolicies.search());
};

export const meta: MetaFunction = () => {
  return [
    { title: `Search - ${appConfig.siteName}` },
    { name: "description", content: "Search for projects and photo series" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  let posts: Post[] = [];
  
  if (query.trim().length > 0) {
    try {
      const results = await repo.searchPosts(query.trim()) as SearchResult[];
      // Transform search results into Post format for BlogList
      posts = results.map((result: SearchResult) => {
        const postData = result.post;
        const frontmatter = postData.frontmatter as Record<string, unknown>;
        
        // Ensure frontmatter has required properties
        const completeFrontmatter = {
          title: (postData.title as string) || (frontmatter.title as string) || (frontmatter.name as string) || 'Untitled',
          public: frontmatter.public as boolean || true,
          ...frontmatter
        };
        
        const transformedPost = {
          fileName: postData.fileName as string,
          slug: postData.slug as string,
          frontmatter: completeFrontmatter,
          firstParagraphText: postData.firstParagraphText as string,
          plain: postData.plain as string,
          html: postData.html as string,
          toc: [], // Search results don't need TOC
          originalFilePath: postData.originalFilePath as string,
          firstImage: (postData.firstImage as string) || undefined,
        } as Post;
        
        // Only add rating properties for projects
        if (isProject(transformedPost)) {
          return {
            ...transformedPost,
            rating: (postData.rating as number) || (frontmatter.rating as number) || appConfig.defaults.rating,
            reviewCount: (postData.reviewCount as number) || appConfig.defaults.reviewCount,
            avgRating: (postData.avgRating as number) || appConfig.defaults.avgRating,
          };
        }
        
        return transformedPost;
      });
    } catch (error) {
      console.error("Search error:", error);
      posts = [];
    }
  }
  
  return json({ posts, query });
};

export default function Search() {
  const { posts, query } = useLoaderData<{ posts: Post[]; query: string }>();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || query;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Search</h1>
        
        <div className="mb-8 max-w-2xl mx-auto">
          <SearchBar 
            className="w-full"
            placeholder="Search recipes and cooking tips..."
            disableAutocomplete={true}
          />
        </div>

        {currentQuery && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {posts.length > 0 
                ? `Found ${posts.length} result${posts.length === 1 ? '' : 's'} for "${currentQuery}"`
                : `No results found for "${currentQuery}"`
              }
            </p>
          </div>
        )}

        {posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <SearchCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {currentQuery && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or browse our <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:underline">latest projects</Link>.
            </p>
          </div>
        )}

        {!currentQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Start searching</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}