import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft } from "lucide-react";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const RequestProduct = () => {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send to your backend
    console.log("Product request:", { productName, brand, additionalInfo, email });
    
    setIsSubmitted(true);
    toast({
      title: "Request submitted!",
      description: "We'll review your request and get back to you soon.",
    });

    // Reset form
    setTimeout(() => {
      setProductName("");
      setBrand("");
      setAdditionalInfo("");
      setEmail("");
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />
      
      <main className="bg-white">
        <div className="container py-8 md:py-12 max-w-3xl">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Request a Product Sample
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Can't find what you're looking for? Let us know which K-beauty product you'd like to try and we'll do our best to add it to our collection.
            </p>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-900 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="productName"
                  type="text"
                  placeholder="e.g., COSRX Advanced Snail 96 Mucin Power Essence"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-900 mb-2">
                  Brand (Optional)
                </label>
                <Input
                  id="brand"
                  type="text"
                  placeholder="e.g., COSRX, Beauty of Joseon, Anua"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Information (Optional)
                </label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Tell us why you'd like to try this product or any other details..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll notify you if we add this product to our collection
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white py-6 text-base font-medium"
              >
                Submit Request
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-4 p-8 bg-green-50 border border-green-200 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">Request submitted!</p>
                <p className="text-base text-gray-600">
                  We'll review your request and notify you if we add it to our collection.
                </p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Our team reviews all product requests weekly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>We source authentic K-beauty products from trusted suppliers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>If we add your requested product, you'll be notified by email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Most requested products are added within 2-4 weeks</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestProduct;


