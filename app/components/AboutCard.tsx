
export default function AboutCard() {
  return (
    <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-6 shadow-lg">
      <div className="prose dark:prose-invert max-w-none">
        <div className="flex justify-center mb-6">
          <img 
            src="https://static.repo.md/projects/6851d519ac5bcd832fb4c887/_shared/medias/3bb993e51798a8d5eaadd94763710ea78c0357e356c70ea1f066045128e26f00-lg.webp"
            alt="Weird Press Photo portrait"
            className="w-64 h-64 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
          />
        </div>
        
        <img 
          src="/img/wpp4.svg"
          alt="Weird Press Photo"
          className="w-full"
          style={{marginTop: '-100px'}}
        />

        <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Embracing the future of Photography and Journalism
        </h3>
      
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Since 2022, we&apos;re dedicated to showcasing the best of AI photojournalism. We celebrate pure mathematical storytelling that is free from human bias.
        </p>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          We encourage critical reflection on the role and place of technology. We hope you&apos;ll have a great time exploring these exceptional AI contributions to the world.
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