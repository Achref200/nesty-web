import { createClient } from "@/lib/supabase/server";
import type {
  TicketSeverity,
  TicketStatus,
  TicketType,
} from "@/lib/tickets-config";

export * from "@/lib/tickets-config";

export interface TicketSummary {
  id: string;
  subject: string;
  type: TicketType;
  severity: TicketSeverity;
  area: string | null;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorRole: string;
  body: string;
  attachments: string[];
  createdAt: string;
}

export interface TicketDetail extends TicketSummary {
  description: string | null;
  attachments: string[];
  reporterId: string;
  messages: TicketMessage[];
}

/** Tickets opened by the signed-in agency, most-recently-active first. */
export async function getAgencyTickets(): Promise<TicketSummary[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("support_tickets")
    .select("id, subject, type, severity, area, status, created_at, updated_at")
    .eq("reporter_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(100);

  return (data ?? []).map((r) => ({
    id: r.id,
    subject: r.subject,
    type: r.type,
    severity: r.severity,
    area: r.area,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

/** A single ticket owned by the current agency, with its full conversation. */
export async function getAgencyTicket(id: string): Promise<TicketDetail | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .eq("reporter_id", user.id)
    .maybeSingle();
  if (!ticket) return null;

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, author_id, author_role, body, attachments, created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return {
    id: ticket.id,
    subject: ticket.subject,
    type: ticket.type,
    severity: ticket.severity,
    area: ticket.area,
    status: ticket.status,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    description: ticket.description,
    attachments: ticket.attachments ?? [],
    reporterId: ticket.reporter_id,
    messages: (messages ?? []).map((m) => ({
      id: m.id,
      authorId: m.author_id,
      authorRole: m.author_role,
      body: m.body,
      attachments: m.attachments ?? [],
      createdAt: m.created_at,
    })),
  };
}
