const Page = () => {
  return (
    <div className="min-h-screen text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-10">
          Your Personalized Recommendations
        </h1>

        {/* SECTION: New Speaking Tasks */}
        <section>
          <h2 className="text-xl font-semibold mb-6">New Speaking Tasks</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <img
                src="/images/living-space.jpg"
                alt="Living space"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">
                  Describe your ideal living space
                </h3>
                <p className="text-sm text-gray-400">
                  Practice describing your home environment
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <img
                src="/images/career.jpg"
                alt="Career"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">
                  Discuss your career aspirations
                </h3>
                <p className="text-sm text-gray-400">
                  Enhance your professional vocabulary
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <img
                src="/images/cafe.jpg"
                alt="Cafe"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">Talk about your favorite cafe</h3>
                <p className="text-sm text-gray-400">
                  Share your experiences at your favorite local spot
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Vocabulary Boost */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold mb-6">Vocabulary Boost</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">
                Words for Describing Spaces
              </h3>
              <p className="text-gray-400 mb-4">
                Expand your vocabulary with words like &lsquo;airy&rsquo;,
                &lsquo;cozy&rsquo;, and &lsquo;minimalist&rsquo;.
              </p>
              <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">
                Learn Words
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Professional Jargon</h3>
              <p className="text-gray-400 mb-4">
                Master phrases like &lsquo;synergy&rsquo;,
                &lsquo;bandwidth&rsquo;, and &lsquo;paradigm shift&rsquo;.
              </p>
              <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">
                Learn Jargon
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: Improvement Tips */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold mb-6">Improvement Tips</h2>

          <div className="flex flex-col gap-6">
            {/* Tip 1 */}
            <div className="bg-gray-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Focus on Pronunciation</h3>
                <p className="text-gray-400">
                  Practice clear enunciation to improve clarity and be better
                  understood.
                </p>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">
                Start Practice
              </button>
            </div>

            {/* Tip 2 */}
            <div className="bg-gray-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">
                  Vary Your Sentence Structure
                </h3>
                <p className="text-gray-400">
                  Use simple and complex sentences to keep speech engaging.
                </p>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
