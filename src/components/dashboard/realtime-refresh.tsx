"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Keeps the dashboard live.
 *
 * Every page under /dashboard is a server component that reads through
 * `queries.ts`, so the only way to show new data is to re-run the server
 * render. This subscribes to the tables an agency actually watches and calls
 * `router.refresh()` when one of them moves — which re-fetches the current
 * route on the server and reconciles it into the existing tree, so scroll
 * position, open dialogs and focus all survive.
 *
 * Scoped to the signed-in agency by `host_id`, so an agency is never woken up
 * by another agency's traffic. RLS would filter the rows anyway; the filter
 * here saves the round-trip.
 *
 * Mounted once in the dashboard layout. Renders nothing.
 */
export function RealtimeRefresh() {
  const router = useRouter();
  // A burst of changes (accepting a booking writes the reservation, an event
  // and a notification) should cost one refresh, not three.
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClient();
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const refresh = () => {
      if (pending.current) clearTimeout(pending.current);
      pending.current = setTimeout(() => router.refresh(), 250);
    };

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      channel = supabase
        .channel(`dashboard:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reservations",
            filter: `host_id=eq.${user.id}`,
          },
          refresh,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "availability_blocks",
            filter: `host_id=eq.${user.id}`,
          },
          refresh,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          refresh,
        )
        // Incidents carry no host column — RLS already limits them to the
        // reporting agency, so an unfiltered subscription is safe here.
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reservation_incidents" },
          refresh,
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (pending.current) clearTimeout(pending.current);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
