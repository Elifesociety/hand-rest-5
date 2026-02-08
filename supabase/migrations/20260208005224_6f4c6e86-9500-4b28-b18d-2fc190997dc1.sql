-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled');

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table for user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff_details table for staff-specific info
CREATE TABLE public.staff_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    is_available BOOLEAN NOT NULL DEFAULT true,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_categories table
CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 1,
    min_staff INTEGER NOT NULL DEFAULT 2,
    max_sqft INTEGER,
    features TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table (supports guest and authenticated users)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT NOT NULL UNIQUE,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    -- Customer info (for guests)
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    -- Authenticated user reference (null for guests)
    customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- Address details
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL DEFAULT 'Chennai',
    pincode TEXT NOT NULL,
    floor_number INTEGER DEFAULT 0,
    property_sqft INTEGER,
    -- Booking details
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    special_instructions TEXT,
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    addon_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create booking_staff_assignments table
CREATE TABLE public.booking_staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    staff_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (booking_id, staff_user_id)
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ratings table
CREATE TABLE public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create helper function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Create helper function to check if user is staff
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'staff')
$$;

-- Create function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.booking_number := 'HR' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Create trigger for booking number generation
CREATE TRIGGER generate_booking_number_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.generate_booking_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_details_updated_at BEFORE UPDATE ON public.staff_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.is_admin());
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- RLS Policies for staff_details
CREATE POLICY "Admins can manage staff details" ON public.staff_details FOR ALL USING (public.is_admin());
CREATE POLICY "Staff can view own details" ON public.staff_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can update own availability" ON public.staff_details FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for service_categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.service_categories FOR ALL USING (public.is_admin());

-- RLS Policies for packages (public read, admin write)
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage packages" ON public.packages FOR ALL USING (public.is_admin());

-- RLS Policies for bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can view own bookings by email" ON public.bookings FOR SELECT USING (
  customer_user_id = auth.uid() OR 
  public.is_admin() OR 
  public.is_staff()
);
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (public.is_admin());
CREATE POLICY "Staff can update assigned bookings" ON public.bookings FOR UPDATE USING (
  public.is_staff() AND EXISTS (
    SELECT 1 FROM public.booking_staff_assignments 
    WHERE booking_id = id AND staff_user_id = auth.uid()
  )
);

-- RLS Policies for booking_staff_assignments
CREATE POLICY "Admins can manage assignments" ON public.booking_staff_assignments FOR ALL USING (public.is_admin());
CREATE POLICY "Staff can view own assignments" ON public.booking_staff_assignments FOR SELECT USING (staff_user_id = auth.uid());

-- RLS Policies for payments
CREATE POLICY "Anyone can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all payments" ON public.payments FOR ALL USING (public.is_admin());
CREATE POLICY "Users can view payments for own bookings" ON public.payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id AND customer_user_id = auth.uid()
  )
);

-- RLS Policies for ratings
CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can create ratings" ON public.ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage ratings" ON public.ratings FOR ALL USING (public.is_admin());

-- Insert default service categories
INSERT INTO public.service_categories (name, description, icon, display_order) VALUES
('Home Cleaning', 'Professional home cleaning services', 'home', 1),
('Office Cleaning', 'Commercial office cleaning services', 'building', 2),
('Event Cleaning', 'Auditorium and event venue cleaning', 'calendar', 3);

-- Insert default packages for Home Cleaning
INSERT INTO public.packages (category_id, name, description, price, duration_hours, min_staff, max_sqft, features, display_order) VALUES
(
  (SELECT id FROM public.service_categories WHERE name = 'Home Cleaning'),
  'BASIC PACKAGE',
  '1 hour cleaning for homes up to 1000 sq.ft',
  1200.00,
  1,
  2,
  1000,
  ARRAY['1 hour cleaning', 'Minimum 2 women staff', 'Up to 1000 sq.ft', 'Ground floor only', 'Basic dust cleaning', 'Simple floor wash', 'No deep cleaning', 'No outdoor cleaning'],
  1
),
(
  (SELECT id FROM public.service_categories WHERE name = 'Home Cleaning'),
  'STANDARD PACKAGE',
  'Complete home cleaning with kitchen and washroom deep cleaning',
  2999.00,
  3,
  3,
  1500,
  ARRAY['Includes Basic package', 'Kitchen deep cleaning', 'Washroom deep cleaning', 'Outdoor cleaning available', 'Maximum 1500 sq.ft'],
  2
),
(
  (SELECT id FROM public.service_categories WHERE name = 'Home Cleaning'),
  'PREMIUM PACKAGE',
  'Full deep cleaning with no restrictions',
  5500.00,
  5,
  4,
  NULL,
  ARRAY['Includes Standard package', 'Full deep cleaning', 'No size restriction', 'Multiple floors allowed', 'Add-on services enabled'],
  3
);

-- Insert packages for Office Cleaning
INSERT INTO public.packages (category_id, name, description, price, duration_hours, min_staff, max_sqft, features, display_order) VALUES
(
  (SELECT id FROM public.service_categories WHERE name = 'Office Cleaning'),
  'SMALL OFFICE',
  'For offices up to 1500 sq.ft',
  2500.00,
  2,
  2,
  1500,
  ARRAY['2 hours cleaning', '2 women staff', 'Up to 1500 sq.ft', 'Desk and floor cleaning', 'Washroom sanitization'],
  1
),
(
  (SELECT id FROM public.service_categories WHERE name = 'Office Cleaning'),
  'MEDIUM OFFICE',
  'For offices up to 3000 sq.ft',
  4500.00,
  4,
  4,
  3000,
  ARRAY['4 hours cleaning', '4 women staff', 'Up to 3000 sq.ft', 'Complete office cleaning', 'Pantry cleaning included'],
  2
),
(
  (SELECT id FROM public.service_categories WHERE name = 'Office Cleaning'),
  'LARGE OFFICE',
  'For offices above 3000 sq.ft',
  7500.00,
  6,
  6,
  NULL,
  ARRAY['6 hours cleaning', '6+ women staff', 'No size limit', 'Full deep cleaning', 'Custom requirements'],
  3
);

-- Insert packages for Event Cleaning
INSERT INTO public.packages (category_id, name, description, price, duration_hours, min_staff, max_sqft, features, display_order) VALUES
(
  (SELECT id FROM public.service_categories WHERE name = 'Event Cleaning'),
  'PRE-EVENT CLEANING',
  'Venue preparation before events',
  3500.00,
  3,
  4,
  NULL,
  ARRAY['3 hours cleaning', '4 women staff', 'Floor polishing', 'Seating area cleaning', 'Stage cleaning'],
  1
),
(
  (SELECT id FROM public.service_categories WHERE name = 'Event Cleaning'),
  'POST-EVENT CLEANING',
  'Complete cleanup after events',
  5000.00,
  4,
  6,
  NULL,
  ARRAY['4 hours cleaning', '6 women staff', 'Waste removal', 'Deep floor cleaning', 'Washroom sanitization'],
  2
),
(
  (SELECT id FROM public.service_categories WHERE name = 'Event Cleaning'),
  'FULL EVENT PACKAGE',
  'Pre and post event cleaning combined',
  7500.00,
  8,
  8,
  NULL,
  ARRAY['8 hours total', '8 women staff', 'Pre-event preparation', 'Post-event cleanup', 'On-call during event'],
  3
);