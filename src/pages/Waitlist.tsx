import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, Phone } from "lucide-react";
import { submitToWaitlist } from "@/lib/supabase";

const Waitlist = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const countryCodes = [
    { code: "+1", flag: "🇺🇸", name: "US" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+91", flag: "🇮🇳", name: "IN" },
    { code: "+86", flag: "🇨🇳", name: "CN" },
    { code: "+81", flag: "🇯🇵", name: "JP" },
    { code: "+82", flag: "🇰🇷", name: "KR" },
    { code: "+33", flag: "🇫🇷", name: "FR" },
    { code: "+49", flag: "🇩🇪", name: "DE" },
    { code: "+61", flag: "🇦🇺", name: "AU" },
    { code: "+7", flag: "🇷🇺", name: "RU" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    // Submit to Supabase backend
    const result = await submitToWaitlist({
      phone_number: phoneNumber,
      box_type: 'general',
      formatted_phone: `${countryCode} ${phoneNumber}`,
      country_code: countryCode,
    });

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you when we launch.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Main Content */}
      <main className="flex-1 grid md:grid-cols-2 w-full">
        {/* Left Column */}
        <div className="bg-white px-6 md:px-16 py-8 md:py-12 flex flex-col min-h-screen">
          {/* Logo */}
          <div className="mb-12 md:mb-8">
            <Link to="/">
              <img src="/skyndoc.svg" alt="Skyndoc" className="h-7 md:h-10 cursor-pointer" />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-6 md:space-y-8 max-w-xl">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-5xl leading-tight text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
                A new way to experience
                <br />
                subscription boxes
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                We deliver Korean skincare products to your doorstep weekly. You pick and choose sample-sized products for a price you can't find on Amazon. Join our waitlist to be the first to know when we launch.
              </p>
            </div>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <div className="flex-1 relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent text-white border-none outline-none cursor-pointer text-base font-medium"
                    style={{ width: '70px' }}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code} className="bg-gray-900 text-white">
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 pl-24 bg-black border-black rounded-2xl text-base text-white placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-8 bg-black hover:bg-gray-900 text-white rounded-2xl font-medium w-full sm:w-auto"
                >
                  Join Waitlist
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-lg max-w-lg">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">You're on the list!</p>
                  <p className="text-sm text-gray-600">
                    We'll notify you when we launch.
                  </p>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-8 md:pt-12 text-xs md:text-sm text-gray-500 bg-white" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            <p>© 2026 - Skyndoc Inc. - Save money on skincare and find items that work.</p>
            <p className="mt-1">
              Built in New York. Built by Brown University alumni.
            </p>
          </footer>
        </div>

        {/* Right Column - Illustration */}
        <div className="flex items-center justify-center bg-white px-8 md:px-16 py-12 md:min-h-screen">
          <div className="relative w-full max-w-md">
            <img
              src="/line drawing version 2.jpg"
              alt="Subscription box illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Waitlist;

