"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Send, ImagePlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dots } from "@/components/ui/dots";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { replyTicket, type ReplyState } from "@/lib/actions/tickets";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("dashboard.support.reply");
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          {t("sending")} <Dots />
        </span>
      ) : (
        <>
          <Send className="h-4 w-4" /> {t("send")}
        </>
      )}
    </Button>
  );
}

/** Reply box for an agency's own ticket — text plus optional screenshots. */
export function TicketReply({ ticketId }: { ticketId: string }) {
  const t = useTranslations("dashboard.support");
  const router = useRouter();
  const [state, formAction] = useFormState<ReplyState, FormData>(
    replyTicket,
    {},
  );
  const [screens, setScreens] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setScreens([]);
      setShowUpload(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-separator bg-card p-3"
    >
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="attachments" value={screens.join(",")} />
      <textarea
        name="body"
        rows={3}
        required
        placeholder={t("reply.placeholder")}
        className="w-full resize-y rounded-xl border border-separator bg-paper p-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-soft focus:border-ink"
      />

      {showUpload && (
        <div className="mt-3">
          <ImageUpload onChange={setScreens} />
        </div>
      )}

      {state?.error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowUpload((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:bg-fill hover:text-ink"
        >
          <ImagePlus className="h-4 w-4" /> {t("screenshots")}
        </button>
        <SubmitButton />
      </div>
    </form>
  );
}
