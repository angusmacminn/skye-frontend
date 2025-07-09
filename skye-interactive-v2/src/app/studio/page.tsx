import Header from "@/components/Header";
import StudioHero from "@/components/studio-page/StudioHero";
import StudioAbout from "@/components/studio-page/StudioAbout";



export default function StudioPage() {
  return (
    <>
      <Header />
      <main>
        <StudioHero />
        <StudioAbout />
      </main>
    </>
    
  );
}
