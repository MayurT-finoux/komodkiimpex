-- Create public wrapper function for Supabase REST API access
CREATE OR REPLACE FUNCTION public.get_product_types()
RETURNS TABLE (
  id INT,
  name TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM komodkiimpex.get_product_types();
$$;

-- Grant permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_product_types() TO anon, authenticated;