import { useState } from 'react';

interface ShareUrls {
  twitter: string;
  linkedin: string;
  facebook: string;
}

interface ShareButton {
  name: string;
  url: string;
  icon: JSX.Element;
  onClick?: () => void;
}

interface ShareBarProps {
  url: string;
  title: string;
}

export default function ShareBar({ url, title }: ShareBarProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const shareUrls: ShareUrls = {
    twitter: `https://x.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareButtons: ShareButton[] = [
    {
      name: 'X',
      url: shareUrls.twitter,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" stroke="none" fill="currentColor" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: shareUrls.linkedin,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: shareUrls.facebook,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      name: 'Link',
      url: '',
      onClick: copyToClipboard,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex gap-3 mt-6">
      {shareButtons.map((button) => (
        <div key={button.name}>
          {button.onClick ? (
            <button
              onClick={button.onClick}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 ${
                copied 
                  ? 'bg-green-500 dark:bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title={`Copy ${button.name}`}
            >
              {button.icon}
            </button>
          ) : (
            <a
              href={button.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:scale-105"
              title={`Share on ${button.name}`}
            >
              {button.icon}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}