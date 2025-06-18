import ThemeToggle from "./ThemeToggle";
import { Mail, Twitter, Instagram, Facebook } from "lucide-react";
import { mainNavItems } from "~/config/navigation";
import { appConfig } from '../appConfig.js';

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/weirdpressphoto", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/weirdpressphoto", label: "Twitter" },
    { icon: Facebook, href: "https://www.facebook.com/Weird-Press-Photo-100899852714211/", label: "Facebook" },
    { icon: Mail, href: `mailto:${appConfig.contact.email}`, label: "Email" }
  ];

  const footerNavItems = [
        { href: "/about", label: "About", external: false }, 
      { href: "/projects", label: "All Projects", external: false },
   //       { href: "/contact", label: "Contact" },
       
    //  ...mainNavItems.filter(item => item.external && item.label === "Chat"),
   

  
  
   // { href: "/sitemap", label: "Site Map" }
  ];


  const devNavItems = [

    { href: "/2024", label: "2024", external: false },
    //2023
    { href: "/2023", label: "2023", external: false },

    { href: "/2022", label: "2022", external: false },


      // ...mainNavItems.filter(item => item.external && item.label === "Chat"),
         {
    href: appConfig.services.chatUrl,
    label: "Chat",
 
    external: true,
  },
      { href: "/media", label: "Image Gallery", external: false },
        //  { href: "/contact", label: "Contact" },
   //        { href: "/blog", label: "Blog (legacy)", external: false },
      { href: "/suggest", label: "Suggestions", external: false },
   
   

  
  
   // { href: "/sitemap", label: "Site Map" }
  ];


  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">
        {/* Section 1: logo - 4 columns (logo larger, more from us separate) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Logo (larger) */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="flex flex-col items-center">
                <img 
                  src="/img/wpp4.svg"
                  alt="WeirdPress Photo"
                  className="h-24 w-auto mb-3 object-contain"
                />
               
              </div>
            </div>
          </div>

          {/* Column 2: More From Us */}
          <div>
            <nav>
              <p className="text-lg font-semibold mb-4">More </p>
              <ul className="space-y-3">
                {footerNavItems.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <a
                        href={item.href}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

            <div>
            <nav>
              <p className="text-lg font-semibold mb-4">Gallery </p>
              <ul className="space-y-3">
                {devNavItems.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <a
                        href={item.href}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>


          {/* Column 3: Follow Along */}
          <div>
            <p className="text-lg font-semibold mb-4">Follow along</p>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="socialicon"
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
            
            <ThemeToggle />
          </div>

          {/* Column 4: Newsletter + Policies */}
          <div>
            <p className="text-lg font-semibold mb-4">Newsletter</p>
            <p className="text-sm mb-4">
              Stay updated with the latest press photography exhibitions, artist features, and editorial insights.
            </p>
            
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-3 py-2 border rounded-l-md text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-md focus:outline-none"
                  style={{backgroundColor: '#fff513', color: '#000'}}
                >
                  →
                </button>
              </div>
            </form>
            
            <p className="text-xs">
              By subscribing, you acknowledge and agree to our{" "}
              <a href="/terms">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Section 2: Endgame Media - 3 columns with vertical separators */}
        {appConfig.features.showEndgame && (
          <div className="border-t pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Logo + About */}
              <div className="md:border-r md:pr-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{appConfig.company.name}</h3>
                  <p className="text-sm mb-3">
                    {appConfig.company.tagline}
                  </p>
                  <a 
                    href={appConfig.company.website}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm"
                  >
                    About →
                  </a>
                </div>
              </div>

              {/* Column 2: Brands */}
              <div className="md:border-r md:pr-8">
                <p className="text-sm font-medium mb-4">Family of Brands</p>
                <div className="space-y-2">
                  <div>
                    <a 
                      href={appConfig.brands.weirdPressPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm block"
                    >
                      Weird Press Photo
                    </a>
                  </div>
                
                  <div>
                    <a 
                      href="/" 
                      className="text-sm block"
                    >
                      {appConfig.siteName}
                    </a>
                  </div>

                     <div>
                    <a 
                      href={appConfig.brands.repoMd}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm block"
                    >
                      Repo.md
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 3: Copyright */}
              <div>
                <span className="text-sm">
                  © {new Date().getFullYear()} {appConfig.company.name}. All rights reserved.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}