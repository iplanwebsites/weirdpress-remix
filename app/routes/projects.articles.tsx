import { json } from "@remix-run/cloudflare";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import { getNonProjects } from "~/lib/postUtils";
import PagedList, { PagedListErrorBoundary } from "~/components/PagedList";

export const meta: MetaFunction = () => {
  return [
    { title: "Articles & Essays" },
    { name: "description", content: "Browse our photography essays, critical analysis, and editorial content" },
  ];
};

const POSTS_PER_PAGE = 200;

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    
    const allPosts = await repo.getAllPosts();
    const articles = getNonProjects(allPosts);
    
    const totalPosts = articles.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    
    const paginatedPosts = articles.slice(startIndex, endIndex);
    
    return json({
      posts: paginatedPosts,
      currentPage,
      totalPages,
      totalPosts,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });
  } catch (error) {
    console.error("Error loading articles:", error);
    return json({
      posts: [],
      currentPage: 1,
      totalPages: 0,
      totalPosts: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  }
};

export default function RecipesArticles() {
  return (
    <PagedList
      title="Articles & Guides"
      description="Discover cooking tips, techniques, and food knowledge to enhance your culinary journey."
      cardType="article"
      baseUrl="/recipes/articles"
    />
  );
}

export function ErrorBoundary() {
  return (
    <PagedListErrorBoundary message="We're having trouble loading the articles. Please try again later." />
  );
}