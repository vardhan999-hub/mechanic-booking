import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const input: BookingInput = await request.json();
    const bookings = await readBookings();
    const index = bookings.findIndex((b) => b.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    const updated: Booking = { id: params.id, ...input };
    bookings[index] = updated;
    await writeBookings(bookings);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookings = await readBookings();
    const filtered = bookings.filter((b) => b.id !== params.id);
    if (filtered.length === bookings.length) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    await writeBookings(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
  }
}