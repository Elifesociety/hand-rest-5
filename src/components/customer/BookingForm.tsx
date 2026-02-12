import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { usePanchayaths } from '@/hooks/usePanchayaths';

interface BookingFormProps {
  totalPrice: number;
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
}

export interface BookingFormData {
  customer_name: string;
  customer_phone: string;
  panchayath_id: string;
  ward_number: number;
  landmark: string;
  property_sqft: number;
  scheduled_date: string;
  scheduled_time: string;
  special_instructions: string;
}

export function BookingForm({ totalPrice, onSubmit, isLoading }: BookingFormProps) {
  const { profile } = useAuth();
  const { data: panchayaths } = usePanchayaths();

  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: '',
    customer_phone: '',
    panchayath_id: '',
    ward_number: 0,
    landmark: '',
    property_sqft: 0,
    scheduled_date: '',
    scheduled_time: '09:00',
    special_instructions: '',
  });

  // Auto-fill from profile
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        customer_name: profile.full_name || prev.customer_name,
        customer_phone: profile.phone || prev.customer_phone,
        panchayath_id: (profile as any).panchayath_id || prev.panchayath_id,
        ward_number: (profile as any).ward_number || prev.ward_number,
      }));
    }
  }, [profile]);

  const selectedPanchayath = panchayaths?.find(p => p.id === formData.panchayath_id);
  const wardOptions = selectedPanchayath
    ? Array.from({ length: selectedPanchayath.ward_count }, (_, i) => i + 1)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Contact Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <User className="w-4 h-4" />
          Contact Details
        </h4>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="customer_name">Full Name *</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="customer_phone">Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="customer_phone"
                name="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={handleChange}
                className="pl-10"
                placeholder="9876543210"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location Details
        </h4>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Panchayath *</Label>
              <Select
                value={formData.panchayath_id}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, panchayath_id: value, ward_number: 0 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select panchayath" />
                </SelectTrigger>
                <SelectContent>
                  {panchayaths?.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ward *</Label>
              <Select
                value={formData.ward_number ? String(formData.ward_number) : ''}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, ward_number: Number(value) }))
                }
                disabled={!formData.panchayath_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {wardOptions.map(w => (
                    <SelectItem key={w} value={String(w)}>Ward {w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="landmark">Landmark *</Label>
            <Input
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Nearby landmark or location reference"
              required
            />
          </div>

          <div>
            <Label htmlFor="property_sqft">Property Size (sq.ft)</Label>
            <Input
              id="property_sqft"
              name="property_sqft"
              type="number"
              min="0"
              value={formData.property_sqft}
              onChange={handleChange}
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Schedule
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scheduled_date">Date *</Label>
            <Input
              id="scheduled_date"
              name="scheduled_date"
              type="date"
              min={minDate}
              value={formData.scheduled_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="scheduled_time">Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="scheduled_time"
                name="scheduled_time"
                type="time"
                min="08:00"
                max="18:00"
                value={formData.scheduled_time}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-2">
        <Label htmlFor="special_instructions" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Special Instructions
        </Label>
        <Textarea
          id="special_instructions"
          name="special_instructions"
          value={formData.special_instructions}
          onChange={handleChange}
          placeholder="Any specific requirements or instructions..."
          rows={3}
        />
      </div>

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Amount</span>
          <span className="text-2xl font-bold text-brand-teal">
            ₹{totalPrice.toLocaleString()}
          </span>
        </div>

        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>
    </motion.form>
  );
}
