
-- Add landmark to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS landmark text;

-- Make address fields nullable/optional since we're simplifying
ALTER TABLE public.bookings ALTER COLUMN address_line1 SET DEFAULT '';
ALTER TABLE public.bookings ALTER COLUMN city SET DEFAULT 'N/A';
ALTER TABLE public.bookings ALTER COLUMN pincode SET DEFAULT 'N/A';

-- Add panchayath and ward to profiles for customer data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS panchayath_id uuid REFERENCES public.panchayaths(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ward_number integer;
