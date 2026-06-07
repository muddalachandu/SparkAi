import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const deleteCurrentUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    if (!userId) {
      throw new Error("Unauthorized: No user ID found");
    }

    console.log(`[auth] Initiating deletion for user ID: ${userId}`);
  console.log(`[auth] Using supabaseAdmin client:`, !!supabaseAdmin);
  console.log(`[auth] Deleting user account: ${userId}`);

    // Call Supabase admin auth API to delete the user.
    // This will trigger cascade delete on all foreign key references in public schema.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error(`[auth] Error deleting user:`, error);
      throw new Error(error.message);
    }

    return { success: true };
  });
