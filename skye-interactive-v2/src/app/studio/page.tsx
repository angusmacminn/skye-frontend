import Header from "@/components/Header";
import StudioHero from "@/components/studio-page/StudioHero";
import StudioAbout from "@/components/studio-page/StudioAbout";
import StudioApproach from "@/components/studio-page/StudioApproach";
import StudioServices from "@/components/studio-page/StudioServices";
import Footer from "@/components/Footer";
import ContactCTA from "@/components/ContactCTA";



export default function StudioPage() {
  return (
    <>
      <Header />
        <main>
          <StudioHero />
          <StudioAbout />
          <StudioApproach />
          <StudioServices />
          <ContactCTA />
        </main>
      <Footer />
    </>
    
  );
}
