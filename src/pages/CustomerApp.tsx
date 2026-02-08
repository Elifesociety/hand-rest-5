import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SplashScreen } from '@/components/customer/SplashScreen';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { QuickCleanBanner } from '@/components/customer/QuickCleanBanner';
import { PackageCard } from '@/components/customer/PackageCard';
import { BookingForm, BookingFormData } from '@/components/customer/BookingForm';
import { useServiceCategories, usePackages } from '@/hooks/useServices';
import { useCreateBooking } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/handrest-logo.jpeg';
import type { ServiceCategory, Package } from '@/types/database';

type Screen = 'splash' | 'home' | 'packages' | 'booking' | 'confirmation';

export default function CustomerApp() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingNumber, setBookingNumber] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories();
  const { data: packages, isLoading: packagesLoading } = usePackages(selectedCategory?.id);
  const createBooking = useCreateBooking();
  const { toast } = useToast();

  const handleSplashComplete = () => {
    setScreen('home');
  };

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setScreen('packages');
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setScreen('booking');
  };

  const handleQuickClean = () => {
    // Find the basic package from home cleaning
    const homeCategory = categories?.find(c => c.name === 'Home Cleaning');
    if (homeCategory) {
      const basicPkg = packages?.find(p => p.name === 'BASIC PACKAGE' && p.category_id === homeCategory.id);
      if (basicPkg) {
        setSelectedPackage(basicPkg);
        setScreen('booking');
        return;
      }
    }
    // If not found, go to home cleaning
    setSelectedCategory(categories?.find(c => c.name === 'Home Cleaning') || null);
    setScreen('packages');
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!selectedPackage) return;

    try {
      const booking = await createBooking.mutateAsync({
        package_id: selectedPackage.id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        pincode: data.pincode,
        floor_number: data.floor_number,
        property_sqft: data.property_sqft,
        scheduled_date: data.scheduled_date,
        scheduled_time: data.scheduled_time,
        special_instructions: data.special_instructions,
        base_price: selectedPackage.price,
        addon_price: 0,
        total_price: selectedPackage.price,
      });

      setBookingNumber(booking.booking_number);
      setScreen('confirmation');
      
      toast({
        title: 'Booking Confirmed!',
        description: `Your booking number is ${booking.booking_number}`,
      });
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    if (screen === 'packages') {
      setSelectedCategory(null);
      setScreen('home');
    } else if (screen === 'booking') {
      setSelectedPackage(null);
      setScreen('packages');
    } else if (screen === 'confirmation') {
      setSelectedCategory(null);
      setSelectedPackage(null);
      setBookingNumber('');
      setScreen('home');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {screen === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {screen !== 'splash' && (
        <>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              {screen !== 'home' ? (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              ) : (
                <img src={logo} alt="HandRest" className="h-10 object-contain" />
              )}
              
              <h1 className="text-lg font-semibold text-brand-navy">
                {screen === 'home' && 'HandRest'}
                {screen === 'packages' && selectedCategory?.name}
                {screen === 'booking' && 'Book Service'}
                {screen === 'confirmation' && 'Booking Confirmed'}
              </h1>
              
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6 pb-24">
            {/* Home Screen */}
            {screen === 'home' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Tagline */}
                <div className="text-center py-4">
                  <p className="text-brand-teal font-medium italic">
                    "You Relax. We Restore."
                  </p>
                </div>

                {/* Quick Clean Banner */}
                <QuickCleanBanner onTryNow={handleQuickClean} />

                {/* Track Booking */}
                <div className="bg-card rounded-xl p-4 shadow-soft">
                  <h3 className="font-semibold text-foreground mb-3">Track Your Booking</h3>
                  <div className="flex gap-2">
                    <Input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter booking number"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Our Services</h2>
                  {categoriesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categories?.map((category, index) => (
                        <ServiceCard
                          key={category.id}
                          category={category}
                          onClick={() => handleCategorySelect(category)}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Packages Screen */}
            {screen === 'packages' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {packagesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  packages?.map((pkg, index) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      onSelect={() => handlePackageSelect(pkg)}
                      index={index}
                      isPopular={index === 1}
                    />
                  ))
                )}
              </motion.div>
            )}

            {/* Booking Form Screen */}
            {screen === 'booking' && selectedPackage && (
              <BookingForm
                pkg={selectedPackage}
                onSubmit={handleBookingSubmit}
                isLoading={createBooking.isPending}
              />
            )}

            {/* Confirmation Screen */}
            {screen === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 gradient-brand rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-brand-navy mb-2">
                  Booking Confirmed!
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Thank you for choosing HandRest Cleaning Solutions
                </p>
                
                <div className="bg-brand-light-blue rounded-xl p-6 mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Booking Number</p>
                  <p className="text-3xl font-bold text-brand-navy">{bookingNumber}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-8">
                  We'll send a confirmation to your email with all the details.
                  Our team will contact you before the scheduled time.
                </p>
                
                <Button variant="hero" size="xl" onClick={handleBack}>
                  Book Another Service
                </Button>
              </motion.div>
            )}
          </main>

          {/* Bottom Navigation */}
          {screen === 'home' && (
            <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-elevated">
              <div className="container mx-auto px-4 h-20 flex items-center justify-center">
                <Button variant="hero" size="xl" onClick={() => setScreen('home')}>
                  Book Now
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
