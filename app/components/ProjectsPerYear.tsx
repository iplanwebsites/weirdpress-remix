import { Link } from "@remix-run/react";
import type { Post } from "~/types/blog";
import BlogList from "./BlogList";

// Year configuration with accent color, title, and subtitle
const YEAR_CONFIG: Record<number, { accent: string; title: string; subtitle: string; accentColor: string }> = {
  2024: {
    accent: "2024 WINNERS",
    title: "Latst year in 30 stories",
    subtitle: "2024's most impactful moments captured by agentic photojournalists",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  2023: {
    accent: "2023 WINNERS",
    title: "The takeoff", 
    subtitle: "Showcasing the greatly improved storytelling capability of newer AI models",
    accentColor: "text-green-600 dark:text-green-400"
  },
  2022: {
    accent: "2022 WINNERS",
    title: "The begining",
    subtitle: "Touching stories of probable scenarios, painfully illustrated by early AI image models",
    accentColor: "text-purple-600 dark:text-purple-400"
  }
};

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
        <section key={year} className="scroll-mt-20" id={`year-${year}`}>
          <div className="sticky top-20 bg-white dark:bg-black z-10 py-6 mb-12 text-center border-b border-gray-100 dark:border-gray-800">
            {YEAR_CONFIG[year] ? (
              <>
                <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${YEAR_CONFIG[year].accentColor}`}>
                  {YEAR_CONFIG[year].accent}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  <Link
                    to={`/${year}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {YEAR_CONFIG[year].title}
                  </Link>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {YEAR_CONFIG[year].subtitle}
                </p>
              </>
            ) : (
              <>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
                  {year} COLLECTION
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  <Link
                    to={`/${year}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {year}
                  </Link>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {yearPosts.length} {yearPosts.length === 1 ? 'project' : 'projects'}
                </p>
              </>
            )}
          </div>
          
          <BlogList
            posts={yearPosts}
            cardType="project"
            postsWithNoLazyLoading={6}
          />
          
          {yearPosts.length > 6 && (
            <div className="mt-8 text-center">
              <Link
                to={`/${year}`}
                className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200"
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