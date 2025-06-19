import { json } from "@remix-run/cloudflare";
import { useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import repo from "../../repo";
import type { Post } from "~/types/blog";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import ProjectsPerYear from "~/components/ProjectsPerYear";
import { getProjects } from "~/lib/postUtils";
import { appConfig } from "~/appConfig";

export const meta: MetaFunction = () => {
  return [
    { title: "Projects" },
    { name: "description", content: "Browse our photography projects organized by year" },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const allPosts = await repo.getAllPosts();
    const projects = getProjects(allPosts);
    
    return json({ posts: projects });
  } catch (error) {
    console.error("Error loading projects:", error);
    return json({ posts: [] });
  }
};

export default function ProjectsIndex() {
  const { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* Header Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Discover the best of AI Photojournalism
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore projects refefining
            the future of news and photography  </p>
        </div>
      </div>

      {/* Projects by Year Section */}
      {posts.length > 0 ? (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto">
            <ProjectsPerYear posts={posts} />
          </div>
        </section>
      ) : (
        <section className="py-12 px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No projects found. Check back soon for new content!
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
      message="We're having trouble loading the projects. Please try again later."
    />;
  }
  
  return <ErrorBoundaryComponent 
    message="There was an error loading the projects. Please try again later."
  />;
}