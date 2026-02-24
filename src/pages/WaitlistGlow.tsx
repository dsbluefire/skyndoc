import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { submitToWaitlist } from "@/lib/supabase";

const WaitlistGlow = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(true);
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
    
    if (!firstName || !lastName) {
      toast({
        title: "Name required",
        description: "Please enter your first and last name",
        variant: "destructive",
      });
      return;
    }

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
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      box_type: 'glow',
      formatted_phone: `${countryCode} ${phoneNumber}`,
      country_code: countryCode,
    });

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you when Personalized Box launches.",
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
    <>
      {/* Promotional Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl max-w-md md:max-w-2xl w-full relative shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowPromoModal(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-black hover:text-gray-700 transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col">
              {/* Top - Image */}
              <div className="h-48 md:h-64 bg-white">
                <img 
                  src="/popup.jpg" 
                  alt="Promotional offer" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Bottom - Content */}
              <div className="p-6 md:p-10 flex flex-col justify-center space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4 text-center">
                  <h2 className="text-3xl md:text-4xl text-black leading-tight uppercase">
                    Get a bonus item
                  </h2>
                  <p className="text-base md:text-lg text-gray-800">
                    When you join the waitlist today.
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowPromoModal(false)}
                  className="w-full h-14 md:h-16 bg-black hover:bg-gray-800 text-white text-base md:text-lg font-bold uppercase tracking-wider shadow-xl"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                Personalized Box
                <br />
                Personalized skincare journey
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                Get 9-12 samples weekly for $19.99. We analyze your skin and tailor your routine with weekly check-ins from Skyndoc specialists. Experience a truly personalized skincare journey.
              </p>
            </div>

            {/* Social Proof Badge */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 max-w-fit">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                <div className="w-6 h-6 rounded-full bg-green-400"></div>
                <div className="w-6 h-6 rounded-full bg-green-600"></div>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                48 people signed up in the past hour
              </p>
            </div>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 bg-black border-black rounded-2xl text-base text-white placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 bg-black border-black rounded-2xl text-base text-white placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
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
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-lg max-w-lg">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">You're on the list!</p>
                  <p className="text-sm text-gray-600">
                    We'll notify you when Personalized Box launches.
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
              alt="Personalized Box illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default WaitlistGlow;

