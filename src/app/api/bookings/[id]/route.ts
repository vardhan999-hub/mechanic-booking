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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const input: BookingInput = await request.json();
  const { data, error } = await supabase
    .from("bookings")
    .update(toRow(input))
    .eq("id", params.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json(toBooking(data));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase.from("bookings").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
