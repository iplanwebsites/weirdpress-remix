import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";
import { viteRepoMdProxy } from "repo-md";
import { appConfig } from "./app/appConfig.js";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

const viteProxy1 = viteRepoMdProxy(
 { projectId: appConfig.repoMd.projectId, route:'_repo'})
//const viteProxy2 = createViteProxy('6848af1cacdf98346841d302', '_repo_docs')
//const viteProxy3 = createViteProxy('6848af1cacdf98346841d302', '_repo_blog')


console.log(viteProxy1);
export default defineConfig({
  plugins: [
    cloudflareDevProxyVitePlugin({
      getLoadContext,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      ...viteProxy1,
      //...viteProxy2,
      //...viteProxy3,
    }
  },
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  build: {
    minify: true,
  },
});
