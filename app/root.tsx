import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";
import SearchBar from "~/components/SearchBar";
import Logo from "~/components/Logo";
import Footer from "~/components/Footer";
import { Menu, Search } from "lucide-react";
import { mainNavItems } from "~/config/navigation";
import { appConfig } from "~/appConfig.js";

import "./tailwind.css";
import "./global.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: appConfig.defaultImages.favicon, type: "image/png" },
  
  {
    rel: "preconnect",
    href: appConfig.cdn.baseUrl,
    crossOrigin: "anonymous",
  },
  /*
   No fonts = FASTER
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },

  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  */
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const root = document.documentElement;
                  
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else if (theme === 'light') {
                    root.classList.remove('dark');
                  } else {
                    // Auto mode or no preference
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      root.classList.add('dark');
                    }
                  }
                } catch (e) {
                  // Silently fail in SSR or if localStorage is not available
                }
              })();
            `,
          }}
        />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{
          __html: `
            .mobile-icons { display: flex; align-items: center; gap: 1rem; }
            @media (min-width: 768px) { .mobile-icons { display: none !important; } }
          `
        }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
      /*
            <img src="/img/icon1.png" alt="Klepto Kitchen Logo" className="h-8 w-8 inline-block mr-4" />
 <img alt="Klepto Kitchen Logo" className="h-16 w-16 inline-block mr-4" 
 src="https://static.repo.md/projects/6848af1cacdf98346841d302/_shared/medias/5930bff89ac9670773e87611308424b9c567f6e8183cf4150c72a5dca8648585-md.webp"  />
       */


export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center">
              <Logo />
            </a>
            
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                {mainNavItems.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <a
                        href={item.href}
                        className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Icons */}
            <div className="mobile-icons">
              <Link
                to="/search"
                className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500"
                aria-label="Search"
              >
                <Search size={20} />
              </Link>
              <Link
                to="/menu"
                className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500"
                aria-label="Menu"
              >
                <Menu size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
