import { motion } from 'framer-motion';
import { Home, Building2, Calendar, LucideIcon } from 'lucide-react';
import type { ServiceCategory } from '@/types/database';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  building: Building2,
  calendar: Calendar,
};

interface ServiceCardProps {
  category: ServiceCategory;
  onClick: () => void;
  index: number;
}

export function ServiceCard({ category, onClick, index }: ServiceCardProps) {
  const Icon = iconMap[category.icon || 'home'] || Home;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="w-full p-6 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-left group"
    >
      <div className="w-14 h-14 gradient-brand rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{category.name}</h3>
      <p className="text-sm text-muted-foreground">{category.description}</p>
    </motion.button>
  );
}
