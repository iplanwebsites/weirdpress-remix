import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import repo from "../../repo";
import BlogList from "~/components/BlogList";
import ThreeFeaturedBlog from "~/components/ThreeFeaturedBlog";
import type { Post } from "~/types/blog";
import { getRecipes, getNonRecipes } from "~/lib/postUtils";
import { appConfig } from "~/appConfig";

// Number of posts that should load eagerly (without lazy loading)
const POSTS_WITH_NO_LAZY_LOADING = 6;

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const meta: MetaFunction = () => {
  return [
    { title: `${appConfig.siteName} 🦝 🍜` },
    { name: "description", content: `${appConfig.siteDescription} - Discover recipes worth stealing  ` },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const allPosts = await repo.getAllPosts();
    const recipes = getRecipes(allPosts);
    const nonRecipes = getNonRecipes(allPosts);
    const shuffledRecipes = shuffleArray(recipes);
    const shuffledNonRecipes = shuffleArray(nonRecipes);
    
    return json({ posts: shuffledRecipes, nonRecipePosts: shuffledNonRecipes });
  } catch (error) {
    console.error("Error loading posts:", error);
    return json({ posts: [], nonRecipePosts: [] });
  }
};

export default function Index() {
  const { posts, nonRecipePosts } = useLoaderData<{ posts: Post[]; nonRecipePosts: Post[] }>();

  return (
    <div>
      <div className="py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Recipes worth stealing
          </h1>
        </div>
      </div>

      {/* Featured Articles Section */} 
      {posts.length >= 3 && (
        <div className="py-10 container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <ThreeFeaturedBlog 
              heading="Featured Recipes" 
              posts={posts}
            />
          </div>
        </div>
      )}

      {/* Recent Posts Section  */}
      {posts.length > 3 && (
        <BlogList 
          posts={posts.slice(3)} 
          max={200} 
          title="Browse Recipes"
          showViewAll={true}
          viewAllLink="/recipes"
          viewAllLabel="Browse Recipes" 
          cardType="recipe"
          postsWithNoLazyLoading={POSTS_WITH_NO_LAZY_LOADING}
        />
      )}

      {/* Articles & Guides Section */}
      {nonRecipePosts.length > 0 && (
        <BlogList 
          posts={nonRecipePosts} 
          max={200} 
          title="Articles & Guides"
          showViewAll={true}
          viewAllLink="/recipes/articles"
          viewAllLabel="All Articles"
          cardType="article"
          postsWithNoLazyLoading={POSTS_WITH_NO_LAZY_LOADING}
        />
      )}
    </div>
  );
}
