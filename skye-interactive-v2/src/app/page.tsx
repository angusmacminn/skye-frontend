import Header from "@/components/Header";
import Hero from "@/components/home-page/Hero";
import Works from "@/components/home-page/Works";
import Services from "@/components/home-page/Services";
import Footer from "@/components/Footer";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Works />
        <Services />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
