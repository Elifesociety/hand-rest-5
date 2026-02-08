import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickCleanBannerProps {
  onTryNow: () => void;
}

export function QuickCleanBanner({ onTryNow }: QuickCleanBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden gradient-brand rounded-2xl p-6 shadow-elevated"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-white/90 text-sm font-medium">Limited Time Offer</span>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-1">Quick Clean</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-white">₹1,200</span>
          <div className="flex items-center gap-1 text-white/90">
            <Clock className="w-4 h-4" />
            <span>1 Hour</span>
          </div>
        </div>
        
        <p className="text-white/80 text-sm mb-4">
          Fast, affordable cleaning for homes up to 1000 sq.ft
        </p>
        
        <Button
          onClick={onTryNow}
          className="w-full bg-white text-brand-teal font-semibold hover:bg-white/90 rounded-full group"
        >
          Try Now
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
