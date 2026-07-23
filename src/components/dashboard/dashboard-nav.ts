import {
  LayoutGrid,
  Building2,
  CalendarDays,
  Inbox,
  LifeBuoy,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  href: string;
  key: string;
  icon: LucideIcon;
}

/** Shared dashboard navigation — used by the desktop sidebar and mobile drawer. */
export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: "/dashboard", key: "overview", icon: LayoutGrid },
  { href: "/dashboard/listings", key: "listings", icon: Building2 },
  { href: "/dashboard/calendar", key: "calendar", icon: CalendarDays },
  { href: "/dashboard/requests", key: "requests", icon: Inbox },
  { href: "/dashboard/support", key: "support", icon: LifeBuoy },
  { href: "/dashboard/settings", key: "settings", icon: Settings },
];
