import { json } from "@remix-run/cloudflare";
import { useLoaderData, useRouteError, isRouteErrorResponse, Link } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import type { Post } from "~/types/blog";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import BlogList from "~/components/BlogList";
import { Search } from "lucide-react";
import { getRecipes, getNonRecipes } from "~/lib/postUtils";
import { appConfig } from "~/appConfig";

export const meta: MetaFunction = () => {
  return [
    { title: "Recipes" },
    { name: "description", content: "Browse our delicious recipes" },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const allPosts = await repo.getAllPosts();
    const recipes = getRecipes(allPosts);
    const articles = getNonRecipes(allPosts);
    
    return json({ 
      posts: recipes,
      articles: articles.slice(0, 6) // Only show first 6 articles for preview
    });
  } catch (error) {
    console.error("Error loading recipes:", error);
    return json({ posts: [], articles: [] });
  }
};

export default function RecipesIndex() {
  const { posts, articles } = useLoaderData<{ posts: Post[]; articles: Post[] }>();

  // Breadcrumb data
  const breadcrumbs = [
    { label: appConfig.siteName, href: '/', isLast: false },
    { label: 'Recipes', href: '/recipes', isLast: true }
  ];

  // Recipe categories data
  const recipeCategories = [
    {
      title: 'Popular Categories',
      items: [
        { label: 'Quick and Easy', href: '/recipes/quick-easy' },
        { label: 'Meal Prep', href: '/recipes/meal-prep' },
        { label: 'Vegan', href: '/recipes/vegan' },
        { label: 'Vegetarian', href: '/recipes/vegetarian' },
        { label: 'Pasta', href: '/recipes/pasta' },
        { label: 'Soups', href: '/recipes/soups' },
        { label: 'Salads', href: '/recipes/salads' },
        { label: 'Dinner', href: '/recipes/dinner' },
        { label: 'Kid-Friendly', href: '/recipes/kid-friendly' },
        { label: 'Most Popular', href: '/recipes/popular' },
        { label: 'All Recipes', href: '/recipes/all' }
      ]
    },
    {
      title: 'Recipes by Meal Type',
      items: [
        { label: 'Breakfast', href: '/recipes/breakfast' },
        { label: 'Lunch', href: '/recipes/lunch' },
        { label: 'Dinner', href: '/recipes/dinner' },
        { label: 'Appetizer', href: '/recipes/appetizer' },
        { label: 'Snacks', href: '/recipes/snacks' },
        { label: 'Desserts', href: '/recipes/desserts' },
        { label: 'Drinks', href: '/recipes/drinks' }
      ]
    },
    {
      title: 'Recipes by Diet',
      items: [
        { label: 'Dairy-Free', href: '/recipes/dairy-free' },
        { label: 'Gluten-Free', href: '/recipes/gluten-free' },
        { label: 'Kid-Friendly', href: '/recipes/kid-friendly' },
        { label: 'Healthy', href: '/recipes/healthy' },
        { label: 'Vegan', href: '/recipes/vegan' },
        { label: 'Vegetarian', href: '/recipes/vegetarian' }
      ]
    },
    {
      title: 'Recipes by Season',
      items: [
        { label: 'Spring', href: '/recipes/spring' },
        { label: 'Summer', href: '/recipes/summer' },
        { label: 'Fall', href: '/recipes/fall' },
        { label: 'Winter', href: '/recipes/winter' }
      ]
    }
  ];

  // Get featured recipes (first 6 posts for featured section)
  const featuredRecipes = posts.slice(0, 6);

  return (
    <main className="bg-gray-100 dark:bg-gray-900">
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

        <header className="pt-3 pb-12 px-4 md:pt-5 md:pb-28 md:px-2 md:max-w-4xl mx-auto text-center">
          <h1 className="text-center text-white dark:text-gray-100 text-5xl md:text-7xl mb-4 md:mb-8 font-bold">
            Recipes
          </h1>
          <p className="my-0 text-blue-100 dark:text-blue-200 md:text-xl max-w-4xl mx-auto">
            We&apos;ve organized these recipes every way we could think of so you don&apos;t have to! 
            Dietary restrictions, weeknight dinners, meal prep recipes, some of our most 
            tried-and-true&hellip; no matter how you browse, we&apos;re sure you&apos;ll find just what you were looking for.
          </p>
        </header>
      </div>

      {/* Search Section */}
      <section className="px-4 mx-auto md:max-w-5xl transform -translate-y-1/2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <input
            type="search"
            placeholder="Search by keyword"
            className="flex-1 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            aria-label="Search our recipes"
          />
        </div>
      </section>

      {/* Featured Recipes Section */}
      {featuredRecipes.length > 0 && (
        <section className="pb-8 pt-4 px-4 mx-auto md:max-w-5xl">
          <header className="max-w-xl md:mx-auto text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 flex items-center justify-center">
                ⭐
              </div>
              <h2 className="font-bold tracking-widest text-2xl uppercase text-blue-600 dark:text-blue-400 m-0">
                Featured Recipes
              </h2>
            </div>
            <p className="hidden md:block text-gray-600 dark:text-gray-300">
              Out of all the many recipes in our kitchen, these are our shining stars - 
              the recipes we come back to again and again (and again).
            </p>
          </header>

          {/* Use BlogList Component with Recipe Cards */}
          <div className="p-6">
            <BlogList posts={featuredRecipes} isRecipePage={true} cardType="recipe" />
          </div>

          {/* View All Recipes Button */}
          <div className="text-center mt-8">
            <Link
              to="/recipes/all"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View All Recipes
              <svg 
                className="ml-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Recipe Categories Sections */}
      {recipeCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} className="py-8 px-4 mx-auto md:max-w-5xl">
          <header className="border-b border-gray-400 dark:border-gray-600 pb-2 mb-3">
            <h2 className="text-lg text-gray-900 dark:text-gray-100 tracking-widest uppercase font-bold">
              {category.title}
            </h2>
          </header>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {category.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex flex-row py-2">
                <Link 
                  className="block ml-2 hover:text-gray-900 dark:hover:text-gray-100 hover:underline text-gray-700 dark:text-gray-300 transition-colors" 
                  to={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Articles Section */}
      {articles.length > 0 && (
        <section className="py-8 px-4 mx-auto md:max-w-5xl">
          <header className="max-w-xl md:mx-auto text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 text-blue-500 flex items-center justify-center">
                📚
              </div>
              <h2 className="font-bold tracking-widest text-2xl uppercase text-blue-600 dark:text-blue-400 m-0">
                Articles & Guides
              </h2>
            </div>
            <p className="hidden md:block text-gray-600 dark:text-gray-300">
              Discover cooking tips, techniques, and food knowledge to enhance your culinary journey.
            </p>
          </header>

          {/* Use BlogList Component with Article Cards */}
          <div className="p-6">
            <BlogList posts={articles} cardType="article" />
          </div>

          {/* View All Articles Button */}
          <div className="text-center mt-8">
            <Link
              to="/recipes/articles"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View All Articles
              <svg 
                className="ml-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* No Recipes Message */}
      {posts.length === 0 && (
        <section className="py-12 px-4 mx-auto md:max-w-5xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No recipes found. Check back soon for delicious content!
          </p>
        </section>
      )}
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return <ErrorBoundaryComponent 
      status={error.status}
      statusText={error.statusText}
      message="We're having trouble loading the recipes. Please try again later."
    />;
  }
  
  return <ErrorBoundaryComponent 
    message="There was an error loading the recipes. Please try again later."
  />;
}