import { json } from "@remix-run/cloudflare";
import { useLoaderData, useParams, useRouteError, isRouteErrorResponse, Link } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import type { Post } from "~/types/blog";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import BlogList from "~/components/BlogList";
import { appConfig } from "~/appConfig";

export const meta: MetaFunction = ({ params }) => {
  const tag = params.tag || 'recipes';
  const formattedTag = tag.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return [
    { title: `${formattedTag} Recipes` },
    { name: "description", content: `Browse our ${formattedTag.toLowerCase()} recipes` },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const tag = params.tag;
    if (!tag) {
      throw new Response("Tag not found", { status: 404 });
    }

    const allPosts = await repo.getAllPosts();
    
    // Search for posts that match the tag in various fields
    const filteredPosts = allPosts.filter((post: any) => {
      const searchTerm = tag.toLowerCase();
      
      // Check if tag matches in various fields
      const matchesTag = post.frontmatter?.tags?.some((postTag: string) => 
        postTag.toLowerCase().includes(searchTerm)
      );
      
      const matchesCategory = post.frontmatter?.category?.toLowerCase().includes(searchTerm);
      const matchesType = post.frontmatter?.type?.toLowerCase().includes(searchTerm);
      const matchesTitle = (post.title || post.frontmatter?.title)?.toLowerCase().includes(searchTerm);
      const matchesName = post.frontmatter?.name?.toLowerCase().includes(searchTerm);
      const matchesContent = post.plain?.toLowerCase().includes(searchTerm);
      
      return matchesTag || matchesCategory || matchesType || matchesTitle || matchesName || matchesContent;
    });

    const sortedPosts = repo.sortPostsByDate(filteredPosts);
    return json({ posts: sortedPosts, tag });
  } catch (error) {
    console.error("Error loading recipes by tag:", error);
    return json({ posts: [], tag: params.tag });
  }
};

export default function RecipesByTag() {
  const { posts, tag } = useLoaderData<{ posts: Post[]; tag: string }>();
  const params = useParams();
  
  const formattedTag = tag?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Recipes';

  const breadcrumbs = [
    { label: appConfig.siteName, href: '/', isLast: false },
    { label: 'Projects', href: '/projects', isLast: false },
    { label: formattedTag, href: `/projects/${tag}`, isLast: true }
  ];

  return (
    <main className="bg-gray-100 dark:bg-black">
      {/* Hero Section */}
      <div className="bg-blue-600 dark:bg-blue-700">
        <div className="pt-5 px-4 md:px-2 md:max-w-4xl mx-auto text-center">
          {/* Breadcrumb Navigation */}
          <nav className="text-blue-100 dark:text-blue-200">
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2">{'>'}</span>}
                {crumb.isLast ? (
                  <span className="text-white dark:text-gray-100" aria-current="page">{crumb.label}</span>
                ) : (
                  <Link to={crumb.href} className="hover:text-white dark:hover:text-gray-100 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        <header className="pt-3 pb-12 px-4 md:pt-5 md:pb-16 md:px-2 md:max-w-4xl mx-auto text-center">
          <h1 className="text-center text-white dark:text-gray-100 text-4xl md:text-6xl mb-4 md:mb-8 font-bold">
            {formattedTag} Recipes
          </h1>
          <p className="my-0 text-blue-100 dark:text-blue-200 md:text-xl max-w-4xl mx-auto">
            Discover our collection of {formattedTag.toLowerCase()} recipes, carefully curated for your kitchen adventures.
          </p>
        </header>
      </div>

      {/* Results Section */}
      <section className="py-8 px-4 mx-auto md:max-w-5xl">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found {posts.length} recipe{posts.length !== 1 ? 's' : ''} for &ldquo;{formattedTag}&rdquo;
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <BlogList posts={posts} />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No recipes found for &ldquo;{formattedTag}&rdquo;
            </p>
            <Link 
              to="/projects" 
              className="bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors px-6 py-3 rounded-lg font-medium"
            >
              Browse All Recipes
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();
  
  if (isRouteErrorResponse(error)) {
    return <ErrorBoundaryComponent 
      status={error.status}
      statusText={error.statusText}
      message={`We're having trouble loading recipes for "${params.tag}". Please try again later.`}
    />;
  }
  
  return <ErrorBoundaryComponent 
    message={`There was an error loading recipes for "${params.tag}". Please try again later.`}
  />;
}