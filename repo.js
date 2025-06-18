/**
 * Instance of the RepoMD client to be used throughout the application.
 * This ensures we're using a single consistent client with the same configuration.
 */

//import RepoMD from "./repo-old-local-copy/index.js";
// import RepoMD from "../repo-client/src/lib/index.js";
import { RepoMD } from "repo-md";
import { appConfig } from "./app/appConfig.js";

// Create and export a singleton instance of the RepoMD client
const repo = new RepoMD({
  projectId: appConfig.repoMd.projectId,

  // rev: "68135ef83eb888fca85d2645", //  default to latest release if none are passed.

  debug: appConfig.repoMd.debug,
  revCacheExpirySeconds: appConfig.repoMd.revCacheExpirySeconds,
  debug_rev_caching: appConfig.repoMd.debugRevCaching,

  //project: "680e97604a0559a192640d2c", //will be retired
  //org: "iplanwebsites",
});

export default repo;
