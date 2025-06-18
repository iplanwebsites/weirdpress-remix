import { useLoaderData, useSearchParams, Link, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { Post } from "~/types/blog";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import BlogList from "~/components/BlogList";

interface PagedListData {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PagedListProps {
  title: string;
  description?: string;
  cardType?: "recipe" | "article" | "guide" | "project";
  baseUrl: string;
}

export default function PagedList({ title, description, cardType = "article", baseUrl }: PagedListProps) {
  const { posts, currentPage, totalPages, totalPosts, hasNextPage, hasPreviousPage } = useLoaderData<PagedListData>();
  const [searchParams] = useSearchParams();

  const generatePageLink = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          to={generatePageLink(i)}
          className={`px-3 py-2 mx-1 rounded-md transition-colors duration-200 ${
            i === currentPage
              ? "bg-blue-500 text-white font-semibold"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </Link>
      );
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {description}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            Showing {posts.length} of {totalPosts} items (Page {currentPage} of {totalPages})
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <BlogList posts={posts} cardType={cardType} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  {hasPreviousPage && (
                    <Link
                      to={generatePageLink(currentPage - 1)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Previous
                    </Link>
                  )}
                  
                  {renderPaginationNumbers()}
                  
                  {hasNextPage && (
                    <Link
                      to={generatePageLink(currentPage + 1)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Next
                    </Link>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Go to page:
                  <select
                    value={currentPage}
                    onChange={(e) => window.location.href = generatePageLink(parseInt(e.target.value))}
                    className="ml-2 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No items found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PagedListErrorBoundary({ message }: { message?: string }) {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return <ErrorBoundaryComponent 
      status={error.status}
      statusText={error.statusText}
      message={message || "We're having trouble loading the content. Please try again later."}
    />;
  }
  
  return <ErrorBoundaryComponent 
    message={message || "There was an error loading the content. Please try again later."}
  />;
}