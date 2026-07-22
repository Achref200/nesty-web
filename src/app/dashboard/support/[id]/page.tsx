import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketReply } from "@/components/dashboard/ticket-reply";
import { getAgencyTicket, splitTicketBody, type TicketStatus } from "@/lib/tickets";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ticket",
  robots: { index: false, follow: false },
};

const STATUS_VARIANT: Record<
  TicketStatus,
  "solid" | "soft" | "muted" | "outline"
> = {
  open: "solid",
  in_progress: "soft",
  resolved: "outline",
  closed: "muted",
};

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [t, locale, ticket] = await Promise.all([
    getTranslations("dashboard.support"),
    getLocale(),
    getAgencyTicket(params.id),
  ]);
  if (!ticket) notFound();

  const fmt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const closed = ticket.status === "closed";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/dashboard/support">
          <ArrowLeft className="h-4 w-4" /> {t("form.back")}
        </Link>
      </Button>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {ticket.subject}
          </h1>
          <Badge variant={STATUS_VARIANT[ticket.status]}>
            {t(`status.${ticket.status}`)}
          </Badge>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          {t(`areas.${ticket.area ?? "other"}`)} · {t(`types.${ticket.type}`)} ·{" "}
          {t(`severities.${ticket.severity}`)} ·{" "}
          {t("reportedOn", { date: fmt.format(new Date(ticket.createdAt)) })}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Opening report — always from the agency */}
        <Bubble
          mine
          author={t("you")}
          time={fmt.format(new Date(ticket.createdAt))}
          body={ticket.description}
          attachments={ticket.attachments}
        />
        {ticket.messages.map((m) => {
          const mine = m.authorId === ticket.reporterId;
          return (
            <Bubble
              key={m.id}
              mine={mine}
              author={mine ? t("you") : t("supportTeam")}
              time={fmt.format(new Date(m.createdAt))}
              body={m.body}
              attachments={m.attachments}
            />
          );
        })}
      </div>

      {closed ? (
        <p className="rounded-2xl border border-separator bg-fill p-4 text-center text-[14px] text-muted">
          {t("reply.closed")}
        </p>
      ) : (
        <TicketReply ticketId={ticket.id} />
      )}
    </div>
  );
}

function Bubble({
  mine,
  author,
  time,
  body,
  attachments,
}: {
  mine: boolean;
  author: string;
  time: string;
  body: string | null;
  attachments: string[];
}) {
  const { text, images } = splitTicketBody(body, attachments);
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-2 rounded-2xl border border-separator p-4",
          mine ? "bg-fill" : "bg-card",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13px] font-bold text-ink">{author}</span>
          <span className="text-[12px] text-muted">{time}</span>
        </div>
        {text && (
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink/80">
            {text}
          </p>
        )}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-24 w-24 overflow-hidden rounded-xl border border-separator bg-fill"
              >
                <Image
                  src={url}
                  alt={`Screenshot ${i + 1}`}
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
