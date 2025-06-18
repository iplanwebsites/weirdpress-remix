declare module 'repo-md' {
  export function createViteProxy(projectId: string, path: string): any;
  
  export interface RepoMD {
    getAllPosts(): Promise<any[]>;
    getPostBySlug(slug: string): Promise<any>;
    getSimilarPostsByHash(hash: string, limit: number): Promise<any[]>;
    searchPosts(query: string): Promise<any>;
    getMedia(): Promise<any[]>;
  }
  
  const repo: RepoMD;
  export default repo;
}