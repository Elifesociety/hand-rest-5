import { motion } from 'framer-motion';
import logo from '@/assets/handrest-logo.jpeg';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gradient-hero"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500);
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <img 
          src={logo} 
          alt="HandRest Cleaning Solutions" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-2xl shadow-elevated"
        />
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 text-2xl md:text-3xl font-bold text-brand-navy text-center"
      >
        HandRest Cleaning Solutions
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-4 text-lg md:text-xl text-brand-teal font-medium italic"
      >
        "You Relax. We Restore."
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-12"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-brand-teal"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
