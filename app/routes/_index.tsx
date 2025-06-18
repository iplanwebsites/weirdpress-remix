import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import repo from "../../repo";
import BlogList from "~/components/BlogList";
import ThreeFeaturedBlog from "~/components/ThreeFeaturedBlog";
import ProjectsPerYear from "~/components/ProjectsPerYear";
import type { Post } from "~/types/blog";
import { getProjects, getNonProjects } from "~/lib/postUtils";
import { appConfig } from "~/appConfig";

// Hero background image
const HERO_IMAGE_URL = "https://2024.weirdpressphoto.org/_repo/medias/14041b0a6ef6eaf2addc7dfcc5617b49219e0d4c496404dedb12e37d323acea1-xl.webp";

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

// Get featured posts - prioritize featured=true, then 2024 posts
function getFeaturedPosts(posts: Post[]): Post[] {
  const featuredPosts = posts.filter(post => post.frontmatter.featured === true);
  const posts2024 = posts.filter(post => 
    (post.frontmatter.year === 2024 || post.frontmatter.year === '2024') && 
    !post.frontmatter.featured
  );
  
  // If we have enough featured posts, use them
  if (featuredPosts.length >= 3) {
    return shuffleArray(featuredPosts).slice(0, 3);
  }
  
  // Otherwise, combine featured + shuffled 2024 posts
  const shuffled2024 = shuffleArray(posts2024);
  const combined = [...featuredPosts, ...shuffled2024];
  return combined.slice(0, 3);
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
  
  // Get featured posts using the new logic
  const featuredPosts = getFeaturedPosts(posts);


  /*
 The First Photography <br />Exhibition by Machines


  */
  return (
    <div>
      <section 
        className="relative bg-cover bg-center bg-no-repeat flex items-end h-[40vh] md:h-[80vh]"
        style={{
          backgroundImage: `url(${HERO_IMAGE_URL})`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="text-left text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
             The best of AI Photojournalism
            </h1>
            <div className="mt-8">
              <a 
                href="/2024" 
                className="inline-block px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors"
              >
                View 2024 winners  ›
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 abril">
            Press Photography that Matters
          </h2>
          <p className="text-lg opacity-80 dark:opacity-80 mono">Documenting pivotal moments through the lens</p>
        </div>
      </div>

      {/* Featured Articles Section */} 
      {featuredPosts.length >= 3 && (
        <div className="py-10">
          <div className="container mx-auto px-4">
            <ThreeFeaturedBlog 
              heading="Featured Projects" 
              posts={featuredPosts}
            />
          </div>
        </div>
      )}

      {/* Projects by Year Section */}
      {posts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ProjectsPerYear posts={posts} />
          </div>
        </section>
      )}

      {/* Recent Posts Section 
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

       */}
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
