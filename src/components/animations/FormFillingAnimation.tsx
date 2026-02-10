import { useEffect, useState } from "react";

const FormFillingAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 overflow-hidden">
      {/* Form Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      
      {/* Form Fields */}
      <div className="relative z-10 space-y-2">
        {/* Skin Type Field */}
        <div className="flex items-center gap-2">
          <div className="w-16 text-xs text-gray-500 font-medium">Skin Type:</div>
          <div className="flex-1 h-6 bg-white border border-gray-200 rounded px-2 flex items-center text-xs">
            <span className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              Oily
            </span>
            {/* Typing cursor */}
            {step === 0 && (
              <span className="inline-block w-px h-3 bg-black animate-pulse ml-0.5" />
            )}
          </div>
        </div>

        {/* Concerns Field */}
        <div className="flex items-center gap-2">
          <div className="w-16 text-xs text-gray-500 font-medium">Concerns:</div>
          <div className="flex-1 h-6 bg-white border border-gray-200 rounded px-2 flex items-center text-xs">
            <span className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              Acne, Dark spots
            </span>
            {/* Typing cursor */}
            {step === 1 && (
              <span className="inline-block w-px h-3 bg-black animate-pulse ml-0.5" />
            )}
          </div>
        </div>

        {/* Goals Field */}
        <div className="flex items-center gap-2">
          <div className="w-16 text-xs text-gray-500 font-medium">Goals:</div>
          <div className="flex-1 h-6 bg-white border border-gray-200 rounded px-2 flex items-center text-xs">
            <span className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              Clear skin
            </span>
            {/* Typing cursor */}
            {step === 2 && (
              <span className="inline-block w-px h-3 bg-black animate-pulse ml-0.5" />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button 
            className={`px-4 py-1 rounded text-xs font-medium transition-all duration-500 ${
              step === 3 
                ? 'bg-green-500 text-white scale-105' 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {step === 3 ? '✓ Submitted' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Animated Cursor */}
      <div 
        className="absolute pointer-events-none z-20 transition-all duration-1000 ease-in-out"
        style={{
          left: step === 0 ? '90px' : step === 1 ? '90px' : step === 2 ? '90px' : '200px',
          top: step === 0 ? '20px' : step === 1 ? '40px' : step === 2 ? '60px' : '95px',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 3L10 17L12 10L17 8L3 3Z" 
            fill="black" 
            stroke="white" 
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Checkmark animation on submit */}
      {step === 3 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-50/50 animate-in fade-in duration-500">
          <div className="text-5xl animate-in zoom-in-50 duration-300">✓</div>
        </div>
      )}
    </div>
  );
};

export default FormFillingAnimation;


