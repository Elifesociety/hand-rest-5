import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ServiceCategory, Package } from '@/types/database';

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as ServiceCategory[];
    },
  });
}

export function usePackages(categoryId?: string) {
  return useQuery({
    queryKey: ['packages', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('packages')
        .select(`
          *,
          category:service_categories(*)
        `)
        .order('display_order');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Package[];
    },
  });
}

export function usePackage(packageId: string) {
  return useQuery({
    queryKey: ['package', packageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          category:service_categories(*)
        `)
        .eq('id', packageId)
        .single();
      
      if (error) throw error;
      return data as Package;
    },
    enabled: !!packageId,
  });
}
