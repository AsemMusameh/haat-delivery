import { NextRequest, NextResponse } from "next/server";
import {
  mockSchedule,
  type ScheduleEntry,
  type ShiftType,
} from "@/lib/employee-data";
import { getPortalActor } from "@/lib/portal-actor";

type ConnecteamShift = {
  id: string;
  title?: string;
  assignedUserIds?: number[];
  startTime: number;
  endTime: number;
  timezone?: string;
  locationData?: { gps?: { address?: string } };
  breaks?: { duration?: number }[];
  notes?: { html?: string }[];
};
const unix = (date: string, end = false) =>
  Math.floor(
    new Date(`${date}T${end ? "23:59:59" : "00:00:00"}Z`).getTime() / 1000,
  );
const clock = (value: number) =>
  new Date(value * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jerusalem",
  });
const clean = (html?: string) =>
  html
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const mapShift = (
  shift: ConnecteamShift,
  employeeId: string,
  employeeName: string,
  department: string,
): ScheduleEntry => {
  const start = new Date(shift.startTime * 1000),
    startHour = Number(clock(shift.startTime).slice(0, 2));
  const durationHours = (shift.endTime - shift.startTime) / 3600;
  const shiftType: ShiftType =
    startHour < 12
      ? "Morning Shift"
      : startHour < 17
        ? "Evening Shift"
        : "Night Shift";
  return {
    id: shift.id,
    employeeId,
    employeeName,
    department,
    date: start.toISOString().slice(0, 10),
    day: start.toLocaleDateString("ar", {
      weekday: "long",
      timeZone: "Asia/Jerusalem",
    }),
    start: clock(shift.startTime),
    end: clock(shift.endTime),
    duration: `${durationHours.toFixed(durationHours % 1 ? 1 : 0)}h`,
    shiftType,
    breakMinutes: (shift.breaks || []).reduce(
      (sum, item) => sum + (item.duration || 0),
      0,
    ),
    status: "Working",
    notes: clean(shift.notes?.[0]?.html),
    location: shift.locationData?.gps?.address,
  };
};

export async function GET(request: NextRequest) {
  try {
    const actor = await getPortalActor();
    const apiUrl =
        process.env.CONNECTEAM_API_URL || "https://api.connecteam.com",
      apiKey = process.env.CONNECTEAM_API_KEY,
      schedulerId = process.env.CONNECTEAM_SCHEDULER_ID;
    if (!apiKey || !schedulerId)
      return NextResponse.json({
        source: "demo",
        connected: false,
        message:
          "أضف CONNECTEAM_API_KEY و CONNECTEAM_SCHEDULER_ID لتفعيل المزامنة.",
        schedule: mockSchedule,
      });
    const from =
        request.nextUrl.searchParams.get("from") ||
        new Date().toISOString().slice(0, 10),
      to = request.nextUrl.searchParams.get("to") || from;
    const url = new URL(
      `/scheduler/v1/schedulers/${schedulerId}/shifts`,
      apiUrl,
    );
    url.searchParams.set("startTime", String(unix(from)));
    url.searchParams.set("endTime", String(unix(to, true)));
    url.searchParams.set("assignedUserIds", actor.employeeId);
    url.searchParams.set("isPublished", "true");
    url.searchParams.set("limit", "100");
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey, Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`CONNECTEAM_${response.status}`);
    const result = (await response.json()) as {
      data?: { shifts?: ConnecteamShift[] };
    };
    const shifts = (result.data?.shifts || []).map((shift) =>
      mapShift(shift, actor.employeeId, actor.fullName, actor.department),
    );
    return NextResponse.json({
      source: "connecteam",
      connected: true,
      schedule: shifts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        source: "error",
        connected: false,
        message: error instanceof Error ? error.message : "CONNECTEAM_ERROR",
        schedule: mockSchedule,
      },
      { status: 200 },
    );
  }
}
