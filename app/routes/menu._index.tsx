import { Link } from "@remix-run/react";
import { Search, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "~/components/SearchBar";
import { mainNavItems } from "~/config/navigation";

export default function MobileMenu() {
  const [theme, setTheme] = useState<string>('auto');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menu</h1>
          <Link 
            to="/" 
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ✕
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Search size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Search</span>
        </div>
        <SearchBar />
      </div>

      {/* Navigation Menu */}
      <div className="p-4">
        <nav>
          <ul className="space-y-4">
            {mainNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {IconComponent && (
                        <span className="text-gray-600 dark:text-gray-400">
                          <IconComponent size={20} />
                        </span>
                      )}
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {IconComponent && (
                        <span className="text-gray-600 dark:text-gray-400">
                          <IconComponent size={20} />
                        </span>
                      )}
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-8">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="text-gray-600 dark:text-gray-400">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            Theme: {theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </div>
  );
}