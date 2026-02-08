import { motion } from 'framer-motion';
import { Check, Clock, Users, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Package } from '@/types/database';

interface PackageCardProps {
  pkg: Package;
  onSelect: () => void;
  index: number;
  isPopular?: boolean;
}

export function PackageCard({ pkg, onSelect, index, isPopular }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 ${
        isPopular ? 'ring-2 ring-brand-teal' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-brand-teal text-white text-xs font-semibold py-1 text-center">
          MOST POPULAR
        </div>
      )}
      
      <div className={`p-6 ${isPopular ? 'pt-10' : ''}`}>
        <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-brand-navy">₹{pkg.price.toLocaleString()}</span>
          {pkg.name === 'PREMIUM PACKAGE' && (
            <span className="text-sm text-muted-foreground ml-1">onwards</span>
          )}
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pkg.duration_hours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{pkg.min_staff} staff</span>
          </div>
          {pkg.max_sqft && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{pkg.max_sqft} sq.ft</span>
            </div>
          )}
        </div>
        
        {/* Features list */}
        <ul className="space-y-2 mb-6">
          {pkg.features.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
          {pkg.features.length > 5 && (
            <li className="text-sm text-brand-teal font-medium">
              +{pkg.features.length - 5} more features
            </li>
          )}
        </ul>
        
        <Button 
          onClick={onSelect} 
          variant={isPopular ? "hero" : "outline"}
          className="w-full"
        >
          Select Package
        </Button>
      </div>
    </motion.div>
  );
}
