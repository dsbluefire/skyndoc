import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import SubscriptionBoxes from "@/components/home/SubscriptionBoxes";

const SubscriptionBoxesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Subscription Boxes</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the perfect subscription box for your skincare journey. Get premium K-beauty samples delivered weekly.
          </p>
        </div>
        
        <SubscriptionBoxes />
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionBoxesPage;
