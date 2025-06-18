/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { appConfig } from "./appConfig";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  // Force HTTPS for .com domains (excluding localhost)
  const url = new URL(request.url);
  const isComDomain = url.hostname.endsWith('.com');
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isHttps = url.protocol === 'https:';
  
  if (isComDomain && !isLocalhost && !isHttps) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return new Response(null, {
      status: 301,
      headers: {
        Location: httpsUrl.toString(),
      },
    });
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  const body = await renderToReadableStream(
    <RemixServer
      context={remixContext}
      url={request.url}
      abortDelay={ABORT_DELAY}
    />,
    {
      signal: controller.signal,
      onError(error: unknown) {
        if (!controller.signal.aborted) {
          // Log streaming rendering errors from inside the shell
          console.error(error);
        }
        responseStatusCode = 500;
      },
    }
  );

  body.allReady.then(() => clearTimeout(timeoutId));

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  
  // Set cache headers for stale-while-revalidate behavior
  const cacheMaxAge = 60; // 1 minute fresh
  const staleWhileRevalidate = appConfig.cache.apiCacheDuration; // 15 minutes stale
  responseHeaders.set("Cache-Control", `public, max-age=${cacheMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`);
  
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
