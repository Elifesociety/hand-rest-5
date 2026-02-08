import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, ArrowUp, Trees, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Package } from '@/types/database';

export interface PropertyDetails {
  property_sqft: number;
  number_of_floors: number;
  floor_type: 'ground' | 'upstairs';
  has_outdoor_area: boolean;
}

interface PropertyDetailsFormProps {
  pkg: Package;
  onSubmit: (details: PropertyDetails) => void;
  onUpgrade: () => void;
}

export function PropertyDetailsForm({ pkg, onSubmit, onUpgrade }: PropertyDetailsFormProps) {
  const [details, setDetails] = useState<PropertyDetails>({
    property_sqft: 0,
    number_of_floors: 1,
    floor_type: 'ground',
    has_outdoor_area: false,
  });

  const isBasicPackage = pkg.name.toUpperCase().includes('BASIC');
  const exceedsBasicLimit = isBasicPackage && details.property_sqft > 1000;
  const exceedsMaxSqft = pkg.max_sqft && details.property_sqft > pkg.max_sqft;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceedsBasicLimit && !exceedsMaxSqft) {
      onSubmit(details);
    }
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
        {pkg.max_sqft && (
          <p className="text-xs text-muted-foreground mt-1">Max area: {pkg.max_sqft} sq.ft</p>
        )}
      </div>

      {/* House size */}
      <div className="space-y-2">
        <Label htmlFor="property_sqft" className="flex items-center gap-2">
          <Home className="w-4 h-4" /> House Size (sq.ft) *
        </Label>
        <Input
          id="property_sqft"
          type="number"
          min="100"
          max="10000"
          value={details.property_sqft || ''}
          onChange={(e) => setDetails(prev => ({ ...prev, property_sqft: Number(e.target.value) }))}
          placeholder="e.g. 1200"
          required
        />
        {exceedsBasicLimit && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Basic package supports up to 1000 sq.ft</p>
              <p className="text-xs mt-1">Your property exceeds the limit. Please upgrade to Standard or Premium.</p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onUpgrade}>
                View Upgrade Options
              </Button>
            </div>
          </motion.div>
        )}
        {exceedsMaxSqft && !exceedsBasicLimit && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">This package supports up to {pkg.max_sqft} sq.ft</p>
              <p className="text-xs mt-1">Consider upgrading for larger properties.</p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onUpgrade}>
                View Upgrade Options
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Number of floors */}
      <div className="space-y-2">
        <Label htmlFor="number_of_floors" className="flex items-center gap-2">
          <Layers className="w-4 h-4" /> Number of Floors *
        </Label>
        <Input
          id="number_of_floors"
          type="number"
          min="1"
          max="10"
          value={details.number_of_floors}
          onChange={(e) => setDetails(prev => ({ ...prev, number_of_floors: Number(e.target.value) }))}
          required
        />
      </div>

      {/* Ground floor or upstairs */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <ArrowUp className="w-4 h-4" /> Service Location *
        </Label>
        <RadioGroup
          value={details.floor_type}
          onValueChange={(value: 'ground' | 'upstairs') =>
            setDetails(prev => ({ ...prev, floor_type: value }))
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ground" id="ground" />
            <Label htmlFor="ground" className="font-normal cursor-pointer">Ground Floor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upstairs" id="upstairs" />
            <Label htmlFor="upstairs" className="font-normal cursor-pointer">Upstairs</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Outdoor area */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Trees className="w-4 h-4" /> Outdoor Area
        </Label>
        <RadioGroup
          value={details.has_outdoor_area ? 'yes' : 'no'}
          onValueChange={(value) =>
            setDetails(prev => ({ ...prev, has_outdoor_area: value === 'yes' }))
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="outdoor-yes" />
            <Label htmlFor="outdoor-yes" className="font-normal cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="outdoor-no" />
            <Label htmlFor="outdoor-no" className="font-normal cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full"
        disabled={exceedsBasicLimit || !!exceedsMaxSqft || details.property_sqft <= 0}
      >
        Continue to {isBasicPackage ? 'Booking' : 'Add-ons'}
      </Button>
    </motion.form>
  );
}
