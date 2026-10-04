// Called by the browser after Paystack's popup reports success.
// Deploy: supabase functions deploy paystack-verify
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { finalizeOrder } from "../_shared/finalize.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "Not logged in" }, 401);

  const { reference } = await req.json().catch(() => ({}));
  if (!reference || typeof reference !== "string") {
    return json({ error: "Missing reference" }, 400);
  }

  const result = await finalizeOrder(reference, user.id);
  return result.ok ? json(result) : json({ error: result.error }, result.code);
});
