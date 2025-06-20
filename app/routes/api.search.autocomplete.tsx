import type { LoaderFunction, HeadersFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import repo from "../../repo";
import { CachePolicies, createCacheHeaders } from "~/lib/cache";

export const headers: HeadersFunction = () => {
  return createCacheHeaders(CachePolicies.api());
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  
  if (!query || query.trim().length < 2) {
    return json([]);
  }

  try {
    const suggestions = await repo.searchAutocomplete(query.trim());
    return json(suggestions);
  } catch (error) {
    console.error("Autocomplete search error:", error);
    return json([]);
  }
};