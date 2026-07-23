import { MonthCalendar } from "@/components/dashboard/month-calendar";
import { getCalendarData } from "@/lib/queries";

export default async function CalendarPage() {
  const data = await getCalendarData();
  return (
    <MonthCalendar
      reservations={data.reservations}
      blocks={data.blocks}
      listings={data.listings}
    />
  );
}
