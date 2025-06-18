/**
 * Utility functions for filtering and sorting posts
 */

/**
 * Checks if a post is a recipe based on its originalFilePath
 * @param {Object} post - The post object
 * @returns {boolean} - True if the post is a recipe
 */
export function isRecipe(post) {
  const path = post.originalFilePath || "";
  return path.startsWith("recipes/") || path.includes("recipes/");
}

/**
 * Checks if a post is a guide based on its originalFilePath
 * @param {Object} post - The post object
 * @returns {boolean} - True if the post is a guide
 */
export function isGuide(post) {
  const path = post.originalFilePath || "";
  return path.startsWith("articles/guides/") || path.includes("/guides/");
}

/**
 * Checks if a post is an article (general content) based on its originalFilePath
 * @param {Object} post - The post object
 * @returns {boolean} - True if the post is an article
 */
export function isArticle(post) {
  const path = post.originalFilePath || "";
  return path.startsWith("articles/") && !isRecipe(post) && !isGuide(post);
}

/**
 * Extracts category from post's originalFilePath
 * @param {Object} post - The post object
 * @returns {string} - The extracted category
 */
export function extractCategory(post) {
  const path = post.originalFilePath || "";
  const pathParts = path.split("/");

  // Extract category from path structure
  if (path.startsWith("articles/recipes/") && pathParts.length > 3) {
    return pathParts[2]; // articles/recipes/[category]/file.md
  } else if (path.startsWith("articles/countries/")) {
    return pathParts[2]; // articles/countries/[country]/file.md
  } else if (path.startsWith("articles/guides/") && pathParts.length > 3) {
    return pathParts[2]; // articles/guides/[category]/file.md
  } else if (path.startsWith("articles/") && pathParts.length > 2) {
    return pathParts[1]; // articles/[category]/file.md
  }

  return "general";
}

/**
 * Adds category to post frontmatter based on folder structure
 * @param {Object} post - The post object
 * @returns {Object} - Post with updated category
 */
export function addCategoryToPost(post) {
  const category = extractCategory(post);

  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
      category: post.frontmatter.category || category,
    },
  };
}

/**
 * Filters posts to only include recipes
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Filtered array of recipe posts
 */
export function filterRecipes(posts) {
  return posts.filter(isRecipe);
}

/**
 * Filters posts to only include guides
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Filtered array of guide posts
 */
export function filterGuides(posts) {
  return posts.filter(isGuide);
}

/**
 * Filters posts to only include articles (non-recipes, non-guides)
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Filtered array of article posts
 */
export function filterArticles(posts) {
  return posts.filter(isArticle);
}

/**
 * Sorts posts with featured posts first, then by date (most recent first)
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Sorted array of posts
 */
export function sortPosts(posts) {
  return posts.sort((a, b) => {
    // First, prioritize featured posts
    const aFeatured = a.frontmatter?.featured === true;
    const bFeatured = b.frontmatter?.featured === true;

    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;

    // Then sort by date (most recent first)
    const aDate = new Date(a.frontmatter?.date || 0);
    const bDate = new Date(b.frontmatter?.date || 0);
    return bDate.getTime() - aDate.getTime();
  });
}

/**
 * Processes posts by adding categories and sorting
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Processed array of posts
 */
export function processPosts(posts) {
  const postsWithCategories = posts.map(addCategoryToPost);
  return sortPosts(postsWithCategories);
}

/**
 * Gets and processes only recipe posts
 * @param {Array} posts - Array of all post objects
 * @returns {Array} - Processed array of recipe posts only
 */
export function getRecipes(posts) {
  const recipes = filterRecipes(posts);
  return processPosts(recipes);
}

/**
 * Gets and processes only guide posts
 * @param {Array} posts - Array of all post objects
 * @returns {Array} - Processed array of guide posts only
 */
export function getGuides(posts) {
  const guides = filterGuides(posts);
  return processPosts(guides);
}

/**
 * Gets and processes only article posts
 * @param {Array} posts - Array of all post objects
 * @returns {Array} - Processed array of article posts only
 */
export function getArticles(posts) {
  const articles = filterArticles(posts);
  return processPosts(articles);
}

/**
 * Filters posts to exclude recipes (everything that is NOT a recipe)
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Filtered array of non-recipe posts
 */
export function filterNonRecipes(posts) {
  return posts.filter(post => !isRecipe(post));
}

/**
 * Gets and processes all posts that are NOT recipes
 * @param {Array} posts - Array of all post objects
 * @returns {Array} - Processed array of non-recipe posts
 */
export function getNonRecipes(posts) {
  const nonRecipes = filterNonRecipes(posts);
  return processPosts(nonRecipes);
}
