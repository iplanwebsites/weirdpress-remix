interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/img/wpp4.svg" 
        alt="WeirdPress Photo"
        className="h-10  w-auto"
      />
    </div>
  );
}