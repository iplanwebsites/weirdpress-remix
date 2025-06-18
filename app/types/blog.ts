/**
 * Blog post data structures
 */

/**
 * Table of contents item
 */
export interface TocItem {
  // Structure will depend on your actual TOC data
  // This is a placeholder until we know the exact structure
  [key: string]: any;
}

/**
 * Front matter for blog posts
 */
export interface Frontmatter {
  /**
   * Post title
   */
  title: string;
  
  /**
   * Whether the post is public
   */
  public: boolean;
  
  /**
   * Post category
   */
  category?: string;
  
  /**
   * Post tags
   */
  tags?: string[];
  
  /**
   * Post date
   */
  date?: string;
  
  /**
   * Post description
   */
  description?: string;
  
  /**
   * Any other front matter properties
   */
  [key: string]: any;
}

/**
 * Represents a blog post
 */
export interface Post {
  /**
   * File name of the post
   */
  fileName: string;
  
  /**
   * Slug for the post URL
   */
  slug: string;
  
  /**
   * Front matter metadata
   */
  frontmatter: Frontmatter;
  
  /**
   * First paragraph text
   */
  firstParagraphText: string;
  
  /**
   * Plain text content
   */
  plain: string;
  
  /**
   * HTML content
   */
  html: string;
  
  /**
   * Table of contents
   */
  toc: TocItem[];
  
  /**
   * Original file path
   */
  originalFilePath: string;
  
  /**
   * First image from the post content
   */
  firstImage?: string;
  
  /**
   * Recipe rating (1-5 stars)
   */
  rating?: number;
  
  /**
   * Number of reviews
   */
  reviewCount?: number;
  
  /**
   * Average rating
   */
  avgRating?: number;

  cover?: string;
  ['cover-sm']?: string;
  ['cover-lg']?: string;
}