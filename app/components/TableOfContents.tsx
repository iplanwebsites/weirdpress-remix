import { useEffect } from "react";

interface TOCItem {
  id: string;
  title: string;
  depth: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  useEffect(() => {
    // Add smooth scrolling behavior
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Update URL without page jump
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        📋 Table of Contents
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`
              block text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors
              ${item.depth === 2 ? 'font-medium text-gray-900 dark:text-gray-100' : ''}
              ${item.depth === 3 ? 'pl-4 text-gray-700 dark:text-gray-300' : ''}
              ${item.depth === 4 ? 'pl-8 text-gray-600 dark:text-gray-400' : ''}
              ${item.depth >= 5 ? 'pl-12 text-gray-500 dark:text-gray-500' : ''}
            `}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
}