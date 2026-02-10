import { Timer, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DealsBanner = () => {
  return (
    <section className="py-6 bg-gradient-deal text-primary-foreground">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-full animate-pulse-glow">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold">Flash Sale: Extra 30% OFF</h3>
              <p className="text-sm text-primary-foreground/80">
                On all sample sets • Limited time only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-lg">
              <Timer className="h-5 w-5" />
              <div className="flex gap-1 font-mono font-bold">
                <span className="bg-primary-foreground/30 px-2 py-1 rounded">03</span>
                <span>:</span>
                <span className="bg-primary-foreground/30 px-2 py-1 rounded">24</span>
                <span>:</span>
                <span className="bg-primary-foreground/30 px-2 py-1 rounded">59</span>
              </div>
            </div>
            <Button variant="secondary" className="bg-primary-foreground text-deal hover:bg-primary-foreground/90 font-bold">
              Shop Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsBanner;
