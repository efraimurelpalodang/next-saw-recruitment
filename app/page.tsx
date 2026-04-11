import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServiceCards from "@/components/landing/ServiceCards";
import ProductGrid from "@/components/landing/ProductGrid";
import JobListingPreview from "@/components/landing/JobListingPreview";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ServiceCards />
        <ProductGrid />
        <JobListingPreview />
      </main>
      <Footer />
    </div>
  );
}
