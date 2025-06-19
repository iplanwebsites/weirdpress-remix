import type { Post } from "~/types/blog";
import { appConfig } from "~/appConfig";

interface AIPhotojournalistsProps {
  posts: Post[];
}

interface PhotographerData {
  name: string;
  portraitUrl: string;
  projectUrl: string;
  projectTitle: string;
}

export default function AIPhotojournalists({ posts }: AIPhotojournalistsProps) {
  // Filter out 2022 projects and extract unique photographers
  const photographers: PhotographerData[] = posts
    .filter(post => {
      const year = post.frontmatter.year || post.frontmatter.edition;
      return year && year !== 2022 && year !== '2022';
    })
    .filter(post => post.frontmatter.photographer || post.frontmatter.artistName || post.frontmatter.author)
    .map(post => {
      const photographer = post.frontmatter.photographer || post.frontmatter.artistName || post.frontmatter.author || '';
      const portraitUrl = post.frontmatter.photographer_portrait || post.frontmatter.artistPic || appConfig.defaultImages.projectCard;
      const year = post.frontmatter.year || post.frontmatter.edition || new Date(post.frontmatter.date || '').getFullYear();
      
      return {
        name: photographer,
        portraitUrl,
        projectUrl: `/${year}/${post.slug}`,
        projectTitle: post.frontmatter.title
      };
    })
    // Remove duplicates based on photographer name
    .filter((photographer, index, self) => 
      index === self.findIndex(p => p.name === photographer.name)
    )
    // Sort alphabetically by name
    .sort((a, b) => a.name.localeCompare(b.name));

  if (photographers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white abril">
            Meet the AI Photojournalists
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We recognized the exceptional work of these personas 
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-8">
          {photographers.map((photographer) => (
            <div key={photographer.name} className="text-center">
              <a 
                href={photographer.projectUrl}
                className="block group transition-all duration-200 hover:transform hover:scale-105"
              >
                <div className="project-card mb-3">
                  <div className="frame aspect-[4/5] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    <img
                      src={photographer.portraitUrl}
                      alt={photographer.name}
                      className="w-full h-full object-cover transition-all duration-200"
                      loading="lazy"
                    />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {photographer.name}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}