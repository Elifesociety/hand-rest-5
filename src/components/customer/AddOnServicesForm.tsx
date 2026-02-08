import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sofa, BedDouble, Shirt, Zap, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Package } from '@/types/database';

export interface AddOn {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

const ADDON_LIST: AddOn[] = [
  { id: 'sofa_cleaning', name: 'Sofa Cleaning', price: 499, icon: <Sofa className="w-5 h-5" /> },
  { id: 'mattress_cleaning', name: 'Mattress Cleaning', price: 399, icon: <BedDouble className="w-5 h-5" /> },
  { id: 'dry_cleaning', name: 'Dry Cleaning Support', price: 599, icon: <Shirt className="w-5 h-5" /> },
  { id: 'electrician', name: 'Electrician Support', price: 349, icon: <Zap className="w-5 h-5" /> },
  { id: 'plumbing', name: 'Plumbing (Minor)', price: 299, icon: <Wrench className="w-5 h-5" /> },
];

interface AddOnServicesFormProps {
  pkg: Package;
  onSubmit: (selectedAddOns: string[], totalAddonPrice: number) => void;
}

export function AddOnServicesForm({ pkg, onSubmit }: AddOnServicesFormProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleAddon = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addonTotal = ADDON_LIST.filter(a => selected.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  const grandTotal = pkg.price + addonTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Array.from(selected), addonTotal);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Package context */}
      <div className="bg-brand-light-blue rounded-xl p-4">
        <h3 className="font-semibold text-brand-navy">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground">{pkg.category?.name}</p>
        <p className="text-lg font-bold text-brand-teal mt-1">Base: ₹{pkg.price.toLocaleString()}</p>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-4">Select Add-on Services</h4>
        <div className="space-y-3">
          {ADDON_LIST.map((addon, index) => (
            <motion.label
              key={addon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              htmlFor={addon.id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                selected.has(addon.id)
                  ? 'border-secondary bg-secondary/5 shadow-soft'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <Checkbox
                id={addon.id}
                checked={selected.has(addon.id)}
                onCheckedChange={() => toggleAddon(addon.id)}
              />
              <span className="text-muted-foreground">{addon.icon}</span>
              <span className="flex-1 font-medium text-foreground">{addon.name}</span>
              <span className="font-semibold text-brand-teal">₹{addon.price}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Pricing summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Base Package</span>
          <span>₹{pkg.price.toLocaleString()}</span>
        </div>
        {addonTotal > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Add-ons ({selected.size})</span>
            <span>₹{addonTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-brand-teal">₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <Button type="submit" variant="hero" size="xl" className="w-full">
        Continue to Booking
      </Button>
    </motion.form>
  );
}

export { ADDON_LIST };
