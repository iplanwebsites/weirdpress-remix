
export default function AboutCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
      <div className="prose dark:prose-invert max-w-none">
        <div className="flex justify-center mb-6">
          <img 
            src="https://static.repo.md/projects/6851d519ac5bcd832fb4c887/_shared/medias/3bb993e51798a8d5eaadd94763710ea78c0357e356c70ea1f066045128e26f00-lg.webp"
            alt="WeirdPress Photo portrait"
            className="w-64 h-64 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
          />
        </div>
        
        <img 
          src="/img/wpp4.svg"
          alt="WeirdPress Photo"
          className="w-full"
          style={{marginTop: '-100px'}}
        />

        <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
         Showcasing Exceptional
AI Photojournalism
        </h3>
      
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Documenting the intersection of journalism and visual art through compelling press photography.
        </p>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          We showcase photographers who capture history in the making — from breaking news to cultural moments that define our times.
        </p> 
        
        <div className="space-y-2 text-sm">
          <div>
            <a href="/about" className="text-blue-700 dark:text-blue-400 hover:underline">📸 About WeirdPress</a>
          </div>
          <div>
            <a href="/projects/all" className="text-blue-700 dark:text-blue-400 hover:underline">🎞️ Browse all projects</a>
          </div>
        </div>
      </div>
    </div>
  );
}