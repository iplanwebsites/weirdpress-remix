interface AiBadgeProps {
  size?: 'sm' | 'md';
}

export default function AiBadge({ size = 'md' }: AiBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs'
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} font-medium text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-300`}>
      AI
    </span>
  );
}