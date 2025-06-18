export default function BookPromo() {
  return (
    <section className="foot-banner mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-8">
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4 text-black">
              Support AI journalism &amp; the future of Photography
            </h3>
            <p className="text-lg ">
              Weird Press Photo operates entirely from donations.
              <br />
              Help us in our mission by donating as little as $5.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://www.patreon.com/weirdpressphoto"
              className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors text-center"
            >
              Donate
            </a>
            <a 
              href="/book"
              className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors text-center"
            >
              Pre-order the Book
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}