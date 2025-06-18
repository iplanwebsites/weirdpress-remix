import { appConfig } from '../appConfig.js';

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}




export default function Logo({ 
  className = "", 
  size = "md",
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    xs: "text-sm",
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={appConfig.logos[size]} 
        alt={`${appConfig.siteName} Logo`}
        className={`${sizeClasses[size]} mr-2`}
        style={{ width: size === 'xs' ? '32px' : '50px', height: size === 'xs' ? '25px' : '40px' }}
      />
         {showText && (
      <img 
        src={appConfig.logotype} 
        alt={`${appConfig.siteName} Logotype`}
        className={`${showText ? "mr-3" : ""}`}
        style={{ height: size === 'xs' ? '20px' : '42px', marginBottom:'-5px' }}
      />
   
  
      )}
    </div>
  );
}