import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  
  if (!slug) {
    throw new Response("Not found", { status: 404 });
  }
  
  // Redirect /blog/slug to /slug
  return redirect(`/${slug}`, { status: 301 });
};