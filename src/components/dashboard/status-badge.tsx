import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { type ReservationStatus } from "@/data/types";

const VARIANT: Record<
  ReservationStatus,
  "solid" | "soft" | "muted" | "outline"
> = {
  confirmed: "solid",
  pending: "soft",
  completed: "muted",
  cancelled: "muted",
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const t = useTranslations("dashboard.status");
  return <Badge variant={VARIANT[status]}>{t(status)}</Badge>;
}
