import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Booking, BookingInput } from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "db.json");

async function readBookings(): Promise<Booking[]> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  const data = JSON.parse(raw);
  return data.bookings ?? [];
}

async function writeBookings(bookings: Booking[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify({ bookings }, null, 2), "utf-8");
}

export async function GET() {
  try {
    const bookings = await readBookings();
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Failed to load bookings." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input: BookingInput = await request.json();
    const bookings = await readBookings();
    const newBooking: Booking = { id: randomUUID(), ...input };
    bookings.push(newBooking);
    await writeBookings(bookings);
    return NextResponse.json(newBooking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
  }
}