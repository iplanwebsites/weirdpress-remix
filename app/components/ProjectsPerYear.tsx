import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import BlogList from "./BlogList";

interface ProjectsPerYear {
  year: number;
  posts: Post[];
}

interface ProjectsPerYearProps {
  posts: Post[];
  className?: string;
}

function groupPostsByYear(posts: Post[]): ProjectsPerYear[] {
  const groupedByYear: { [key: number]: Post[] } = {};
  
  posts.forEach(post => {
    const year = post.frontmatter.year || post.frontmatter.edition || new Date().getFullYear();
    const yearNumber = typeof year === 'string' ? parseInt(year, 10) : year;
    
    if (!groupedByYear[yearNumber]) {
      groupedByYear[yearNumber] = [];
    }
    groupedByYear[yearNumber].push(post);
  });

  return Object.entries(groupedByYear)
    .map(([year, posts]) => ({
      year: parseInt(year, 10),
      posts: posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date || 0);
        const dateB = new Date(b.frontmatter.date || 0);
        return dateB.getTime() - dateA.getTime();
      })
    }))
    .sort((a, b) => b.year - a.year);
}

export default function ProjectsPerYear({ posts, className = "" }: ProjectsPerYearProps) {
  const projectsByYear = groupPostsByYear(posts);

  if (projectsByYear.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-16 ${className}`}>
      {projectsByYear.map(({ year, posts: yearPosts }) => (
        <section key={year}>
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            <Link
              to={`/${year}`}
              className="text-gray-900 dark:text-white hover:underline"
            >
              {year}
            </Link>
          </h2>
          
          <BlogList
            posts={yearPosts}
            cardType="project"
            postsWithNoLazyLoading={6}
          />
          
          {yearPosts.length > 6 && (
            <div className="mt-8 text-center">
              <Link
                to={`/${year}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                View all {year} projects
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
          )}
        </section>
      ))}
    </div>
  );
}