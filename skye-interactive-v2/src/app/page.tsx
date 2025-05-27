import Header from "@/components/Header";
import Hero from "@/components/home-page/Hero";
import Works from "@/components/home-page/Works";
import Services from "@/components/home-page/Services";

export default function Home() {
  return (
    <>
      {/* Move Header outside of the main container */}
      <Header />
      <main>
        <Hero />
        <Works />
        <Services />
        <div className="h-screen bg-blue-100 flex items-center justify-center">
          <p className="text-2xl">Scroll test section 1</p>
        </div>
        <div className="h-screen bg-green-100 flex items-center justify-center">
          <p className="text-2xl">Scroll test section 2</p>
        </div>
        <div className="h-screen bg-yellow-100 flex items-center justify-center">
          <p className="text-2xl">Scroll test section 3</p>
        </div>
        <div className="h-screen bg-purple-100 flex items-center justify-center">
          <p className="text-2xl">Scroll test section 4</p>
        </div>
      </main>
    </>
  );
}
