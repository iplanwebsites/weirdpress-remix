interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/img/wpp4.svg" 
        alt="Weird Press Photo"
        className="h-10  w-auto"
      />
    </div>
  );
}