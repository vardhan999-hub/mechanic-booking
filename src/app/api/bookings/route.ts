import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Booking, BookingInput } from "@/lib/types";

interface BookingRow {
  id: string;
  customer_name: string;
  vehicle_number: string;
  date: string;
  service_type: string;
  status: Booking["status"];
}

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    customerName: row.customer_name,
    vehicleNumber: row.vehicle_number,
    date: row.date,
    serviceType: row.service_type,
    status: row.status,
  };
}

function toRow(input: BookingInput) {
  return {
    customer_name: input.customerName,
    vehicle_number: input.vehicleNumber,
    date: input.date,
    service_type: input.serviceType,
    status: input.status,
  };
}

export async function GET() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load bookings." }, { status: 500 });
  }
  return NextResponse.json((data ?? []).map(toBooking));
}

export async function POST(request: NextRequest) {
  const input: BookingInput = await request.json();
  const { data, error } = await supabase
    .from("bookings")
    .insert(toRow(input))
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
  }
  return NextResponse.json(toBooking(data), { status: 201 });
}
