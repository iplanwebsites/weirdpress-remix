import { useEffect, useRef } from 'react';
import { Link2 } from 'lucide-react';

interface BlogContentProps {
  html: string;
}

export default function BlogContent({ html }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all anchor tags inside headings
    const anchorHeadings = contentRef.current.querySelectorAll('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a');
    
    anchorHeadings.forEach((anchor) => {
      // Remove existing underline styling
      (anchor as HTMLElement).style.textDecoration = 'none';
      
      // Add heading-anchor class for hover effects
      anchor.classList.add('heading-anchor');
      
      // Create link icon if it doesn't exist
      if (!anchor.querySelector('.link-icon')) {
        const linkIcon = document.createElement('span');
        linkIcon.className = 'link-icon';
        linkIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
        anchor.appendChild(linkIcon);
      }
    });
  }, [html]);

  return (
    <div 
      ref={contentRef}
      className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-3xl"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}