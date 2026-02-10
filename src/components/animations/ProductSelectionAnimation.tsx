import { useEffect, useState } from "react";

const ProductSelectionAnimation = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  const products = [
    { id: 0, name: "Cleanser", color: "bg-blue-100" },
    { id: 1, name: "Toner", color: "bg-green-100" },
    { id: 2, name: "Serum", color: "bg-purple-100" },
    { id: 3, name: "Moisturizer", color: "bg-pink-100" },
  ];

  // Cursor positions for each product (x, y in pixels) - centered on each card
  const cursorPositions = [
    { x: 60, y: 32 },  // Product 0 (left column, top)
    { x: 240, y: 32 }, // Product 1 (right column, top)
    { x: 60, y: 96 },  // Product 2 (left column, bottom)
    { x: 240, y: 96 }, // Product 3 (right column, bottom)
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const nextStep = (prev + 1) % 9; // Changed to 9 steps (4 products × 2 actions + 1 reset)
        
        if (nextStep === 0) {
          // Reset
          setSelectedProducts([]);
          setCursorPosition({ x: 0, y: 0 });
          setIsClicking(false);
        } else {
          // Calculate which product we're working with
          const actionIndex = nextStep - 1;
          const productIndex = Math.floor(actionIndex / 2);
          const isMoving = actionIndex % 2 === 0; // Even = moving, Odd = clicking
          
          if (isMoving && productIndex < 4) {
            // Move cursor to product
            setCursorPosition(cursorPositions[productIndex]);
            setIsClicking(false);
          } else if (!isMoving && productIndex < 4) {
            // Click and select product
            setIsClicking(true);
            setTimeout(() => {
              setSelectedProducts((prev) => [...prev, productIndex]);
              setIsClicking(false);
            }, 100);
          }
        }
        
        return nextStep;
      });
    }, 600); // Faster interval for smoother animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white/90" />
      
      {/* Product Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 h-full p-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`relative rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center ${
              selectedProducts.includes(index)
                ? 'border-green-500 bg-green-50 scale-95'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Product Icon/Image */}
            <div className={`w-8 h-8 rounded-full ${product.color} mb-1 flex items-center justify-center`}>
              <div className="w-4 h-4 bg-white/60 rounded-sm" />
            </div>
            
            {/* Product Name */}
            <div className="text-[9px] font-medium text-gray-700">{product.name}</div>
            
            {/* Checkmark when selected */}
            {selectedProducts.includes(index) && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Animated Cursor */}
      {step > 0 && (
        <div 
          className={`absolute pointer-events-none z-20 transition-all duration-500 ease-out ${
            isClicking ? 'scale-90' : 'scale-100'
          }`}
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M3 3L10 17L12 10L17 8L3 3Z" 
              fill="black" 
              stroke="white" 
              strokeWidth="1.2"
            />
          </svg>
          
          {/* Click ripple effect */}
          {isClicking && (
            <div className="absolute top-0 left-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-blue-500/30 rounded-full animate-ping" />
          )}
        </div>
      )}

      {/* Success overlay */}
      {step === 0 && selectedProducts.length === 4 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-50/70 animate-in fade-in duration-300">
          <div className="text-3xl animate-in zoom-in-50 duration-200">🎉</div>
        </div>
      )}
    </div>
  );
};

export default ProductSelectionAnimation;


