-- Create a security definer function to allow authenticated users to delete their own account.
-- This bypasses the need for supabaseAdmin service role credentials on the server side.
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete the user from auth.users (cascades to public tables)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute permissions to the authenticated role
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
