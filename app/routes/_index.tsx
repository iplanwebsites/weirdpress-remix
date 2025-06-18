import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import repo from "../../repo";
import BlogList from "~/components/BlogList";
import ThreeFeaturedBlog from "~/components/ThreeFeaturedBlog";
import type { Post } from "~/types/blog";
import { getProjects, getNonProjects } from "~/lib/postUtils";
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
    { title: `${appConfig.siteName}` },
    { name: "description", content: `${appConfig.siteDescription}` },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const allPosts = await repo.getAllPosts();
    const projects = getProjects(allPosts);
    const nonProjects = getNonProjects(allPosts);
    const shuffledProjects = shuffleArray(projects);
    const shuffledNonProjects = shuffleArray(nonProjects);
    
    return json({ posts: shuffledProjects, nonProjectPosts: shuffledNonProjects });
  } catch (error) {
    console.error("Error loading posts:", error);
    return json({ posts: [], nonRecipePosts: [] });
  }
};

export default function Index() {
  const { posts, nonProjectPosts } = useLoaderData<{ posts: Post[]; nonProjectPosts: Post[] }>();

  return (
    <div>
      <div className="py-12 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 abril">
            Press Photography that Matters
          </h1>
          <p className="text-lg opacity-80 mono">Documenting pivotal moments through the lens</p>
        </div>
      </div>

      {/* Featured Articles Section */} 
      {posts.length >= 3 && (
        <div className="py-10 container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <ThreeFeaturedBlog 
              heading="Featured Projects" 
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
          title="Latest Projects"
          showViewAll={true}
          viewAllLink="/projects"
          viewAllLabel="Browse Projects" 
          cardType="project"
          postsWithNoLazyLoading={POSTS_WITH_NO_LAZY_LOADING}
        />
      )}

      {/* Articles & Guides Section */}
      {nonProjectPosts.length > 0 && (
        <BlogList 
          posts={nonProjectPosts} 
          max={200} 
          title="Articles & Essays"
          showViewAll={true}
          viewAllLink="/projects/articles"
          viewAllLabel="All Articles"
          cardType="article"
          postsWithNoLazyLoading={POSTS_WITH_NO_LAZY_LOADING}
        />
      )}
    </div>
  );
}
