import Header from "@/components/Header";
import Hero from "@/components/home-page/Hero";
import Works from "@/components/home-page/Works";
import Services from "@/components/home-page/Services";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Move Header outside of the main container */}
      <Header />
      <main>
        <Hero />
        <Works />
        <Services />
      </main>
      <Footer />
    </>
  );
}
