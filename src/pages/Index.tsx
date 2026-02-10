import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import HeroCarousel from "@/components/home/HeroCarousel";
import SubscriptionBoxes from "@/components/home/SubscriptionBoxes";
import BestSellers from "@/components/home/BestSellers";
import LuxurySamples from "@/components/home/LuxurySamples";
import Samples from "@/components/home/Samples";
import CategoryBrandTabs from "@/components/home/CategoryBrandTabs";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <HeroCarousel />
        <LuxurySamples />
        <Samples />
        <SubscriptionBoxes />
        <BestSellers />
        <CategoryBrandTabs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
