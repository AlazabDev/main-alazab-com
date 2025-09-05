/* File: supabase/functions/create-profile.ts */

import { createClient } from "npm:@supabase/supabase-js@2.39.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  // Verify the request came from Supabase Auth webhook
  const { event, session } = await supabase.auth.getSessionFromRequest(req);
  if (event !== "SIGNED_IN" || !session?.user) {
    return new Response("Ignored", { status: 204 });
  }

  const { id, email } = session.user;

  // Upsert ensures the row is created only once
  await supabase.from("public.profiles").upsert({
    id,
    email,
    created_at: new Date(),
  });

  return new Response("Profile ensured", { status: 200 });
});
