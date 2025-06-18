import { json } from "@remix-run/cloudflare";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import { getProjects } from "~/lib/postUtils";
import PagedList, { PagedListErrorBoundary } from "~/components/PagedList";

export const meta: MetaFunction = () => {
  return [
    { title: "All Projects" },
    { name: "description", content: "Browse all our photography projects with pagination" },
  ];
};

const POSTS_PER_PAGE = 200;

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    
    const allPosts = await repo.getAllPosts();
    const projects = getProjects(allPosts);
    
    const totalPosts = projects.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    
    const paginatedPosts = projects.slice(startIndex, endIndex);
    
    return json({
      posts: paginatedPosts,
      currentPage,
      totalPages,
      totalPosts,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });
  } catch (error) {
    console.error("Error loading projects:", error);
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

export default function RecipesAll() {
  return (
    <PagedList
      title="All Projects"
      description="Browse our complete collection of photography projects."
      cardType="project"
      baseUrl="/recipes/all"
    />
  );
}

export function ErrorBoundary() {
  return (
    <PagedListErrorBoundary message="We're having trouble loading the projects. Please try again later." />
  );
}