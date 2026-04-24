import Link from "next/link";
import Image from "next/image";
import { SpeakingTasks } from "@/constants/data";
import { Button } from "@/components/ui/button";

const Page = async () => {

  return (
    <div className="min-h-screen text-white px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">
          Your Personalized Recommendations
        </h1>
        <section>
          <h2 className="text-xl font-semibold mb-6">New Speaking Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SpeakingTasks.map((card, index) => (
              <Link href={'/practice'} key={index}>
                <div
                  key={index}
                  className="group bg-gray-800 rounded-xl overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={`${card.img}?w=800&h=600&fit=crop`}
                      alt={card.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300" /></div>
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white transition group-hover:text-blue-400">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 opacity-80 group-hover:opacity-100 transition">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
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
              <Link href={'/pronunciation'}>
                <Button variant={'outline'} className="mt-4 cursor-pointer md:mt-0 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">
                  Start Practice
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
