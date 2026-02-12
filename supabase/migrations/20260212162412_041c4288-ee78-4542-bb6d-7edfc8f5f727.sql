-- Fix: Allow super_admins to manage all bookings too
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (is_admin() OR is_super_admin());

-- Also fix the SELECT policy to include super_admin
DROP POLICY IF EXISTS "Customers can view own bookings by email" ON public.bookings;
CREATE POLICY "Customers can view own bookings by email" 
ON public.bookings 
FOR SELECT 
USING ((customer_user_id = auth.uid()) OR is_admin() OR is_super_admin() OR is_staff());