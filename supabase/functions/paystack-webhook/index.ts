// Paystack calls this itself, so paid orders are recorded even if the
// customer closes the tab right after paying.
// Deploy: supabase functions deploy paystack-webhook --no-verify-jwt
// Then set the webhook URL in Paystack (Settings > API Keys & Webhooks):
//   https://<project-ref>.supabase.co/functions/v1/paystack-webhook
import { finalizeOrder } from "../_shared/finalize.ts";

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

Deno.serve(async (req) => {
  const raw = await req.text();

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("PAYSTACK_SECRET_KEY")!),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const expected = toHex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw))
  );

  if (expected !== req.headers.get("x-paystack-signature")) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(raw);
  if (event.event === "charge.success" && event.data?.reference) {
    await finalizeOrder(event.data.reference);
  }
  return new Response("ok", { status: 200 });
});
